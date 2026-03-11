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

        const { id: projectId } = await params;
        const userId = (session.user as any).id;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { clientId: true, agencyId: true, workspaceId: true }
        });

        if (!project) {
            return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
        }

        if (project.clientId !== userId) {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
        }

        if (!project.agencyId) {
            return NextResponse.json({ error: "연결된 파트너가 없습니다." }, { status: 400 });
        }

        const targetAgencyId = project.agencyId;

        // 1. Remove agencyId from project
        await prisma.project.update({
            where: { id: projectId },
            data: { agencyId: null }
        });

        // 2. Remove agency from WorkspaceMember
        await prisma.workspaceMember.deleteMany({
            where: {
                workspaceId: project.workspaceId,
                userId: targetAgencyId,
            }
        });

        // 3. Mark the invite as REJECTED so it doesn't show up
        await prisma.projectInvite.updateMany({
            where: {
                projectId: projectId,
                agencyId: targetAgencyId,
                status: "ACCEPTED"
            },
            data: { status: "REJECTED" }
        });

        return NextResponse.json({ success: true, message: "파트너 연결이 해제되었습니다." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
