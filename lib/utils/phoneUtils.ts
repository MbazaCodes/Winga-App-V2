export function cleanPhone(raw: string): string {
  let p = raw.replace(/[\s\-\(\)]/g, '')
  if (p.startsWith('+255')) p = p.slice(4)
  else if (p.startsWith('255')) p = p.slice(3)
  if (p.startsWith('0')) p = p.slice(1)
  return p
}

export function formatPhoneDisplay(phone: string): string {
  return `+255 ${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6)}`
}
