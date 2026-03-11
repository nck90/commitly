import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.findFirst();
  if (!project) {
    console.log("No projects found!");
    return;
  }
  
  const devUser = await prisma.user.findFirst({
    where: { role: 'developer' }
  });

  const item = await prisma.decision.create({
    data: {
      projectId: project.id,
      title: "[🚨 결정 필요] 테스트 결제 모듈 승인",
      description: "인앱 결제 대신 PG사 연동으로 진행하는 방안에 대해 승인이 필요합니다. 피드 테스트를 위한 항목입니다.",
      clientContext: "수수료를 30%에서 3%로 줄일 수 있는 방법입니다.",
      status: "pending",
      authorId: devUser ? devUser.id : "dummy-author-id",
    }
  });
  console.log("Created test feed item:", item.title, "in project:", project.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
