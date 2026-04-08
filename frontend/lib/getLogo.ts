export function getLogoUrl(name: string) {
  // clean name (remove special chars)
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

  // take first meaningful word
  const keyword = clean.split(" ")[0];

  return {
    // 🔥 Best quality logos
    primary: `https://logo.clearbit.com/${keyword}.com`,

    // 🔁 Backup (works for many sites)
    fallback: `https://icons.duckduckgo.com/ip3/${keyword}.com.ico`,

    // 🛟 Last fallback (local)
    default: "/fallback.png",
  };
}