// server.js

// Gerekli paketleri dahil et
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// .env dosyasındaki değişkenleri yükle
require('dotenv').config(); 

// Rota dosyalarını dahil et
const todosRouter = require('./routes/todos'); 
const contactRouter = require('./routes/contact'); // <<< YENİ İLETİŞİM ROTASI

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware'ler ---
// Gelen JSON isteklerini işlemek için (Form verilerini okuyabilmek için şart)
app.use(express.json()); 
// Statik dosyaları (public klasöründekileri) sunmak için
app.use(express.static(path.join(__dirname, 'public'))); 
// -----------------------

// --- 1. MongoDB Veritabanı Bağlantısı ---
const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı!'))
  .catch(err => {
    // Hatanın detayını terminalde göster
    console.error('❌ MongoDB bağlantı hatası:', err.name, ' - ', err.message);
  }); 

// --- 2. API Rotalarını Uygulamaya Bağlama ---
// Tüm '/api/todos' ile başlayan istekleri todosRouter yönetsin
app.use('/api/todos', todosRouter);
// Tüm '/api/contact' ile başlayan istekleri contactRouter yönetsin (Form verileri buraya gelecek)
app.use('/api/contact', contactRouter); // <<< YENİ ROTA BAĞLANTISI

// --- 3. Basit Bir Ana Sayfa Rotası (Frontend dosyaları sunulduğu için bu rota yedektir) ---
app.get('/', (req, res) => {
  res.send('<h1>Basit Node.js & Express Sunucusu Çalışıyor!</h1><p>Frontend (public/index.html) dosyasını tarayıcınızda görmelisiniz.</p>');
});

// --- 4. Sunucuyu Başlatma ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});