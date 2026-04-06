"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  ArrowLeft,
  Download,
  Code,
  FileText,
  MessageSquare,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Strategy, Comment } from "@/lib/database.types";

export default function StrategyDetailPage({ params }: { params: { id: string } }) {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadStrategy();
  }, [params.id]);

  async function loadStrategy() {
    try {
      const response = await fetch(`/api/strategies/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to load strategy");
      }
      const data = await response.json();
      setStrategy(data.strategy);
      setComments(data.comments || []);
    } catch (err) {
      setError("加载策略失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!strategy) return;

    // 记录下载
    try {
      await fetch(`/api/strategies/${params.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "anonymous" }), // 暂时匿名
      });
    } catch (error) {
      console.error("Error recording download:", error);
    }

    // 创建下载内容
    const strategyPackage = {
      title: strategy.title,
      description: strategy.description,
      code: strategy.code,
      config: strategy.config,
      requirements: strategy.requirements,
      readme: strategy.readme,
      metrics: {
        annualReturn: strategy.annualReturn,
        maxDrawdown: strategy.maxDrawdown,
        sharpeRatio: strategy.sharpeRatio,
        winRate: strategy.winRate,
        backtestPeriod: strategy.backtestPeriod,
      },
    };

    const blob = new Blob([JSON.stringify(strategyPackage, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${strategy.title.replace(/\s+/g, "_")}_strategy.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleSubmitComment() {
    if (!newComment.trim() || !strategy) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/strategies/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          authorId: "anonymous", // 暂时匿名
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{error || "策略不存在"}</p>
          <Link href="/strategies">
            <Button className="mt-4">返回策略广场</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <Link href="/" className="text-xl font-bold">
                QuantAgent Hub
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/strategies" className="text-muted-foreground hover:text-foreground">
                策略广场
              </Link>
              <Link href="/upload" className="text-muted-foreground hover:text-foreground">
                分享策略
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/strategies">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回策略广场
          </Button>
        </Link>

        {/* Strategy Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{strategy.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span>匿名用户</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(strategy.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {strategy.annualReturn > 0 ? "+" : ""}
                  {strategy.annualReturn}%
                </p>
                <p className="text-sm text-muted-foreground">年化收益</p>
              </div>
              <Button size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                下载策略
              </Button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="secondary">{strategy.type}</Badge>
          <Badge variant="outline">{strategy.market}</Badge>
          <Badge variant="outline">{strategy.timeframe}</Badge>
          {strategy.agentFramework && (
            <Badge variant="outline">{strategy.agentFramework}</Badge>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{strategy.annualReturn}%</p>
              <p className="text-sm text-muted-foreground">年化收益</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{strategy.maxDrawdown}%</p>
              <p className="text-sm text-muted-foreground">最大回撤</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{strategy.sharpeRatio}</p>
              <p className="text-sm text-muted-foreground">夏普比率</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{strategy.winRate || "--"}%</p>
              <p className="text-sm text-muted-foreground">胜率</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              代码
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageSquare className="h-4 w-4 mr-2" />
              评论 ({comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>策略说明</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{strategy.description}</p>

                {strategy.readme && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">详细文档</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                      {strategy.readme}
                    </pre>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">回测信息</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">回测周期：</span>
                      <span>{strategy.backtestPeriod}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">编程语言：</span>
                      <span>{strategy.codeLanguage}</span>
                    </div>
                  </div>
                </div>

                {strategy.requirements && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">依赖要求</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                      {strategy.requirements}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>策略代码</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  <code>{strategy.code}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>评论交流</CardTitle>
              </CardHeader>
              <CardContent>
                {/* New Comment */}
                <div className="mb-6">
                  <Textarea
                    placeholder="分享你对这个策略的看法或问题..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submittingComment}
                  >
                    {submittingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      "发表评论"
                    )}
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      暂无评论，成为第一个评论者吧！
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            匿名用户
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Stats */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Download className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  已被下载 {strategy.downloadCount} 次，浏览 {strategy.viewCount} 次
                </span>
              </div>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                下载策略包
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
