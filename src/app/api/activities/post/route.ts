import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    // Removed role restriction so clients can also post schedule change requests or overall requests.
    // if (role !== "developer" && role !== "agency") {
    //     return NextResponse.json({ error: "Only developers can post to the feed" }, { status: 403 });
    // }

    const { projectId, type, title, content, clientSummary } = await req.json();


    if (!projectId || !type || !title || !content) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        let entry;
        if (type === "decision") {
            entry = await prisma.decision.create({
                data: {
                    projectId,
                    authorId: userId,
                    title,
                    description: content,
                    clientContext: clientSummary,
                    status: "pending",
                }
            });
        } else if (type === "risk") {
            entry = await prisma.risk.create({
                data: {
                    projectId,
                    title,
                    description: content,
                    severity: "medium", // Default
                    status: "active",
                }
            });
        } else {
            // Default to Update
            entry = await prisma.update.create({
                data: {
                    projectId,
                    authorId: userId,
                    title,
                    content,
                    clientSummary,
                    status: "new",
                }
            });
        }

        return NextResponse.json(entry);
    } catch (error: any) {
        console.error("Post Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
