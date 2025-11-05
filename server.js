// server.js
// server.js dosyasının en üstüne (const express = require('express'); satırından sonra)
const fs = require('fs'); 
// NOT: Bu satır normalde gerekmez, ancak Render'ın loglarında kalan 'fs' hatasını susturmak için ekliyoruz.
// Gerekli modülleri dahil et
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); 

// Rota dosyalarını dahil et
const todosRouter = require('./routes/todos'); 
const contactRouter = require('./routes/contact'); 

const app = express();
// Render'da PORT otomatik atanır.
const PORT = process.env.PORT || 10000; 

// --- Middleware'ler ---
// Gelen JSON isteklerini işlemek için (Contact Form için gerekli)
app.use(express.json()); 

// KRİTİK ADIM: Statik dosyaları (index.html, contact.html, style.css vb.) sunar
// Bu, sitenizin açılışını garanti eder.
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

// --- Sunucuyu Başlatma ---
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});