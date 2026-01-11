// 关键词库配置文件
export interface Keyword {
  word: string;
  category?: string;
}

// 预设关键词列表
export const keywords: Keyword[] = [
  { word: "人工智能", category: "技术" },
  { word: "机器学习", category: "技术" },
  { word: "大数据", category: "技术" },
  { word: "云计算", category: "技术" },
  { word: "区块链", category: "技术" },
  { word: "数据科学", category: "技术" },
  { word: "深度学习", category: "技术" },
  { word: "自然语言处理", category: "技术" },
  { word: "计算机视觉", category: "技术" },
  { word: "数据分析", category: "技术" },
  { word: "创新", category: "通用" },
  { word: "发展", category: "通用" },
  { word: "趋势", category: "通用" },
  { word: "应用", category: "通用" },
  { word: "解决方案", category: "通用" },
];

// 获取所有关键词列表
export const getKeywordsList = (): string[] => {
  return keywords.map(keyword => keyword.word);
};

// 根据分类获取关键词
export const getKeywordsByCategory = (category: string): string[] => {
  return keywords
    .filter(keyword => keyword.category === category)
    .map(keyword => keyword.word);
};

// 获取所有分类
export const getCategories = (): string[] => {
  const categories = new Set(keywords.map(keyword => keyword.category || ""));
  return Array.from(categories).filter(Boolean);
};