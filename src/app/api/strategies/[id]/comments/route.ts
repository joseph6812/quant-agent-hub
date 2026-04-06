import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { content, authorId } = body;

    if (!content || !authorId) {
      return NextResponse.json(
        { error: 'Content and authorId are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content,
          strategy_id: id,
          author_id: authorId,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    // 转换字段名
    const formattedComment = {
      id: data.id,
      content: data.content,
      createdAt: data.created_at,
      authorId: data.author_id,
      strategyId: data.strategy_id,
    };

    return NextResponse.json({ comment: formattedComment });
  } catch (error) {
    console.error('Error in POST comment:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
