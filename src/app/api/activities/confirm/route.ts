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
    const { targetId, targetType, action, comment } = await req.json();

    if (!targetId || !action) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        if (targetType === "decision") {
            const newStatus = action === "confirmed" ? "approved" : "revision_requested";
            const decision = await prisma.decision.update({
                where: { id: targetId },
                data: {
                    status: newStatus,
                    decidedAt: newStatus === "approved" ? new Date() : null,
                }
            });

            await prisma.reply.create({
                data: {
                    authorId: userId,
                    decisionId: targetId,
                    content: action === "confirmed" ? "✅ 승인 완료" : `❌ 수정 요청: ${comment || ""}`,
                }
            });

            return NextResponse.json({ message: "Decision updated", decision });
        } else if (targetType === "risk") {
            const newStatus = action === "confirmed" ? "resolved" : "active";
            const risk = await prisma.risk.update({
                where: { id: targetId },
                data: {
                    status: newStatus
                }
            });

            await prisma.reply.create({
                data: {
                    authorId: userId,
                    riskId: targetId,
                    content: action === "confirmed" ? "✅ 확인됨" : `❌ 추가 검토: ${comment || ""}`,
                }
            });

            return NextResponse.json({ message: "Risk updated", risk });
        } else {
            // Default assumes targetType === "update" (or missing type falls back here)
            const confirmation = await prisma.confirmation.create({
                data: {
                    updateId: targetId,
                    userId: userId,
                    action: action, 
                    comment: comment || "",
                }
            });

            await prisma.update.update({
                where: { id: targetId },
                data: { status: "checked" }
            });

            return NextResponse.json(confirmation);
        }
    } catch (error: any) {
        console.error("Confirm Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
