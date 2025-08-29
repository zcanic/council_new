/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 开发环境配置：禁用本地API路由（连接生产服务器）
  async rewrites() {
    // 如果设置了禁用本地API，则不重写API路由
    if (process.env.DISABLE_LOCAL_API === 'true') {
      return []
    }
    return []
  },
}

export default nextConfig
