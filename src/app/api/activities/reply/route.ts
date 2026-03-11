import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { targetId, targetType, content } = await req.json();

    if (!targetId || !targetType || !content) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        let reply;
        if (targetType === "update") {
            // For updates, we often create a Confirmation if it's from a client, 
            // or just a Reply linked to some parent if we supported nesting.
            // But the schema has Confirmation linked to Update, and Reply linked to Confirmation/Decision/Risk.
            // Let's assume InteractiveReplyForm for "updates" creates a Confirmation with action "question"
            reply = await prisma.confirmation.create({
                data: {
                    updateId: targetId,
                    userId: userId,
                    action: "question",
                    comment: content,
                }
            });
        } else if (targetType === "decision") {
            reply = await prisma.reply.create({
                data: {
                    authorId: userId,
                    decisionId: targetId,
                    content: content,
                }
            });
        } else if (targetType === "risk") {
            reply = await prisma.reply.create({
                data: {
                    authorId: userId,
                    riskId: targetId,
                    content: content,
                }
            });
        } else {
            return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
        }

        return NextResponse.json(reply);
    } catch (error: any) {
        console.error("Reply Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
