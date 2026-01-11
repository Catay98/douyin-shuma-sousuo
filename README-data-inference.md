# 手机型号搜索量推断方案

## 一、可行的数据搜集方式

如果不需要极度精准的数据，可以通过以下几种方式实现大致的手机型号搜索量推断：

### 1. 第三方数据服务 API
- **百度指数 API**：获取手机型号在百度上的搜索热度
- **微信指数 API**：获取手机型号在微信生态内的搜索热度
- **抖音开放平台**：申请抖音开放平台权限，获取部分公开数据
- **第三方数据分析平台**：如艾瑞数据、易观分析等提供的免费或试用版 API

### 2. 社交媒体话题热度
- 监控抖音、微博等平台上手机型号相关话题的讨论量
- 分析相关视频的播放量、点赞量、评论量等指标
- 通过话题标签的使用频率推断搜索热度

### 3. 公开行业报告
- 定期抓取手机厂商发布的销量数据
- 分析科技媒体发布的手机关注度报告
- 整合电商平台的手机搜索和销量数据

### 4. 网页爬虫（需遵守robots.txt规则）
- 爬取抖音搜索页面的相关推荐内容
- 分析手机型号相关视频的发布量和互动数据
- 监控相关关键词的搜索联想词

## 二、技术实现方案

### 1. 数据获取层
```typescript
// 修改现有的 fetchRankingData 函数
export const fetchRankingData = async (): Promise<RankingItem[]> => {
  try {
    // 1. 尝试从第三方API获取数据
    try {
      const thirdPartyData = await fetchThirdPartyData();
      if (thirdPartyData && thirdPartyData.length > 0) {
        return processThirdPartyData(thirdPartyData);
      }
    } catch (apiError) {
      console.log('Third-party API failed, falling back to other methods');
    }

    // 2. 尝试从社交媒体获取话题热度
    try {
      const socialMediaData = await fetchSocialMediaData();
      if (socialMediaData && socialMediaData.length > 0) {
        return processSocialMediaData(socialMediaData);
      }
    } catch (socialError) {
      console.log('Social media data fetch failed, falling back to mock data');
    }

    // 3. 最终回退到模拟数据
    return generateMockData();
  } catch (error) {
    console.error('Error fetching ranking data:', error);
    return generateMockData();
  }
};
```

### 2. 数据处理层
```typescript
// 处理第三方数据
const processThirdPartyData = (data: any[]): RankingItem[] => {
  return data.map((item, index) => {
    // 根据不同API的数据格式进行转换
    return {
      id: `phone-${index}`,
      keyword: item.keyword || item.name,
      // 将第三方热度值映射到合理范围
      count: normalizeValue(item.searchIndex || item.hotValue, 1000, 10000),
      frequency: Math.random() * 100, // 可以根据实际数据调整
      category: determineCategory(item.keyword || item.name)
    };
  });
};

// 归一化数据值
const normalizeValue = (value: number, min: number, max: number): number => {
  // 将原始值映射到指定范围
  return Math.max(min, Math.min(max, value));
};
```

### 3. 社交媒体数据获取示例
```typescript
// 示例：获取抖音话题热度数据
const fetchDouyinTopicData = async (keywords: string[]): Promise<any[]> => {
  // 这里需要替换为实际的API调用或爬虫逻辑
  const response = await fetch(`https://api.example.com/douyin/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Douyin topic data');
  }
  
  return response.json();
};
```

## 三、代码修改建议

### 1. 修改 `fetchRankingData` 函数
- 文件：`src/app/douyin-ranking/page.tsx`
- 将现有的本地JSON文件读取逻辑替换为新的数据获取逻辑
- 添加多数据源回退机制

### 2. 新增数据处理工具函数
- 新增文件：`src/utils/dataProcessor.ts`
- 实现第三方数据转换、归一化等功能
- 实现社交媒体数据处理逻辑

### 3. 配置数据来源
- 新增文件：`src/config/dataSources.ts`
- 配置不同数据源的API地址、密钥等
- 配置数据更新频率和优先级

### 4. 增强模拟数据生成
- 修改 `generateMockData` 函数
- 基于公开数据或行业报告调整模拟数据的分布
- 使模拟数据更接近真实情况

## 四、预期效果

1. **数据准确性**：能够反映手机型号的相对搜索热度，虽然不是抖音平台的精确搜索量，但可以作为参考
2. **自动更新**：保持每3天自动更新一次的机制
3. **多数据源备份**：一个数据源失败时自动切换到其他数据源
4. **可视化效果**：保持现有的炫酷柱状图展示效果
5. **易于扩展**：可以方便地添加新的数据来源

## 五、注意事项

1. **API调用限制**：免费API通常有调用次数限制，需要合理安排更新频率
2. **数据格式一致性**：不同数据源的数据格式可能不同，需要统一处理
3. **法律合规性**：使用网页爬虫时需遵守网站的robots.txt规则和相关法律法规
4. **数据缓存**：建议添加数据缓存机制，减少API调用次数
5. **数据验证**：对获取的数据进行验证和清洗，确保数据质量

## 六、快速实现建议

如果想快速实现，可以先从以下方案入手：

1. **使用百度指数 API**：申请百度指数API权限，获取手机型号的搜索热度
2. **简化数据处理**：直接将百度指数值映射为搜索指数，不需要复杂的转换
3. **保持现有架构**：只修改 `fetchRankingData` 函数，其他部分保持不变
4. **添加数据缓存**：将获取的数据缓存到本地JSON文件，减少API调用

通过以上方案，可以在短时间内实现基于真实数据的手机型号搜索量推断，满足大致参考的需求。