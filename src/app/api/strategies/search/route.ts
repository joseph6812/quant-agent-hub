import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ strategies: [] });
  }

  const { data, error } = await supabase
    .from('strategies')
    .select(`
      *,
      author:author_id (id, name, avatar)
    `)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching strategies:', error);
    return NextResponse.json({ error: 'Failed to search strategies' }, { status: 500 });
  }

  // 转换字段名
  const strategies = data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    code: item.code,
    codeLanguage: item.code_language,
    annualReturn: item.annual_return,
    maxDrawdown: item.max_drawdown,
    sharpeRatio: item.sharpe_ratio,
    winRate: item.win_rate,
    backtestPeriod: item.backtest_period,
    type: item.type,
    market: item.market,
    timeframe: item.timeframe,
    agentFramework: item.agent_framework,
    backtestImage: item.backtest_image,
    requirements: item.requirements,
    readme: item.readme,
    config: item.config,
    downloadCount: item.download_count,
    viewCount: item.view_count,
    isPublished: item.is_published,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    authorId: item.author_id,
    author: item.author,
  }));

  return NextResponse.json({ strategies });
}
