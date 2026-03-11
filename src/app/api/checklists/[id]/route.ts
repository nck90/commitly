import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { content, isCompleted } = body;

    try {
        const checklist = await prisma.featureChecklist.update({
            where: { id },
            data: {
                ...(content !== undefined && { content }),
                ...(isCompleted !== undefined && { isCompleted })
            }
        });

        return NextResponse.json(checklist);
    } catch (error: any) {
        console.error("Checklist Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.featureChecklist.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Checklist Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
