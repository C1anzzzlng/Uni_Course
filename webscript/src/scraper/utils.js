export default function normalizePrograms(data) {
  return data.map((program) => ({
    code: program.category.trim(),
    name: program.title
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    slug: program.link
      .replace(/^\/academics\//, "")
      .trim(),
    url: program.link.trim(),
  }));
}