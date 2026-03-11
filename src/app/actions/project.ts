"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function createProjectWithScope(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const rawDocument = formData.get("document") as string;
    const files = formData.getAll("files") as File[];
    const partnerEmail = formData.get("partnerEmail") as string;

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    // Fix for stale sessions after DB seed / missing OAuth users
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
        await prisma.user.create({
            data: {
                id: userId,
                email: session.user.email || `recovered-${Date.now()}@demo.com`,
                name: session.user.name || 'Recovered User',
                role: role || 'client'
            }
        });
    }

    const workspace = await prisma.workspace.create({
        data: { name: `${(session.user as any).name || 'My'} Workspace` }
    });

    // Handle Partner Invitation
    let agencyId = role === 'developer' ? userId : null;
    let clientId = role === 'client' ? userId : null;

    if (partnerEmail && role === 'client') {
        let partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
        if (!partner) {
            partner = await prisma.user.create({
                data: {
                    email: partnerEmail,
                    name: partnerEmail.split('@')[0],
                    role: 'developer'
                }
            });
        }
        agencyId = partner.id;
    }

    // 1. Create the project
    const project = await prisma.project.create({
        data: {
            name,
            description,
            workspaceId: workspace.id,
            clientId,
            agencyId,
            status: "active",
            healthScore: 100
        }
    });

    // 2. Save Document/Scope text
    if (rawDocument) {
        await prisma.scopeDoc.create({
            data: {
                projectId: project.id,
                type: "contract",
                title: "초기 계약 및 요구사항 명세",
                textContent: rawDocument
            }
        });
    }

    // 3. Save Uploaded Files
    if (files && files.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
            const filePath = path.join(uploadDir, safeName);
            
            fs.writeFileSync(filePath, buffer);

            await prisma.scopeDoc.create({
                data: {
                    projectId: project.id,
                    type: "contract",
                    title: file.name,
                    contentUrl: `/uploads/${safeName}`
                }
            });
        }
    }

    // MOCK: AI Feature extraction simulation
    // In reality, this would call an LLM or Edge Function to parse `rawDocument` and `files`
    if (rawDocument || files.length > 0) {
        await prisma.feature.createMany({
            data: [
                { projectId: project.id, name: "메인 랜딩 페이지", status: "not_started", sortOrder: 1 },
                { projectId: project.id, name: "회원가입 및 인증", status: "not_started", sortOrder: 2 },
                { projectId: project.id, name: "결제 모듈 연동", status: "not_started", sortOrder: 3 },
            ]
        });
    }

    revalidatePath("/");
    return project.id;
}

export async function updateFeatureStatus(featureId: string, status: string, progressPercentage?: number) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const feature = await prisma.feature.findUnique({ where: { id: featureId } });
    if (!feature) throw new Error("Feature not found");

    await prisma.feature.update({
        where: { id: featureId },
        data: {
            status,
            ...(progressPercentage !== undefined ? { progressPercentage } : {})
        }
    });

    revalidatePath(`/projects/${feature.projectId}/features`);
    // Also revalidate dashboard to reflect progress changes
    revalidatePath(`/projects/${feature.projectId}`);
}
