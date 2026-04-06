"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Loader2 } from "lucide-react";
import type { Strategy } from "@/lib/database.types";
import Navbar from "@/components/Navbar";

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // 策略类型选项
  const strategyTypes = [
    { value: "all", label: "全部类型" },
    { value: "趋势跟踪", label: "趋势跟踪" },
    { value: "均值回归", label: "均值回归" },
    { value: "多因子", label: "多因子" },
    { value: "事件驱动", label: "事件驱动" },
    { value: "机器学习", label: "机器学习" },
    { value: "动量策略", label: "动量策略" },
  ];

  // 市场选项
  const markets = [
    { value: "all", label: "全部市场" },
    { value: "A股", label: "A股" },
    { value: "港股", label: "港股" },
    { value: "美股", label: "美股" },
    { value: "期货", label: "期货" },
    { value: "加密货币", label: "加密货币" },
  ];

  // 排序选项
  const sortOptions = [
    { value: "newest", label: "最新发布" },
    { value: "popular", label: "最受欢迎" },
    { value: "return", label: "收益率最高" },
    { value: "sharpe", label: "夏普比率最高" },
  ];

  // 加载策略数据
  useEffect(() => {
    loadStrategies();
  }, [selectedType, selectedMarket, sortBy]);

  async function loadStrategies() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedMarket !== "all") params.append("market", selectedMarket);
      params.append("sortBy", sortBy);

      const response = await fetch(`/api/strategies?${params}`);
      const data = await response.json();
      setStrategies(data.strategies || []);
    } catch (error) {
      console.error("Error loading strategies:", error);
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  }

  // 搜索策略
  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadStrategies();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/strategies/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setStrategies(data.strategies || []);
    } catch (error) {
      console.error("Error searching strategies:", error);
    } finally {
      setLoading(false);
    }
  }

  // 过滤显示的策略
  const filteredStrategies = strategies.filter((strategy) => {
    const matchesSearch =
      !searchQuery ||
      strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || strategy.type === selectedType;
    const matchesMarket = selectedMarket === "all" || strategy.market === selectedMarket;
    return matchesSearch && matchesType && matchesMarket;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">策略广场</h1>
          <p className="text-muted-foreground">
            浏览和下载社区分享的AI智能体量化策略
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索策略名称或描述..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">筛选：</span>
            </div>

            <Select value={selectedType} onValueChange={(value) => setSelectedType(value || 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="策略类型" />
              </SelectTrigger>
              <SelectContent>
                {strategyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMarket} onValueChange={(value) => setSelectedMarket(value || 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="市场" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value || 'newest')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          共找到 {filteredStrategies.length} 个策略
        </div>

        {/* Strategies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">加载中...</span>
          </div>
        ) : filteredStrategies.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">没有找到符合条件的策略</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
              setSelectedMarket("all");
              loadStrategies();
            }}>
              清除筛选
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{strategy.title}</CardTitle>
                    <Badge
                      variant={strategy.annualReturn > 0 ? "default" : "destructive"}
                      className="flex-shrink-0"
                    >
                      {strategy.annualReturn > 0 ? "+" : ""}
                      {strategy.annualReturn}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by 匿名用户
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {strategy.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{strategy.type}</Badge>
                    <Badge variant="outline">{strategy.market}</Badge>
                    <Badge variant="outline">{strategy.timeframe}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">{strategy.annualReturn}%</p>
                      <p className="text-xs text-muted-foreground">年化收益</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">{strategy.maxDrawdown}%</p>
                      <p className="text-xs text-muted-foreground">最大回撤</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-semibold">{strategy.sharpeRatio}</p>
                      <p className="text-xs text-muted-foreground">夏普比率</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <span>{strategy.downloadCount} 次下载</span>
                      <span className="mx-2">·</span>
                      <span>{strategy.viewCount} 次浏览</span>
                    </div>
                    <Link href={`/strategies/${strategy.id}`}>
                      <Button size="sm">查看详情</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
