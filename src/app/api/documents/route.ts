import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const projectId = formData.get('projectId') as string;
        const type = formData.get('type') as string;
        const title = formData.get('title') as string;
        // In a real app we'd save the File object (formData.get('file')) to S3/Cloud storage.
        // Here we'll just simulate it by saving the record to DB.

        if (!projectId || !type || !title) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const doc = await prisma.scopeDoc.create({
            data: {
                projectId,
                type,
                title,
                contentUrl: `https://dummy-storage.com/${projectId}/${encodeURIComponent(title)}`,
                textContent: `Simulated content for ${title}`
            }
        });

        // Create an activity feed item for document upload
        await prisma.update.create({
            data: {
                projectId,
                authorId: (session.user as any).id,
                title: `[새 문서] ${title} 업로드됨`,
                content: `새로운 문서가 등록되었습니다. 문서함에서 확인하세요.`,
                status: "new"
            }
        });

        return NextResponse.json({ message: "Document uploaded successfully", doc });
    } catch (error: any) {
        console.error("Document Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
