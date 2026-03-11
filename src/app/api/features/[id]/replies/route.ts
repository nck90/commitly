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
    const userId = (session.user as any).id;

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

        const reply = await prisma.reply.create({
            data: {
                content,
                authorId: userId,
                featureId
            },
            include: {
                author: {
                    select: { name: true, email: true, role: true }
                }
            }
        });

        return NextResponse.json(reply, { status: 201 });
    } catch (error: any) {
        console.error("Feature Reply Create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
