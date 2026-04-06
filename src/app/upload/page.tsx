"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    codeLanguage: "python",
    annualReturn: "",
    maxDrawdown: "",
    sharpeRatio: "",
    winRate: "",
    backtestPeriod: "",
    type: "",
    market: "",
    timeframe: "",
    agentFramework: "",
    requirements: "",
    readme: "",
    config: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 验证必填字段
      if (!formData.title || !formData.description || !formData.code) {
        throw new Error("请填写所有必填字段");
      }

      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          annualReturn: parseFloat(formData.annualReturn) || 0,
          maxDrawdown: parseFloat(formData.maxDrawdown) || 0,
          sharpeRatio: parseFloat(formData.sharpeRatio) || 0,
          winRate: formData.winRate ? parseFloat(formData.winRate) : null,
          authorId: "anonymous", // 暂时匿名上传
        }),
      });

      if (!response.ok) {
        throw new Error("上传失败，请稍后重试");
      }

      const data = await response.json();
      setSuccess(true);

      // 3秒后跳转到策略详情页
      setTimeout(() => {
        router.push(`/strategies/${data.strategy.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">上传成功！</h2>
          <p className="text-muted-foreground mb-4">
            你的策略已成功发布到社区，正在跳转到详情页...
          </p>
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
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                首页
              </Link>
              <Link href="/strategies" className="text-muted-foreground hover:text-foreground">
                策略广场
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">分享你的策略</h1>
          <p className="text-muted-foreground">
            将你的AI智能体量化策略分享给社区，与其他开发者交流学习
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive bg-destructive/10">
            <CardContent className="pt-6 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    策略名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="给你的策略起个名字"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    策略说明 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述策略的核心逻辑、适用场景等"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">
                      策略类型 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleChange("type", value || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="趋势跟踪">趋势跟踪</SelectItem>
                        <SelectItem value="均值回归">均值回归</SelectItem>
                        <SelectItem value="多因子">多因子</SelectItem>
                        <SelectItem value="事件驱动">事件驱动</SelectItem>
                        <SelectItem value="机器学习">机器学习</SelectItem>
                        <SelectItem value="动量策略">动量策略</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="market">
                      市场 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.market}
                      onValueChange={(value) => handleChange("market", value || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择市场" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A股">A股</SelectItem>
                        <SelectItem value="港股">港股</SelectItem>
                        <SelectItem value="美股">美股</SelectItem>
                        <SelectItem value="期货">期货</SelectItem>
                        <SelectItem value="加密货币">加密货币</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeframe">
                      时间周期 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.timeframe}
                      onValueChange={(value) => handleChange("timeframe", value || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择周期" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="日线">日线</SelectItem>
                        <SelectItem value="小时线">小时线</SelectItem>
                        <SelectItem value="30分钟">30分钟</SelectItem>
                        <SelectItem value="15分钟">15分钟</SelectItem>
                        <SelectItem value="5分钟">5分钟</SelectItem>
                        <SelectItem value="分钟线">分钟线</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="agentFramework">智能体框架（选填）</Label>
                  <Select
                    value={formData.agentFramework}
                    onValueChange={(value) => handleChange("agentFramework", value || "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择使用的智能体框架" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LangChain">LangChain</SelectItem>
                      <SelectItem value="AutoGen">AutoGen</SelectItem>
                      <SelectItem value="CrewAI">CrewAI</SelectItem>
                      <SelectItem value="自研框架">自研框架</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 回测数据 */}
            <Card>
              <CardHeader>
                <CardTitle>回测数据</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualReturn">
                      年化收益率 (%) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="annualReturn"
                      type="number"
                      step="0.01"
                      placeholder="例如: 68.5"
                      value={formData.annualReturn}
                      onChange={(e) => handleChange("annualReturn", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxDrawdown">
                      最大回撤 (%) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="maxDrawdown"
                      type="number"
                      step="0.01"
                      placeholder="例如: 15.2"
                      value={formData.maxDrawdown}
                      onChange={(e) => handleChange("maxDrawdown", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sharpeRatio">
                      夏普比率 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sharpeRatio"
                      type="number"
                      step="0.01"
                      placeholder="例如: 2.1"
                      value={formData.sharpeRatio}
                      onChange={(e) => handleChange("sharpeRatio", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="winRate">胜率 (%)（选填）</Label>
                    <Input
                      id="winRate"
                      type="number"
                      step="0.01"
                      placeholder="例如: 65"
                      value={formData.winRate}
                      onChange={(e) => handleChange("winRate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backtestPeriod">
                    回测时间段 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="backtestPeriod"
                    placeholder="例如: 2020-01-01 至 2024-12-31"
                    value={formData.backtestPeriod}
                    onChange={(e) => handleChange("backtestPeriod", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 代码和文件 */}
            <Card>
              <CardHeader>
                <CardTitle>策略代码</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">
                    策略代码 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="code"
                    placeholder="粘贴你的策略代码..."
                    rows={15}
                    className="font-mono text-sm"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="codeLanguage">编程语言</Label>
                  <Select
                    value={formData.codeLanguage}
                    onValueChange={(value) => handleChange("codeLanguage", value || "")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="requirements">依赖要求（选填）</Label>
                  <Textarea
                    id="requirements"
                    placeholder="例如 requirements.txt 的内容..."
                    rows={4}
                    className="font-mono text-sm"
                    value={formData.requirements}
                    onChange={(e) => handleChange("requirements", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="config">配置文件（选填）</Label>
                  <Textarea
                    id="config"
                    placeholder="例如 config.yaml 的内容..."
                    rows={4}
                    className="font-mono text-sm"
                    value={formData.config}
                    onChange={(e) => handleChange("config", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="readme">详细说明文档（选填）</Label>
                  <Textarea
                    id="readme"
                    placeholder="更详细的策略说明、使用方法、注意事项等..."
                    rows={6}
                    value={formData.readme}
                    onChange={(e) => handleChange("readme", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-4">
              <Link href="/">
                <Button type="button" variant="outline">取消</Button>
              </Link>
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    发布策略
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
