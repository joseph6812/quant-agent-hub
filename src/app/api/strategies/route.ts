import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// CORS headers for API access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const market = searchParams.get('market');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('strategies')
    .select('*')
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

  }));

    return NextResponse.json({ strategies }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    const requiredFields = ['title', 'description', 'code', 'annualReturn', 'maxDrawdown', 'sharpeRatio', 'backtestPeriod', 'type', 'market', 'timeframe'];
    const missingFields = requiredFields.filter(field => {
      const value = body[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields,
          message: `缺少必填字段: ${missingFields.join(', ')}`
        }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // 准备插入数据
    const insertData = {
      title: body.title,
      description: body.description,
      code: body.code,
      code_language: body.codeLanguage || body.code_language || 'python',
      annual_return: parseFloat(body.annualReturn) || 0,
      max_drawdown: parseFloat(body.maxDrawdown) || 0,
      sharpe_ratio: parseFloat(body.sharpeRatio) || 0,
      win_rate: body.winRate !== undefined ? parseFloat(body.winRate) : null,
      backtest_period: body.backtestPeriod,
      type: body.type,
      market: body.market,
      timeframe: body.timeframe,
      agent_framework: body.agentFramework || body.agent_framework || null,
      requirements: body.requirements || null,
      readme: body.readme || null,
      config: body.config || null,
      author_id: body.authorId || body.author_id || 'anonymous',
      is_published: true,
      view_count: 0,
      download_count: 0,
    };
    
    // 检查Supabase连接
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Missing Supabase configuration' }, 
        { status: 500, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase
      .from('strategies')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating strategy:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create strategy', 
          details: error.message,
          code: error.code,
          hint: '可能是Supabase RLS策略阻止了插入，请检查数据库权限设置'
        }, 
        { status: 500, headers: corsHeaders }
      );
    }

    // 构建访问URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elaborate-empanada-f22ce5.netlify.app';
    const strategyUrl = `${baseUrl}/strategies/${data.id}`;

    return NextResponse.json({ 
      success: true,
      strategy: data,
      url: strategyUrl,
      message: '策略上传成功！'
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error in POST /api/strategies:', error);
    return NextResponse.json(
      { error: 'Invalid request', details: error.message }, 
      { status: 400, headers: corsHeaders }
    );
  }
}
