import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { id: inviteId } = await params;
        const body = await req.json();
        const { action } = body; // "accept" | "reject"

        if (action !== "accept" && action !== "reject") {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const invite = await prisma.projectInvite.findUnique({
            where: { id: inviteId },
            include: { project: true }
        });

        if (!invite) {
            return NextResponse.json({ error: "초대 내역을 찾을 수 없습니다." }, { status: 404 });
        }

        if (invite.agencyId !== userId) {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
        }

        if (invite.status !== "PENDING") {
            return NextResponse.json({ error: `이 초대는 이미 ${invite.status} 상태입니다.` }, { status: 400 });
        }

        if (action === "reject") {
            await prisma.projectInvite.update({
                where: { id: inviteId },
                data: { status: "REJECTED" }
            });
            return NextResponse.json({ success: true, message: "초대를 거절했습니다." });
        }

        // action === "accept"
        // 1. Update Project.agencyId
        await prisma.project.update({
            where: { id: invite.projectId },
            data: { agencyId: userId }
        });

        // 2. Add to WorkspaceMember
        await prisma.workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: invite.project.workspaceId,
                    userId: userId
                }
            },
            update: {
                role: 'member'
            },
            create: {
                workspaceId: invite.project.workspaceId,
                userId: userId,
                role: 'member'
            }
        });

        // 3. Mark invite as ACCEPTED
        await prisma.projectInvite.update({
            where: { id: inviteId },
            data: { status: "ACCEPTED" }
        });

        return NextResponse.json({ success: true, message: "초대를 수락했습니다." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
