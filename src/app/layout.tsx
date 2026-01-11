import '../globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

// 定义页面元数据
export const metadata: Metadata = {
  title: '文本分析工具集',
  description: '包含关键词密度识别等多种文本分析功能的工具集',
};

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">
          {/* 左侧菜单栏 */}
          <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800 mb-6">文本分析工具集</h1>
              <nav className="space-y-1">
                <Link
                  href="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  首页
                </Link>
                <Link
                  href="/keyword-analyzer"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  关键词密度识别
                </Link>
                <Link
                  href="/douyin-ranking"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  抖音搜索排行
                </Link>
                {/* 可以在这里添加更多工具链接 */}
              </nav>
            </div>
          </aside>
          
          {/* 主内容区域 */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}