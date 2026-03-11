import prisma from "@/lib/prisma";
import { FeedRoleView } from "./FeedRoleClient";

export default async function ProjectFeed({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = await params;

    // 1. Fetch Updates (새소식)
    const updates = await prisma.update.findMany({
        where: { projectId },
        include: { author: true, confirmations: { include: { user: true, replies: { include: { author: true } } } } }
    });

    // 2. Fetch Decisions (결정사항)
    const decisions = await prisma.decision.findMany({
        where: { projectId },
        include: { author: true, options: true, replies: { include: { author: true } } }
    });

    // 3. Fetch Risks (주의사항)
    const risks = await prisma.risk.findMany({
        where: { projectId },
        include: { replies: { include: { author: true } } }
    });

    // Combine & Sort chronologically (newest first)
    const feedItems = [
        ...updates.map(u => ({ ...u, _feedType: "update" as const, _date: u.createdAt })),
        ...decisions.map(d => ({ ...d, _feedType: "decision" as const, _date: d.createdAt })),
        ...risks.map(r => ({ ...r, _feedType: "risk" as const, _date: r.createdAt }))
    ].sort((a, b) => b._date.getTime() - a._date.getTime());

    return <FeedRoleView feedItems={feedItems} projectId={projectId} />;
}
