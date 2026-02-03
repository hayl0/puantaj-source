
const baseUrl = 'https://puantajpro.site';

async function test() {
  try {
    console.log('🔍 API Durum Kontrolü...');
    
    // 1. Health Check
    try {
      const healthRes = await fetch(`${baseUrl}/api/health`);
      console.log(`🏥 /api/health: ${healthRes.status} ${healthRes.statusText}`);
      if (!healthRes.ok) {
        const text = await healthRes.text();
        console.log('📄 Health Body:', text.substring(0, 200));
      }
    } catch (e) {
      console.log('❌ Health Check Failed:', e.message);
    }

    // 2. Auth CSRF Check
    console.log('\n🔐 Auth CSRF Kontrolü...');
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    console.log(`🔑 /api/auth/csrf: ${csrfRes.status} ${csrfRes.statusText}`);
    
    const text = await csrfRes.text();
    if (csrfRes.ok && text.startsWith('{')) {
        console.log('✅ CSRF JSON:', text.substring(0, 100));
    } else {
        console.log('❌ HATA İÇERİĞİ (HTML):');
        // Extract title or body content
        const titleMatch = text.match(/<title>(.*?)<\/title>/);
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        
        if (titleMatch) console.log('🏷️ Sayfa Başlığı:', titleMatch[1]);
        console.log('📄 İçerik Özeti:', text.substring(0, 300).replace(/\s+/g, ' '));
    }

  } catch (error) {
    console.error('💥 GENEL HATA:', error.message);
  }
}

test();
