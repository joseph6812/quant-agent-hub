export type Strategy = {
  id: string
  title: string
  description: string
  code: string
  codeLanguage: string
  annualReturn: number
  maxDrawdown: number
  sharpeRatio: number
  winRate: number | null
  backtestPeriod: string
  type: string
  market: string
  timeframe: string
  agentFramework: string | null
  backtestImage: string | null
  requirements: string | null
  readme: string | null
  config: string | null
  downloadCount: number
  viewCount: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  authorId: string
  author?: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export type User = {
  id: string
  email: string
  name: string | null
  avatar: string | null
  bio: string | null
  createdAt: string
}

export type Comment = {
  id: string
  content: string
  createdAt: string
  authorId: string
  strategyId: string
  author?: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export type CreateStrategyInput = {
  title: string
  description: string
  code: string
  codeLanguage?: string
  annualReturn: number
  maxDrawdown: number
  sharpeRatio: number
  winRate?: number
  backtestPeriod: string
  type: string
  market: string
  timeframe: string
  agentFramework?: string
  requirements?: string
  readme?: string
  config?: string
}
