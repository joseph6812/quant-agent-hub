-- 数据库迁移脚本：添加用户认证字段
-- 在 Supabase SQL Editor 中执行

-- 1. 为 users 表添加密码和管理员字段
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. 确保 strategies 表有 author_id 字段
-- 检查是否存在 author_id 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'strategies' AND column_name = 'author_id'
    ) THEN
        ALTER TABLE strategies ADD COLUMN author_id UUID REFERENCES users(id);
    END IF;
END $$;

-- 3. 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_strategies_author_id ON strategies(author_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. 查看更新后的表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'strategies' 
ORDER BY ordinal_position;
