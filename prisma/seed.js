
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('local20', 10);

  await prisma.user.upsert({
    where: { username: 'admin20' },
    update: {},
    create: {
      username: 'admin20',
      password: hashedPassword,
    },
  });

  console.log('Usuario admin creado ✅');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
