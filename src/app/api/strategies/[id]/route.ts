import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, canDeleteStrategy } from '@/lib/auth';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 获取策略详情
  const { data: strategy, error } = await supabase
    .from('strategies')
    .select('*')
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
    .select('*')
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
  };

  const formattedComments = (comments || []).map((item: any) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    authorId: item.author_id,
    strategyId: item.strategy_id,
  }));

  return NextResponse.json({ 
    strategy: formattedStrategy,
    comments: formattedComments 
  });
}

// 删除策略（需要权限验证）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 验证用户身份
    const currentUser = await getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 检查是否有权限删除
    const hasPermission = await canDeleteStrategy(currentUser, id);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: '您没有权限删除此策略' },
        { status: 403, headers: corsHeaders }
      );
    }

    // 删除策略（关联的评论和下载记录会级联删除）
    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting strategy:', error);
      return NextResponse.json(
        { error: '删除失败', details: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      message: '策略已删除'
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Error in DELETE /api/strategies/[id]:', error);
    return NextResponse.json(
      { error: '请求处理失败', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
