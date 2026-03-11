import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardRoleView } from "./DashboardClient";
import { detectRisks } from "@/lib/riskEngine";


export default async function ProjectDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            features: true,
            updates: true,
            decisions: true,
            scopeDocs: true
        }
    });

    if (!project) redirect("/");

    const risks = await detectRisks(id);
    
    // Calculate a dynamic risk score based on detected risks
    // Base health is 100, each risk reduces it.
    let calculatedRiskScore = 0;
    risks.forEach(r => {
        if (r.severity === 'high') calculatedRiskScore += 40;
        else if (r.severity === 'medium') calculatedRiskScore += 20;
        else calculatedRiskScore += 10;
    });
    const riskScore = Math.min(100, calculatedRiskScore);

    const totalFeatures = project.features.length;
    const completedFeatures = project.features.filter(f => f.status === 'done').length;
    const inProgressFeatures = project.features.filter(f => f.status === 'in_progress').length;
    const progress = totalFeatures === 0 ? 0 : Math.round((completedFeatures / totalFeatures) * 100);
    const pendingDecisions = project.decisions.filter(d => d.status === 'pending').length;
    
    const latestUpdateWithSummary = project.updates
        .filter(u => u.clientSummary)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    const latestAiSummary = latestUpdateWithSummary?.clientSummary || "최근 업데이트 정보가 없습니다. 개발팀의 새 소식을 기다려주세요.";


    const activities = project.updates
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(u => ({
            id: u.id,
            title: u.title,
            content: u.content,
            clientSummary: u.clientSummary,
            createdAt: u.createdAt,
            authorName: "개발팀" // Simplification for now
        }));



    const pendingInvite = await prisma.projectInvite.findFirst({
        where: { projectId: id, status: "PENDING" },
        include: { agency: { select: { email: true, name: true } } }
    });

    return (
        <DashboardRoleView
            project={{
                id: project.id,
                name: project.name,
                description: project.description || '',
                healthScore: project.healthScore,
                agencyId: project.agencyId,
                pendingInvite: pendingInvite ? {
                    email: pendingInvite.agency.email,
                    name: pendingInvite.agency.name
                } : null,
                scopeDocs: project.scopeDocs.map(doc => ({
                    id: doc.id,
                    title: doc.title,
                    contentUrl: doc.contentUrl,
                    createdAt: doc.createdAt
                }))
            }}
            stats={{
                totalFeatures,
                completedFeatures,
                inProgressFeatures,
                progress,
                pendingDecisions,
                riskScore,
                recentUpdates: project.updates.length,
                latestAiSummary,
                activities,
            }}
        />
    );
}
