export function getLogoUrl(name: string) {
  const clean = name.toLowerCase().replace(/[^a-z0-9 ]/g, '')

  // extract first word (best guess for domain)
  const keyword = clean.split(' ')[0]

  // try multiple sources (priority order)
  return {
    primary: `https://logo.clearbit.com/${keyword}.com`,
    fallback: `https://icons.duckduckgo.com/ip3/${keyword}.com.ico`,
  }
}