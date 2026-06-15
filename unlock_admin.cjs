const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.update({
      where: { email: 'admin@ascensocim.pe' },
      data: { loginAttempts: 0, lockedUntil: null }
    });
    console.log('✓ Admin desbloqueado exitosamente');
    console.log(`  Email: ${user.email}`);
    console.log(`  loginAttempts: ${user.loginAttempts}`);
    console.log(`  lockedUntil: ${user.lockedUntil}`);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
