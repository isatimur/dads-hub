export const i18nConfig = {
  defaultLocale: 'ru',
  locales: ['ru', 'en'],
  domains: [
    {
      domain: 'otec-molodec.ru',
      defaultLocale: 'ru',
    },
    {
      domain: 'otec-molodec.com',
      defaultLocale: 'en',
    }
  ],
  pages: {
    '*': ['common'],
    '/blog': ['blog'],
    '/about': ['about']
  }
}; 