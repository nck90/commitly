import prisma from "@/lib/prisma";
import DocumentsClient from "./DocumentsClient";
import { notFound } from "next/navigation";


export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
        where: { id },
        include: { scopeDocs: { orderBy: { createdAt: 'desc' } } }
    });

    if (!project) notFound();

    return <DocumentsClient scopeDocs={project.scopeDocs} projectId={project.id} />;
}
