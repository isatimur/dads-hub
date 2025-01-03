export const lazyLoadComponents = {
  // Компоненты, которые можно загружать лениво
  BlogPosts: dynamic(() => import('@/components/blog/BlogPosts')),
  Comments: dynamic(() => import('@/components/comments/Comments')),
  VideoPlayer: dynamic(() => import('@/components/media/VideoPlayer')),
};

export const preloadCriticalAssets = () => {
  // Предзагрузка критических ресурсов
  const criticalAssets = [
    '/fonts/main-font.woff2',
    '/images/hero-image.webp',
    '/css/critical.css'
  ];

  criticalAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.includes('.woff2') ? 'font' : 
              asset.includes('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
}; 