export const performanceOptimizations = {
  images: {
    formats: ['webp', 'avif'],
    sizes: {
      mobile: 640,
      tablet: 1024,
      desktop: 1920
    }
  },
  caching: {
    staticAssets: 31536000, // 1 год
    dynamic: 86400 // 1 день
  }
}; 