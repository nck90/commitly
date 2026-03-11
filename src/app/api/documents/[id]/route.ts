import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "developer") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const doc = await prisma.scopeDoc.findUnique({
            where: { id }
        });

        if (!doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        await prisma.scopeDoc.delete({
            where: { id }
        });

        // Optionally, we could create an update feed item that a document was deleted,
        // but for now just deleting it is sufficient.

        return NextResponse.json({ success: true, message: "Document deleted successfully" });
    } catch (error: any) {
        console.error("Document Delete Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
