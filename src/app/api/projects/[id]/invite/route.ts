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

        const { id } = await params;
        const body = await req.json();
        const { email } = body;

        const developer = await prisma.user.findUnique({ where: { email } });
        
        if (!developer) {
            return NextResponse.json({ error: "가입된 사용자를 찾을 수 없습니다." }, { status: 404 });
        }

        if (developer.role !== "developer") {
            return NextResponse.json({ error: "해당 사용자는 개발자(파트너) 계정이 아닙니다." }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: { id },
            select: { workspaceId: true }
        });

        if (!project) {
            return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
        }

        await prisma.project.update({
            where: { id },
            data: { agencyId: developer.id }
        });

        // Add developer to workspace
        await prisma.workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: project.workspaceId,
                    userId: developer.id
                }
            },
            update: {
                role: 'member'
            },
            create: {
                workspaceId: project.workspaceId,
                userId: developer.id,
                role: 'member'
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
