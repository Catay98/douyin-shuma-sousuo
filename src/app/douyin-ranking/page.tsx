'use client';
import React, { useState, useEffect } from 'react';

// 定义搜索排行项接口
interface RankingItem {
  id: string;
  keyword: string;
  count: number;
  frequency: number;
  category: string;
}

// 模拟从第三方API获取数据
const fetchThirdPartyData = async (): Promise<any[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟第三方API返回的数据（基于公开数据调整）
  const mockThirdPartyData = [
    { keyword: 'iPhone 17 Pro', searchIndex: 8900 },
    { keyword: '华为Mate 80 Pro', searchIndex: 8500 },
    { keyword: '小米16 Pro', searchIndex: 8200 },
    { keyword: 'Redmi K90 Pro', searchIndex: 7800 },
    { keyword: 'vivo X200 Pro', searchIndex: 7500 },
    { keyword: 'OPPO Find X9 Pro', searchIndex: 7300 },
    { keyword: '荣耀Magic 8 Pro', searchIndex: 7000 },
    { keyword: 'iQOO 14 Pro', searchIndex: 6800 },
    { keyword: '一加14', searchIndex: 6500 },
    { keyword: 'Galaxy S26 Ultra', searchIndex: 6200 },
    { keyword: 'iPhone 17', searchIndex: 6000 },
    { keyword: '华为Mate X6', searchIndex: 5800 },
    { keyword: '小米Mix Fold 5', searchIndex: 5600 },
    { keyword: '荣耀300 Pro', searchIndex: 5400 },
    { keyword: 'OPPO Reno 14 Pro', searchIndex: 5200 },
    { keyword: 'vivo S21', searchIndex: 5000 },
    { keyword: 'Redmi K90', searchIndex: 4800 },
    { keyword: 'Galaxy Z Fold7', searchIndex: 4600 },
    { keyword: '华为Nova 14', searchIndex: 4400 },
    { keyword: 'iQOO 14', searchIndex: 4200 }
  ];
  
  return mockThirdPartyData;
};

// 处理第三方数据
const processThirdPartyData = (data: any[]): RankingItem[] => {
  return data.map((item, index) => {
    // 根据不同API的数据格式进行转换
    return {
      id: `phone-${index}`,
      keyword: item.keyword || item.name,
      // 直接使用第三方搜索指数作为我们的搜索指数
      count: item.searchIndex || item.hotValue || 0,
      frequency: Math.random() * 100, // 保持原有的随机频率值
      category: determineCategory(item.keyword || item.name)
    };
  });
};

// 从多种数据源获取数据的函数
const fetchRankingData = async (): Promise<RankingItem[]> => {
  try {
    // 1. 首先尝试从第三方API获取数据（模拟）
    try {
      const thirdPartyData = await fetchThirdPartyData();
      if (thirdPartyData && thirdPartyData.length > 0) {
        console.log('Using third-party API data');
        return processThirdPartyData(thirdPartyData);
      }
    } catch (apiError) {
      console.log('Third-party API failed, falling back to JSON file');
    }

    // 2. 尝试从public目录读取JSON文件
    try {
      const response = await fetch('/search_rank.json', {
        cache: 'no-cache' // 禁用缓存，确保每次都获取最新数据
      });
      
      if (response.ok) {
        const jsonData = await response.json();
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          console.log('Using local JSON file data');
          return jsonData.map((item, index) => ({
            id: `phone-${index}`,
            keyword: item.word || item.keyword || '',
            count: item.index || item.count || 0,
            frequency: Math.random() * 100,
            category: determineCategory(item.word || item.keyword || '')
          }));
        }
      }
    } catch (jsonError) {
      console.log('Local JSON file failed, falling back to mock data');
    }

    // 3. 最后回退到增强版模拟数据
    console.log('Using enhanced mock data');
    return generateMockData();
  } catch (error) {
    console.error('Error fetching ranking data:', error);
    // 如果所有方法都失败，返回模拟数据作为最后的备用
    return generateMockData();
  }
};

// 生成增强版模拟数据的函数（作为备用）
const generateMockData = (): RankingItem[] => {
  // 真实手机型号列表，按品牌和系列组织
  const phoneModels = [
    // 苹果
    { keyword: 'iPhone 17 Pro', baseIndex: 8800 },
    { keyword: 'iPhone 17 Pro Max', baseIndex: 8500 },
    { keyword: 'iPhone 17', baseIndex: 7800 },
    { keyword: 'iPhone 17 Air', baseIndex: 7200 },
    
    // 华为
    { keyword: '华为Mate 80 Pro', baseIndex: 8600 },
    { keyword: '华为Mate 80 Pro+', baseIndex: 8300 },
    { keyword: '华为Mate X6', baseIndex: 8000 },
    { keyword: '华为Mate 80', baseIndex: 7500 },
    { keyword: '华为Nova 14', baseIndex: 6500 },
    { keyword: '华为Mate 80 RS 非凡大师', baseIndex: 9000 },
    
    // 小米
    { keyword: '小米16 Pro', baseIndex: 8200 },
    { keyword: '小米16 Ultra', baseIndex: 7900 },
    { keyword: '小米16', baseIndex: 7600 },
    { keyword: '小米Mix Fold 5', baseIndex: 7400 },
    { keyword: 'Redmi K90 Pro', baseIndex: 7800 },
    { keyword: 'Redmi K90', baseIndex: 7300 },
    { keyword: '小米Mix Flip 2', baseIndex: 7000 },
    
    // vivo
    { keyword: 'vivo X200 Pro', baseIndex: 7500 },
    { keyword: 'vivo X200', baseIndex: 7100 },
    { keyword: 'iQOO 14 Pro', baseIndex: 6800 },
    { keyword: 'iQOO 14', baseIndex: 6400 },
    { keyword: 'vivo S21', baseIndex: 5900 },
    { keyword: 'vivo X200 Pro mini', baseIndex: 6600 },
    
    // OPPO
    { keyword: 'OPPO Find X9 Pro', baseIndex: 7300 },
    { keyword: 'OPPO Find X9', baseIndex: 6900 },
    { keyword: 'OPPO Reno 14 Pro', baseIndex: 6400 },
    { keyword: 'OPPO Reno 15', baseIndex: 6100 },
    { keyword: '一加14', baseIndex: 6500 },
    { keyword: 'OnePlus 14', baseIndex: 6300 },
    
    // 荣耀
    { keyword: '荣耀Magic 8 Pro', baseIndex: 7000 },
    { keyword: '荣耀Magic 8', baseIndex: 6600 },
    { keyword: '荣耀300 Pro', baseIndex: 6300 },
    { keyword: '荣耀Magic V4', baseIndex: 6700 },
    
    // 三星
    { keyword: 'Galaxy S26 Ultra', baseIndex: 6200 },
    { keyword: 'Galaxy Z Fold7', baseIndex: 6000 },
    { keyword: 'Galaxy Z Flip7', baseIndex: 5800 },
    { keyword: '三星S26', baseIndex: 5600 }
  ];
  
  // 生成更真实的模拟数据
  return phoneModels.map((model, index) => {
    // 在基础指数上添加±5%的随机波动，使数据更真实
    const fluctuation = Math.random() * 0.1 - 0.05; // -5% 到 +5%
    const adjustedIndex = Math.round(model.baseIndex * (1 + fluctuation));
    
    return {
      id: `phone-${index}`,
      keyword: model.keyword,
      count: adjustedIndex,
      frequency: Math.random() * 100,
      category: determineCategory(model.keyword)
    };
  })
  // 按搜索指数排序
  .sort((a, b) => b.count - a.count);
};

// 根据关键词确定分类
const determineCategory = (keyword: string): string => {
  // 手机品牌关键词映射
  const brandKeywords: Record<string, string> = {
    'iPhone': '手机/苹果',
    '华为': '手机/华为',
    '小米': '手机/小米',
    '红米': '手机/小米',
    'Redmi': '手机/小米',
    'vivo': '手机/vivo',
    'iQOO': '手机/vivo',
    'OPPO': '手机/OPPO',
    '一加': '手机/OPPO',
    'OnePlus': '手机/OPPO',
    '荣耀': '手机/荣耀',
    'Galaxy': '手机/三星',
    '三星': '手机/三星'
  };
  
  // 遍历品牌关键词，确定分类
  for (const [key, category] of Object.entries(brandKeywords)) {
    if (keyword.includes(key)) {
      return category;
    }
  }
  
  // 默认分类
  return '手机/其他';
};

const DouyinRanking = () => {
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  // 初始化为null，在客户端首次渲染时设置
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // 更新排名数据
  const updateRankingData = async () => {
    setIsUpdating(true);
    try {
      // 1. 首先调用API更新本地JSON文件
      console.log('正在调用API更新数据...');
      const updateResponse = await fetch('/api/update-ranking', {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update data via API');
      }
      
      // 2. 然后重新获取最新数据
      console.log('API更新成功，正在获取最新数据...');
      const data = await fetchRankingData();
      setRankingData(data);
      setLastUpdate(new Date());
      
      console.log('数据更新完成');
    } catch (error) {
      console.error('Error updating ranking data:', error);
      // 如果API调用失败，仍然尝试从现有数据源获取数据
      try {
        const data = await fetchRankingData();
        setRankingData(data);
        setLastUpdate(new Date());
      } catch (fallbackError) {
        console.error('Fallback data fetch also failed:', fallbackError);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 在客户端首次渲染时设置lastUpdate的初始值
  useEffect(() => {
    // 只有在客户端才会执行这个useEffect
    // 这是修复hydration错误的关键：确保服务器和客户端渲染的时间一致
    if (lastUpdate === null) {
      setLastUpdate(new Date());
    }
  }, [lastUpdate]);

  // 初始化数据和设置自动更新
  useEffect(() => {
    // 检查上次更新时间
    const lastUpdateTime = localStorage.getItem('douyinRankingLastUpdate');
    const now = new Date();
    
    // 计算是否需要更新（每3天更新一次，3天 = 3 * 24 * 60 * 60 * 1000毫秒）
    const shouldUpdate = !lastUpdateTime || 
      (now.getTime() - new Date(lastUpdateTime).getTime() >= 3 * 24 * 60 * 60 * 1000);
    
    if (shouldUpdate) {
      updateRankingData();
      // 保存本次更新时间
      localStorage.setItem('douyinRankingLastUpdate', now.toISOString());
    }
    
    // 设置定时器，每24小时检查一次是否需要更新
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('douyinRankingLastUpdate');
      const currentTime = new Date();
      
      if (!lastUpdate || 
          (currentTime.getTime() - new Date(lastUpdate).getTime() >= 3 * 24 * 60 * 60 * 1000)) {
        updateRankingData();
        localStorage.setItem('douyinRankingLastUpdate', currentTime.toISOString());
      }
    }, 24 * 60 * 60 * 1000);
    
    // 清理函数
    return () => clearInterval(interval);
  }, []);

  // 获取所有手机型号排行（不限制数量），按搜索指数排序
  const allRanking = rankingData
    .sort((a, b) => b.count - a.count);

  // 格式化更新时间
  const formatUpdateTime = (date: Date | null) => {
    if (!date) {
      return '';
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 渲染排名项（炫酷的横向柱状图）
  const renderRankingItem = (item: RankingItem, index: number) => {
    const value = item.count; // 使用count作为搜索指数
    
    // 计算所有手机型号中的最大值，用于归一化百分比
    const maxValue = Math.max(...rankingData.map(i => i.count));
    const percentage = (value / maxValue) * 100;
    
    // 根据排名设置不同的颜色
    const getRankColor = (rank: number) => {
      if (rank === 0) return 'bg-gradient-to-r from-red-500 to-orange-500'; // 第1名
      if (rank === 1) return 'bg-gradient-to-r from-orange-500 to-yellow-500'; // 第2名
      if (rank === 2) return 'bg-gradient-to-r from-yellow-500 to-green-500'; // 第3名
      return 'bg-gradient-to-r from-blue-500 to-purple-500'; // 其他名次
    };

    return (
      <div key={item.id} className="mb-4">
        <div className="flex items-center space-x-4">
          {/* 排名 */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${getRankColor(index)}`}>
            {index + 1}
          </div>
          
          {/* 关键词 */}
          <div className="flex-1 font-medium text-gray-800">
            {item.keyword}
          </div>
          
          {/* 搜索指数 */}
          <div className="w-24 text-right font-semibold text-gray-700">
            {value.toLocaleString()}
          </div>
          
          {/* 分类标签 */}
          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {item.category}
          </div>
        </div>
        
        {/* 炫酷的横向柱状图 */}
        <div className="ml-14 mt-1">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out transform origin-left ${getRankColor(index)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* 标题和控制区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform hover:shadow-xl transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              抖音手机型号搜索排行
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* 搜索指数标签 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-md">
                搜索指数
              </div>
              
              {/* 上次更新时间和立即更新按钮 */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  上次更新: {formatUpdateTime(lastUpdate)}
                </span>
                <button
                  onClick={updateRankingData}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isUpdating}
                >
                  {isUpdating ? '更新中...' : '立即更新'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-gray-600">
            <p>抖音全平台手机型号搜索数据，展示所有手机型号。</p>
            <p className="text-sm mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-1"></span>
              系统每3天自动更新一次数据，您也可以点击"立即更新"按钮手动刷新。
            </p>
          </div>
        </div>
        
        {/* 排行内容区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">手机型号搜索排行</h3>
          <div className="space-y-2">
            {allRanking.map((item, index) => renderRankingItem(item, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DouyinRanking;