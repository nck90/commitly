import prisma from "@/lib/prisma";
import { ArrowLeft, FileEdit, AlertCircle, Save, Calendar, CheckSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FeatureDetailClient } from "./FeatureDetailClient";

export default async function FeatureDetailPage({ params }: { params: Promise<{ id: string, featureId: string }> }) {
    const { id, featureId } = await params;

    const project = await prisma.project.findUnique({
        where: { id }
    });

    const feature = await prisma.feature.findUnique({
        where: { id: featureId }
    });

    if (!project || !feature) notFound();

    return <FeatureDetailClient project={project} feature={feature} />;
}
