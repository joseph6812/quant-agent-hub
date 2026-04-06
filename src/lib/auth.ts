import jwt from 'jsonwebtoken';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export interface AuthUser {
  userId: string;
  email: string;
  isAdmin: boolean;
}

// 验证JWT token
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// 从请求头获取token
export function getTokenFromHeader(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return null;
}

// 获取当前用户
export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  
  return verifyToken(token);
}

// 检查用户是否有权限删除策略
export async function canDeleteStrategy(user: AuthUser, strategyId: string): Promise<boolean> {
  // 管理员可以删除任何策略
  if (user.isAdmin) return true;
  
  // 检查是否是策略作者
  const { data: strategy } = await supabase
    .from('strategies')
    .select('author_id')
    .eq('id', strategyId)
    .single();
  
  if (!strategy) return false;
  
  return strategy.author_id === user.userId;
}
