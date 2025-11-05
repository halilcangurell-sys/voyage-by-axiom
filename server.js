// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); 

// Rota dosyalarını dahil et
const todosRouter = require('./routes/todos'); 
const contactRouter = require('./routes/contact'); 

const app = express();
// Render'da PORT otomatik ayarlanacağı için, burayı sabit bir değer yapmak en iyisidir
const PORT = process.env.PORT || 10000; 

// --- Middleware'ler ---
app.use(express.json()); 
// --- KRİTİK DÜZELTME: Statik dosyaları (public/index.html dahil) sunar ---
// Bu, sitenizin açılmasını sağlayan temel koddur.
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
app.use('/api/todos', todosRouter);
app.use('/api/contact', contactRouter); 

// --- Ana Sayfa (Root) Rotasını Kaldırma ---
// app.get('/') rotası SİLİNDİ, çünkü express.static(path.join(__dirname, 'public')) 
// zaten otomatik olarak public/index.html dosyasını sunar.
// Eğer bu rota kalırsa, statik dosyaların açılmasını engelleyebilir.

// --- Sunucuyu Başlatma ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});