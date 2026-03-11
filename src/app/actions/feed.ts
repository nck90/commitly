"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addReply(formData: FormData) {
    const content = formData.get("content") as string;
    const targetType = formData.get("targetType") as string; // 'update', 'decision', 'risk'
    const targetId = formData.get("targetId") as string;
    const projectId = formData.get("projectId") as string;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const authorId = (session.user as any).id;

    if (!content || !targetId) throw new Error("Missing content or targetId");

    if (targetType === "update") {
        // Find if this user already has a pending confirmation for this update to attach a reply to
        // Or if it's the author replying to their own update or just creating a general comment
        await prisma.confirmation.create({
            data: {
                updateId: targetId,
                userId: authorId,
                action: "question",
                comment: content
            }
        });
    } else if (targetType === "decision") {
        await prisma.reply.create({
            data: { authorId, decisionId: targetId, content }
        });
    } else if (targetType === "risk") {
        await prisma.reply.create({
            data: { authorId, riskId: targetId, content }
        });
    }

    revalidatePath(`/projects/${projectId}/feed`);
}
