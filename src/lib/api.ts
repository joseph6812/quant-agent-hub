import { supabase } from './supabase'
import type { Strategy, Comment, CreateStrategyInput } from './database.types'

// 获取策略列表
export async function getStrategies(options?: {
  type?: string
  market?: string
  sortBy?: 'newest' | 'popular' | 'return' | 'sharpe'
  limit?: number
}): Promise<Strategy[]> {
  let query = supabase
    .from('strategies')
    .select(`
      *,
      author:authorId (id, name, avatar)
    `)
    .eq('isPublished', true)

  // 筛选
  if (options?.type) {
    query = query.eq('type', options.type)
  }
  if (options?.market) {
    query = query.eq('market', options.market)
  }

  // 排序
  switch (options?.sortBy) {
    case 'popular':
      query = query.order('downloadCount', { ascending: false })
      break
    case 'return':
      query = query.order('annualReturn', { ascending: false })
      break
    case 'sharpe':
      query = query.order('sharpeRatio', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('createdAt', { ascending: false })
  }

  // 限制数量
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching strategies:', error)
    return []
  }

  return data as Strategy[]
}

// 获取单个策略
export async function getStrategy(id: string): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .select(`
      *,
      author:authorId (id, name, avatar)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching strategy:', error)
    return null
  }

  // 增加浏览量
  await supabase
    .from('strategies')
    .update({ viewCount: (data.viewCount || 0) + 1 })
    .eq('id', id)

  return data as Strategy
}

// 创建策略
export async function createStrategy(
  input: CreateStrategyInput,
  authorId: string
): Promise<Strategy | null> {
  const { data, error } = await supabase
    .from('strategies')
    .insert([
      {
        ...input,
        authorId,
        isPublished: true,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating strategy:', error)
    return null
  }

  return data as Strategy
}

// 获取评论
export async function getComments(strategyId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:authorId (id, name, avatar)
    `)
    .eq('strategyId', strategyId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data as Comment[]
}

// 创建评论
export async function createComment(
  content: string,
  strategyId: string,
  authorId: string
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        content,
        strategyId,
        authorId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return null
  }

  return data as Comment
}

// 记录下载
export async function recordDownload(
  strategyId: string,
  userId: string
): Promise<void> {
  // 检查是否已下载过
  const { data: existing } = await supabase
    .from('downloads')
    .select('id')
    .eq('strategyId', strategyId)
    .eq('userId', userId)
    .single()

  if (!existing) {
    // 记录下载
    await supabase.from('downloads').insert([
      {
        strategyId,
        userId,
      },
    ])

    // 增加下载计数
    const { data: strategy } = await supabase
      .from('strategies')
      .select('downloadCount')
      .eq('id', strategyId)
      .single()

    if (strategy) {
      await supabase
        .from('strategies')
        .update({ downloadCount: strategy.downloadCount + 1 })
        .eq('id', strategyId)
    }
  }
}

// 搜索策略
export async function searchStrategies(keyword: string): Promise<Strategy[]> {
  const { data, error } = await supabase
    .from('strategies')
    .select(`
      *,
      author:authorId (id, name, avatar)
    `)
    .eq('isPublished', true)
    .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error searching strategies:', error)
    return []
  }

  return data as Strategy[]
}
