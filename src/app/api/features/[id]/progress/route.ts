import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await req.json();
    const { progressPercentage } = body;

    if (progressPercentage === undefined || typeof progressPercentage !== 'number') {
        return NextResponse.json({ error: "Invalid progress value" }, { status: 400 });
    }

    try {
        const feature = await prisma.feature.findUnique({ where: { id } });
        if (!feature) {
             return NextResponse.json({ error: "Feature not found" }, { status: 404 });
        }

        const updatedFeature = await prisma.feature.update({
            where: { id },
            data: { progressPercentage }
        });

        // Automatically create an activity log (Update)
        await prisma.update.create({
            data: {
                projectId: feature.projectId,
                featureId: feature.id,
                authorId: userId,
                title: "진척도 업데이트",
                content: `해당 기능의 개발 진척도가 ${progressPercentage}%로 업데이트 되었습니다.`,
                status: "checked"
            }
        });

        return NextResponse.json(updatedFeature);
    } catch (error: any) {
        console.error("Feature Progress Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
