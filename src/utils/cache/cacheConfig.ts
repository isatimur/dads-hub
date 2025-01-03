export const cacheConfig = {
  // Настройки кэширования для разных типов контента
  static: {
    maxAge: '1y',
    immutable: true
  },
  dynamic: {
    maxAge: '1d',
    revalidate: true
  },
  api: {
    maxAge: '1h',
    staleWhileRevalidate: '1d'
  }
};

export const setupCaching = () => {
  // Настройка service worker для кэширования
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  }
}; 