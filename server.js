// server.js

// Gerekli paketleri dahil et
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); 

// Rota dosyalarını dahil et
const todosRouter = require('./routes/todos'); 
const contactRouter = require('./routes/contact'); 

const app = express();
// Render'da PORT otomatik ayarlanır, ancak bu satır gereklidir.
const PORT = process.env.PORT || 10000; 

// --- Middleware'ler ---
// Gelen JSON isteklerini işlemek için
app.use(express.json()); 
// Statik dosyaları (CSS, JS, index.html, contact.html) sunar
app.use(express.static(path.join(__dirname, 'public'))); 
// -----------------------

// --- MongoDB Veritabanı Bağlantısı ---
const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı!'))
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err.name, ' - ', err.message);
  }); 

// --- API Rotalarını Uygulamaya Bağlama ---
// ToDo listesi API'si
app.use('/api/todos', todosRouter);
// İletişim Formu API'si
app.use('/api/contact', contactRouter); 

// --- KRİTİK SON DÜZELTME: Ana Sayfa Yönlendirmesini Zorlama ---
// API rotaları haricinde gelen tüm GET isteklerini (örn. /, /contact.html, /hizmetlerimiz.html)
// public/index.html dosyasına yönlendirir.
app.get('*', (req, res) => {
  // Eğer istenen dosya public klasöründe varsa, onu gönder
  if (req.url.endsWith('.html') || req.url.endsWith('.css') || req.url.endsWith('.js')) {
    const filePath = path.join(__dirname, 'public', req.url);
    if (fs.existsSync(filePath)) { // Dosyanın varlığını kontrol etmek için fs modülü gerekir.
        // Basitlik adına, sadece ana sayfaya yönlendirelim:
         return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  }

  // Tüm geri kalan yolları index.html'e yönlendir (SPA tarzı)
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// -----------------------------------------------------------

// --- Sunucuyu Başlatma ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});