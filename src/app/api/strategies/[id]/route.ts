import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 获取策略详情
  const { data: strategy, error } = await supabase
    .from('strategies')
    .select(`
      *,
      author:author_id (id, name, avatar)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching strategy:', error);
    return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
  }

  // 增加浏览量
  await supabase
    .from('strategies')
    .update({ view_count: (strategy.view_count || 0) + 1 })
    .eq('id', id);

  // 获取评论
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      author:author_id (id, name, avatar)
    `)
    .eq('strategy_id', id)
    .order('created_at', { ascending: false });

  // 转换字段名
  const formattedStrategy = {
    id: strategy.id,
    title: strategy.title,
    description: strategy.description,
    code: strategy.code,
    codeLanguage: strategy.code_language,
    annualReturn: strategy.annual_return,
    maxDrawdown: strategy.max_drawdown,
    sharpeRatio: strategy.sharpe_ratio,
    winRate: strategy.win_rate,
    backtestPeriod: strategy.backtest_period,
    type: strategy.type,
    market: strategy.market,
    timeframe: strategy.timeframe,
    agentFramework: strategy.agent_framework,
    backtestImage: strategy.backtest_image,
    requirements: strategy.requirements,
    readme: strategy.readme,
    config: strategy.config,
    downloadCount: strategy.download_count,
    viewCount: strategy.view_count,
    isPublished: strategy.is_published,
    createdAt: strategy.created_at,
    updatedAt: strategy.updated_at,
    authorId: strategy.author_id,
    author: strategy.author,
  };

  const formattedComments = (comments || []).map((item: any) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    authorId: item.author_id,
    strategyId: item.strategy_id,
    author: item.author,
  }));

  return NextResponse.json({ 
    strategy: formattedStrategy,
    comments: formattedComments 
  });
}
