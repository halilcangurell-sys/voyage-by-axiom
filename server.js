// server.js

// Gerekli modülleri dahil et
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Dosya yolu işlemleri için
require('dotenv').config(); 

// Rota dosyalarını dahil et
const todosRouter = require('./routes/todos'); 
const contactRouter = require('./routes/contact'); 

const app = express();
// Render'da PORT otomatik atanır, bu yüzden process.env.PORT'u kullanmak zorundayız.
const PORT = process.env.PORT || 10000; 

// --- Middleware'ler ---
// Gelen JSON isteklerini işlemek için (Contact Form için gerekli)
app.use(express.json()); 

// 1. KRİTİK ADIM: Statik dosyaları (index.html, contact.html, style.css vb.) sunar
// Bu, sitenizin ana içeriğini görmenizi sağlayan temel koddur.
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

// --- SUNUCU AÇILIŞ NOTU ---
// Express, app.use(express.static(...)) sayesinde / adresine gelen isteklere 
// otomatik olarak public/index.html dosyasını sunacaktır. Başka bir app.get('/') gerekmez.

// --- Sunucuyu Başlatma ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});