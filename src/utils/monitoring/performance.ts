export const performanceMonitoring = {
  measureCoreWebVitals: () => {
    // Измерение Core Web Vitals
    const cls = getCLS();
    const fid = getFID();
    const lcp = getLCP();

    return {
      cls,
      fid,
      lcp,
      timestamp: Date.now()
    };
  },

  trackUserInteraction: () => {
    // Отслеживание взаимодействия пользователей
    const interactions = {
      clicks: trackClicks(),
      scrollDepth: trackScrollDepth(),
      timeOnPage: trackTimeOnPage()
    };

    return interactions;
  }
}; 