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
    const { status } = await req.json();

    if (!status) {
        return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    try {
        const feature = await prisma.feature.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(feature);
    } catch (error: any) {
        console.error("Feature Status Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
