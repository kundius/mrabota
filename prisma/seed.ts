import { db } from "../src/lib/db";

const DEFAULT_SETTINGS: Array<[string, string]> = [
  ["phone", "+7 (999) 99-99-999"],
  ["contactEmail", "hr@example.com"],
  ["smtpHost", ""],
  ["smtpPort", "465"],
  ["smtpSecure", "true"],
  ["smtpUser", ""],
  ["smtpPass", ""],
  ["smtpFrom", ""],
  ["ymCounter", ""],
];

async function main() {
  for (const [key, value] of DEFAULT_SETTINGS) {
    const existing = await db.setting.findUnique({ where: { key } });
    if (!existing) {
      await db.setting.create({ data: { key, value } });
      console.log("setting created:", key);
    }
  }

  const pages: Array<{ slug: string; title: string; content: string }> = [
    {
      slug: "privacy",
      title: "Политика конфиденциальности",
      content:
        "<p>Здесь будет размещён текст политики конфиденциальности. Отредактируйте его в админке.</p>",
    },
    {
      slug: "consent",
      title: "Согласие на обработку персональных данных",
      content:
        "<p>Здесь будет размещён текст согласия на обработку персональных данных. Отредактируйте его в админке.</p>",
    },
  ];

  for (const page of pages) {
    const existing = await db.sitePage.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      await db.sitePage.create({ data: page });
      console.log("page created:", page.slug);
    }
  }

  console.log("Seed complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });