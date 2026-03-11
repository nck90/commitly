import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import DocumentDetailClient from "./DocumentDetailClient";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string, fileId: string }> }) {
    const { id, fileId } = await params;

    const doc = await prisma.scopeDoc.findUnique({
        where: { id: fileId }
    });

    if (!doc) {
        notFound();
    }

    // Map ScopeDoc to UI expected format
    const file = {
        id: doc.id,
        name: doc.title,
        type: doc.contentUrl?.endsWith('.pdf') ? 'pdf' : doc.contentUrl?.endsWith('.png') || doc.contentUrl?.endsWith('.jpg') ? 'img' : 'doc',
        date: new Date(doc.createdAt).toLocaleDateString('ko-KR'),
        size: 'N/A', // Simulated
        folder: doc.type === 'contract' ? '계약서' : doc.type === 'spec' ? '기획 문서' : '에셋',
        uploader: '시스템',
        version: 'v1.0',
        url: doc.contentUrl
    };

    return <DocumentDetailClient projectId={id} file={file} />;
}
