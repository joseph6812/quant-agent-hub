import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const market = searchParams.get('market');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('strategies')
    .select(`
      *,
      author:author_id (id, name, avatar)
    `)
    .eq('is_published', true);

  // 筛选
  if (type) {
    query = query.eq('type', type);
  }
  if (market) {
    query = query.eq('market', market);
  }

  // 排序
  switch (sortBy) {
    case 'popular':
      query = query.order('download_count', { ascending: false });
      break;
    case 'return':
      query = query.order('annual_return', { ascending: false });
      break;
    case 'sharpe':
      query = query.order('sharpe_ratio', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  // 限制数量
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching strategies:', error);
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
  }

  // 转换字段名（snake_case 到 camelCase）
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('strategies')
      .insert([
        {
          title: body.title,
          description: body.description,
          code: body.code,
          code_language: body.codeLanguage || 'python',
          annual_return: body.annualReturn,
          max_drawdown: body.maxDrawdown,
          sharpe_ratio: body.sharpeRatio,
          win_rate: body.winRate,
          backtest_period: body.backtestPeriod,
          type: body.type,
          market: body.market,
          timeframe: body.timeframe,
          agent_framework: body.agentFramework,
          requirements: body.requirements,
          readme: body.readme,
          config: body.config,
          author_id: body.authorId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating strategy:', error);
      return NextResponse.json({ error: 'Failed to create strategy' }, { status: 500 });
    }

    return NextResponse.json({ strategy: data });
  } catch (error) {
    console.error('Error in POST /api/strategies:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
