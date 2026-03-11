import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: featureId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    try {
        const feature = await prisma.feature.findUnique({
            where: { id: featureId }
        });

        if (!feature) {
             return NextResponse.json({ error: "Feature not found" }, { status: 404 });
        }

        const checklist = await prisma.featureChecklist.create({
            data: {
                featureId,
                content
            }
        });

        return NextResponse.json(checklist, { status: 201 });
    } catch (error: any) {
        console.error("Checklist Create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
