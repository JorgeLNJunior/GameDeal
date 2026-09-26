export function normalizeTitle(title: string): string {
  return title.toLowerCase()
    .replaceAll('.', ' ')
    .replaceAll('™', '')
    .replaceAll('®', '')
    .replaceAll('/', '')
    .replaceAll(':', '')
    .replaceAll('-', '')
    .replaceAll('!', '')
    .replaceAll('%', '')
}
