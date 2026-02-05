
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://puantajpro.site'
  const locales = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar']
  
  // Pages that should be indexed
  const routes = [
    '',
    '/hakkimizda',
    '/iletisim',
    '/legal/gizlilik',
    '/legal/kullanim-sartlari',
    '/login',
    '/register/admin',
    '/register/personnel'
  ]

  const sitemap: MetadataRoute.Sitemap = []

  routes.forEach(route => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // Add root URL as well (usually redirects to default locale, but good to have)
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })

  return sitemap
}
