import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { userId } = body;

    // 检查是否已下载过
    const { data: existing } = await supabase
      .from('downloads')
      .select('id')
      .eq('strategy_id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      // 记录下载
      await supabase.from('downloads').insert([
        {
          strategy_id: id,
          user_id: userId,
        },
      ]);

      // 增加下载计数
      const { data: strategy } = await supabase
        .from('strategies')
        .select('download_count')
        .eq('id', id)
        .single();

      if (strategy) {
        await supabase
          .from('strategies')
          .update({ download_count: strategy.download_count + 1 })
          .eq('id', id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording download:', error);
    return NextResponse.json(
      { error: 'Failed to record download' },
      { status: 500 }
    );
  }
}
