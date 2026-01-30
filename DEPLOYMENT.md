# 🚀 Puantaj Pro - Canlıya Alma ve Domain Rehberi

**Mevcut Domain:** `puantajpro.site`

## 1. Domain Bağlama (DNS Ayarları)
Satın aldığınız `puantajpro.site` domain adresini Vercel'e bağlamak için aşağıdaki adımları domain satın aldığınız firmanın panelinden (DNS Yönetimi) yapın:

| Kayıt Tipi (Type) | Ad (Name/Host) | Değer (Value/Target) |
| ----------------- | -------------- | -------------------- |
| **A**             | `@`            | `76.76.21.21`        |
| **CNAME**         | `www`          | `cname.vercel-dns.com` |

> **Not:** DNS değişikliklerinin dünya geneline yayılması 15 dakika ile 24 saat arasında sürebilir.

## 2. Vercel Panelinden Domain Ekleme
1.  [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin.
2.  **Puantaj Pro** projenizi seçin.
3.  **Settings** > **Domains** sekmesine tıklayın.
4.  Kutucuğa `puantajpro.site` yazın ve **Add** butonuna tıklayın.
5.  Eğer "Invalid Configuration" hatası alırsanız, yukarıdaki DNS ayarlarını doğru yaptığınızdan emin olun ve bir süre bekleyin.

## 3. Kritik Ayar: URL Güncelleme (Zorunlu)
Domain değiştirdiğiniz için **NextAuth** (Giriş Sistemi) ayarını güncellemeniz gerekmektedir. Aksi takdirde giriş yaparken hata alırsınız.

1.  Vercel'de projenizin **Settings** > **Environment Variables** sayfasına gidin.
2.  Listede `NEXTAUTH_URL` değişkenini bulun.
3.  Yanındaki üç noktaya tıklayıp **Edit** deyin.
4.  Değeri şu şekilde güncelleyin:
    *   **Value:** `https://puantajpro.site`
5.  **Save** deyin.
6.  Değişikliğin aktif olması için **Deployments** sekmesine gidin, son deploy'un yanındaki üç noktaya tıklayıp **Redeploy** yapın.

---
**Tebrikler!** Artık siteniz `https://puantajpro.site` adresinde yayında olacaktır. 🌍
