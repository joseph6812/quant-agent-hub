import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 用户注册
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (action === 'register') {
      // 检查邮箱是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: '该邮箱已被注册' },
          { status: 400, headers: corsHeaders }
        );
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: '注册失败', details: error.message },
          { status: 500, headers: corsHeaders }
        );
      }

      // 生成JWT
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, isAdmin: newUser.is_admin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: '注册成功',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: newUser.is_admin,
        },
      }, { headers: corsHeaders });
    }

    if (action === 'login') {
      // 查找用户
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401, headers: corsHeaders }
        );
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: '邮箱或密码错误' },
          { status: 401, headers: corsHeaders }
        );
      }

      // 生成JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, isAdmin: user.is_admin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: '登录成功',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.is_admin,
        },
      }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { error: '无效的操作类型' },
      { status: 400, headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Error in auth:', error);
    return NextResponse.json(
      { error: '请求处理失败', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
