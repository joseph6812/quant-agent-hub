import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Download, Shield, AlertTriangle } from "lucide-react";
import { getStrategies } from "@/lib/api";

export const revalidate = 60; // 每分钟重新验证数据

export default async function Home() {
  // 从数据库获取真实数据
  const featuredStrategies = await getStrategies({ limit: 3, sortBy: 'popular' });
  const latestStrategies = await getStrategies({ limit: 3, sortBy: 'newest' });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">QuantAgent Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/strategies" className="text-muted-foreground hover:text-foreground">
                策略广场
              </Link>
              <Link href="/upload" className="text-muted-foreground hover:text-foreground">
                分享策略
              </Link>
              <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground">
                免责声明
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            AI智能体量化策略
            <span className="text-primary">分享社区</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            用智能体构建量化模型，与志同道合的开发者交流经验，分享你的策略成果
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/strategies">
              <Button size="lg">浏览策略</Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline">分享你的策略</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{featuredStrategies.length > 0 ? '68%' : '--'}</p>
                    <p className="text-muted-foreground">最高年化收益</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{featuredStrategies.length}</p>
                    <p className="text-muted-foreground">策略数量</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Download className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {featuredStrategies.reduce((sum, s) => sum + (s.downloadCount || 0), 0)}
                    </p>
                    <p className="text-muted-foreground">总下载次数</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Strategies */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">热门策略</h2>
            <Link href="/strategies" className="text-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          
          {featuredStrategies.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">暂无策略，成为第一个分享者吧！</p>
              <Link href="/upload">
                <Button className="mt-4">上传策略</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStrategies.map((strategy) => (
                <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      <Badge variant={strategy.annualReturn > 0 ? "default" : "destructive"}>
                        {strategy.annualReturn > 0 ? '+' : ''}{strategy.annualReturn}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">by 匿名用户</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {strategy.description}
                    </p>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">{strategy.type}</Badge>
                      <Badge variant="outline">{strategy.market}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>回撤: {strategy.maxDrawdown}%</span>
                      <span>夏普: {strategy.sharpeRatio}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {strategy.downloadCount} 次下载
                      </span>
                      <Link href={`/strategies/${strategy.id}`}>
                        <Button size="sm" variant="outline">查看详情</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Strategies */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">最新发布</h2>
            <Link href="/strategies" className="text-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          
          {latestStrategies.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">暂无最新策略</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestStrategies.map((strategy) => (
                <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      <Badge variant={strategy.annualReturn > 0 ? "default" : "destructive"}>
                        {strategy.annualReturn > 0 ? '+' : ''}{strategy.annualReturn}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">by 匿名用户</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {strategy.description}
                    </p>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">{strategy.type}</Badge>
                      <Badge variant="outline">{strategy.market}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>回撤: {strategy.maxDrawdown}%</span>
                      <span>夏普: {strategy.sharpeRatio}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {strategy.downloadCount} 次下载
                      </span>
                      <Link href={`/strategies/${strategy.id}`}>
                        <Button size="sm" variant="outline">查看详情</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Risk Warning */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    投资风险提示
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    本网站所有策略仅供学习研究使用，不构成任何投资建议。历史回测收益不代表未来表现，
                    使用任何策略进行实盘交易的风险由使用者自行承担。投资有风险，入市需谨慎。
                  </p>
                  <Link href="/disclaimer">
                    <Button variant="link" className="p-0 h-auto mt-2 text-yellow-700 dark:text-yellow-300">查看完整免责声明</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">QuantAgent Hub</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>仅供学习交流，不构成投资建议</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 QuantAgent Hub. 开源量化策略社区.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
