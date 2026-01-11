'use client';
import React, { useState } from 'react';

interface KeywordDensity {
  word: string;
  count: number;
  density: number;
}

const KeywordAnalyzer = () => {
  const [text, setText] = useState<string>('');
  const [results, setResults] = useState<KeywordDensity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // 自动提取关键词并计算密度
  const analyzeText = () => {
    console.log('分析按钮被点击，当前文本:', text);
    
    if (!text.trim()) {
      console.log('文本为空，重置结果');
      setResults([]);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // 1. 文本预处理
      // 移除标点符号、空格和特殊字符，保留中文字符
      const cleanedText = text.replace(/[\s\p{P}\p{S}\d]/gu, '');
      
      // 统计总字数（不包括标点符号和空格）
      const totalWords = cleanedText.length;
      console.log('总字数:', totalWords);
      
      // 2. 提取所有可能的关键词（不限制长度，提取所有连续字符）
      const keywordCandidates: Record<string, number> = {};
      
      // 提取所有可能的连续字符作为关键词
      // 从1字到整个文本长度
      for (let i = 0; i < cleanedText.length; i++) {
        for (let j = i + 1; j <= cleanedText.length; j++) {
          const keyword = cleanedText.substring(i, j);
          keywordCandidates[keyword] = (keywordCandidates[keyword] || 0) + 1;
        }
      }
      
      console.log('候选关键词:', keywordCandidates);
      
      // 3. 计算关键词密度
      const allKeywords = Object.entries(keywordCandidates)
        .map(([word, count]) => {
          return {
            word,
            count,
            density: totalWords > 0 ? (count * word.length / totalWords) * 100 : 0
          };
        });
      
      console.log('所有关键词数量:', allKeywords.length);
      
      // 按出现次数排序
      const sortedByCount = allKeywords.sort((a, b) => b.count - a.count);
      console.log('按出现次数排序后的前20个:', sortedByCount.slice(0, 20));
      
      // 过滤掉单字关键词（单字通常没有实际意义）
      const filteredSingleChars = sortedByCount.filter(item => item.word.length > 1);
      console.log('过滤单字后关键词数量:', filteredSingleChars.length);
      console.log('过滤单字后前20个:', filteredSingleChars.slice(0, 20));
      
      // 简化去重逻辑：只保留出现次数较高的关键词（至少出现2次）
      // 这样可以确保有结果展示
      const uniqueKeywords = filteredSingleChars
        // 只保留出现次数较高的关键词（至少出现2次）
        .filter(item => item.count >= 2)
        // 按出现次数排序
        .sort((a, b) => b.count - a.count);
      
      console.log('去重后关键词数量:', uniqueKeywords.length);
      console.log('去重后前20个:', uniqueKeywords.slice(0, 20));
      
      // 只保留排名前十的关键词
      const topKeywords = uniqueKeywords.slice(0, 10);
      
      // 按密度排序
      const densityResults = topKeywords.sort((a, b) => b.density - a.density);
      
      console.log('分析结果:', densityResults);
      setResults(densityResults);
    } catch (error) {
      console.error('分析过程中出错:', error);
      setResults([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 清空文本和结果
  const clearText = () => {
    setText('');
    setResults([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">关键词密度识别工具</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="text-input" className="text-lg font-medium text-gray-700">输入文本</label>
          <div className="flex space-x-2">
            <button
              onClick={clearText}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
            >
              清空
            </button>
            <button
              onClick={analyzeText}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? '分析中...' : '开始分析'}
            </button>
          </div>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要分析的文本..."
          className="w-full h-48 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">分析结果</h2>
          <span className="text-sm text-gray-600">
            展示排名前十的关键词
          </span>
        </div>
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{result.word}</h3>
                  <p className="text-sm text-gray-600">
                    出现 {result.count} 次
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {result.density.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(result.density * 10, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                排名 {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-md">
          {text.trim() ? (
            <p>点击"开始分析"查看结果</p>
          ) : (
            '请输入文本进行分析'
          )}
        </div>
      )}
    </div>
  );
};

export default KeywordAnalyzer;