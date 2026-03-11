import prisma from "@/lib/prisma";
import { FeaturesRoleView } from "./FeaturesRoleClient";

export default async function FeaturesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const features = await prisma.feature.findMany({
        where: { projectId: id },
        orderBy: { sortOrder: 'asc' }
    });

    return <FeaturesRoleView features={features} projectId={id} />;
}
