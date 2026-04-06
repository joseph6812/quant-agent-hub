import { createClient } from '@supabase/supabase-js'

// 清理环境变量中的BOM头和其他特殊字符
const cleanEnvVar = (value: string | undefined): string => {
  if (!value) return ''
  // 移除BOM头 (65279 = BOM)
  return value.replace(/^\uFEFF/, '').trim()
}

const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const supabase = createClient(supabaseUrl, supabaseKey)
