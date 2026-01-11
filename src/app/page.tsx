import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">欢迎使用文本分析工具集</h1>
        <p className="text-gray-600 mb-8 text-center">
          我们提供多种文本分析工具，帮助您深入了解文本内容
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 关键词密度识别工具卡片 */}
          <Link
            href="/keyword-analyzer"
            className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl font-bold">🔍</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">关键词密度识别</h2>
            </div>
            <p className="text-gray-600 mb-4">
              自动提取文本中的关键词，计算关键词出现频率和密度，展示排名前十的关键词
            </p>
            <div className="text-blue-600 font-medium">
              开始使用 →
            </div>
          </Link>
          
          {/* 预留其他工具卡片位置 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 text-xl font-bold">📝</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">更多工具即将上线</h2>
            </div>
            <p className="text-gray-600">
              我们正在开发更多文本分析工具，敬请期待...
            </p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">使用指南</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>从左侧菜单栏选择您需要的工具</li>
            <li>在工具页面输入您要分析的文本</li>
            <li>点击"开始分析"按钮查看结果</li>
            <li>根据分析结果优化您的文本内容</li>
          </ul>
        </div>
      </div>
    </div>
  );
}