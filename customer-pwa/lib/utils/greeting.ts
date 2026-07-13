export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Habari za Asubuhi'
  if (hour < 17) return 'Habari za Mchana'
  return 'Habari za Jioni'
}
