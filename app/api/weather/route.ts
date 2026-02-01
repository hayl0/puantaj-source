import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // 1. Fetch Weather from Open-Meteo
    // Using current=temperature_2m,weather_code,is_day for latest API version
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
        throw new Error(`Weather API error: ${weatherRes.statusText}`);
    }
    
    const weatherJson = await weatherRes.json();
    const current = weatherJson.current;

    // 2. Fetch City Name from Nominatim (OpenStreetMap)
    // Server-side fetch allows setting User-Agent correctly to comply with policy
    let city = "Konum Bulunamadı";
    
    try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
        const geoRes = await fetch(geoUrl, {
            headers: {
                'User-Agent': 'PuantajPro/1.0 (contact@puantajpro.site)',
                'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8'
            }
        });

        if (geoRes.ok) {
            const geoJson = await geoRes.json();
            // Priority: Town -> City -> District -> Province -> State
            const addr = geoJson.address || {};
            city = addr.town || addr.city || addr.district || addr.province || addr.state || "Bilinmeyen Konum";
        } else {
             console.error("Nominatim error:", geoRes.status);
             // Fallback to BigDataCloud if Nominatim fails
             throw new Error("Nominatim failed");
        }
    } catch (geoError) {
        console.error("Nominatim fetch error, falling back:", geoError);
        try {
             const backupUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`;
             const backupRes = await fetch(backupUrl);
             const backupJson = await backupRes.json();
             city = backupJson.city || backupJson.locality || backupJson.principalSubdivision || "Bilinmeyen Konum";
        } catch (backupError) {
            console.error("Backup geocoding failed:", backupError);
            city = `${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`;
        }
    }

    return NextResponse.json({
        temp: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        city: city,
        isDay: current.is_day
    });

  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
