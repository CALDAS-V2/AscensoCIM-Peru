const {PrismaClient} = require('@prisma/client');

(async () => {
  const p = new PrismaClient();
  try {
    const u = await p.user.update({
      where: { email: 'admin@ascensocim.pe' },
      data: { loginAttempts: 0, lockedUntil: null }
    });
    console.log('Desbloqueado:', u.email);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  } finally {
    await p.$disconnect();
  }
})();