import { z } from 'zod'

export const phoneSchema = z.string()
  .regex(/^[0-9]{9,10}$/, 'Namba ya simu lazima iwe na tarakimu 9 au 10')

export const wingaIdSchema = z.string()
  .regex(/^WNGA[0-9]{5}$/, 'Winga ID lazima iwe kama WNGA01001')
  .transform(val => val.toUpperCase())

export const otpSchema = z.string()
  .length(6, 'Nambari ya siri lazima iwe tarakimu 6')
  .regex(/^[0-9]{6}$/, 'Tafadhali weka tarakimu tu')

export const nameSchema = z.string()
  .min(2, 'Jina lako ni nini?')
  .max(50, 'Jina ni refu sana')
  .regex(/^[a-zA-Z\s]+$/, 'Tafadhali weka herufi tu')
  .transform(val => val.trim())
