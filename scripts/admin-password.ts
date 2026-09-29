import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const opts: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, "");
    const value = args[i + 1];
    if (key) opts[key] = value ?? "";
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);
  const login = opts.login || "admin";
  const password = opts.password || process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error(
      "Укажите пароль: npm run admin:password -- --password <пароль> [--login admin]"
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Пароль должен быть не короче 8 символов");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.adminUser.findUnique({ where: { login } });
  if (existing) {
    await db.adminUser.update({
      where: { id: existing.id },
      data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
    });
    console.log(`Пароль администратора «${login}» обновлён`);
  } else {
    await db.adminUser.create({ data: { login, passwordHash } });
    console.log(`Администратор «${login}» создан`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });