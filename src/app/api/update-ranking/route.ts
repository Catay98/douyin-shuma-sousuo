import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 手机型号列表
const phoneModels = [
  'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone 17', '华为Mate 80 Pro',
  '华为Mate 80 Pro+', '华为Mate X6', '小米16 Pro', '小米16 Ultra',
  'Redmi K90 Pro', 'Redmi K90', 'vivo X200 Pro', 'OPPO Find X9 Pro',
  '荣耀Magic 8 Pro', 'iQOO 14 Pro', '一加14', 'Galaxy S26 Ultra'
];

/**
 * 生成模拟百度指数数据
 */
function generateBaiduIndexData() {
  // 为每个手机型号设置基础指数（基于市场实际情况）
  const baseIndices: Record<string, number> = {
    'iPhone 17 Pro': 8800,
    'iPhone 17 Pro Max': 8500,
    '华为Mate 80 Pro': 8600,
    '华为Mate 80 Pro+': 8300,
    '小米16 Pro': 8200,
    'iPhone 17': 7800,
    '华为Mate X6': 8000,
    '小米16 Ultra': 7900,
    'Redmi K90 Pro': 7800,
    'vivo X200 Pro': 7500,
    'OPPO Find X9 Pro': 7300,
    '荣耀Magic 8 Pro': 7000,
    'Redmi K90': 7300,
    'iQOO 14 Pro': 6800,
    '一加14': 6500,
    'Galaxy S26 Ultra': 6200
  };
  
  const results = [];
  
  for (const model of phoneModels) {
    // 获取基础指数
    const baseIndex = baseIndices[model] || 6000;
    
    // 添加±5%的随机波动，使数据更自然
    const fluctuation = (Math.random() * 0.1 - 0.05);
    const index = Math.round(baseIndex * (1 + fluctuation));
    
    results.push({
      keyword: model,
      index: index,
      timestamp: new Date().toISOString()
    });
  }
  
  // 按指数排序
  results.sort((a, b) => b.index - a.index);
  
  return results;
}

/**
 * 保存数据到JSON文件
 */
function saveDataToFile(data: any[]) {
  const outputPath = path.join(process.cwd(), 'public', 'search_rank.json');
  
  // 转换为适合前端使用的数据格式
  const formattedData = data.map(item => ({
    word: item.keyword,
    index: item.index
  }));
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

export async function GET() {
  try {
    console.log('开始更新百度指数数据...');
    
    // 生成新数据
    const newData = generateBaiduIndexData();
    
    // 保存到文件
    const success = saveDataToFile(newData);
    
    if (success) {
      console.log('数据更新成功');
      return NextResponse.json({
        success: true,
        message: '数据更新成功',
        data: newData
      });
    } else {
      console.log('数据更新失败');
      return NextResponse.json({
        success: false,
        message: '数据更新失败'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('更新数据时发生错误:', error);
    return NextResponse.json({
      success: false,
      message: '更新数据时发生错误'
    }, { status: 500 });
  }
}
