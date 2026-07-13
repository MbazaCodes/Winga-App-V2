export function formatWingaId(raw: string): string {
  return raw.replace(/\s/g, '').toUpperCase()
}
