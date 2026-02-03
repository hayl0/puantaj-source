import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

// Country to Locale mapping
const countryToLocale: Record<string, string> = {
  // Turkish
  TR: 'tr', AZ: 'tr', CY: 'tr',
  
  // German
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  
  // French
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr',
  
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', CU: 'es',
  
  // Italian
  IT: 'it', SM: 'it', VA: 'it',
  
  // Portuguese
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt',
  
  // Russian
  RU: 'ru', UA: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  
  // Chinese
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
  
  // Japanese
  JP: 'ja',
  
  // Korean
  KR: 'ko', KP: 'ko',
  
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', LB: 'ar', JO: 'ar', OM: 'ar', BH: 'ar', IQ: 'ar',
  
  // English (Default fallback for many)
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', IN: 'en'
};

function addSecurityHeaders(response: Response) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:;"
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-XSS-Protection', '1; mode=block');
}

export default async function middleware(request: NextRequest) {
  const { headers, cookies } = request;
  const hasCookie = cookies.has('NEXT_LOCALE');
  
  // If user hasn't selected a language yet (no cookie), try to detect from country
  if (!hasCookie) {
    const country = headers.get('x-vercel-ip-country') || (request as any).geo?.country;
    
    if (country && countryToLocale[country]) {
      const targetLocale = countryToLocale[country];
      
      // Clone the request headers to avoid mutation issues
      const newHeaders = new Headers(request.headers);
      
      // Prioritize the country-based locale in Accept-Language header
      // This guides next-intl to pick this locale as the default
      newHeaders.set('Accept-Language', `${targetLocale},${headers.get('Accept-Language') || ''}`);
      
      // Create a new request with modified headers
      const newRequest = new NextRequest(request.url, {
        headers: newHeaders,
        // @ts-ignore - geo property is not in the standard NextRequestInit type
        geo: (request as any).geo,
        // @ts-ignore - ip property is not in the standard NextRequestInit type
        ip: (request as any).ip,
        method: request.method,
        body: request.body
      });
      
      const response = await handleI18nRouting(newRequest);
      addSecurityHeaders(response);
      return response;
    }
  }

  const response = await handleI18nRouting(request);
  addSecurityHeaders(response);
  return response;
}


export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
