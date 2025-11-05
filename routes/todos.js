// routes/todos.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo'); // Todo modelini dahil et

// =======================================================
// Middleware: Belirli bir ID'ye göre görevi bulan fonksiyon
// =======================================================
// Bu fonksiyon, /:id içeren tüm rotalarda (PATCH, DELETE) görevi bulmak için kullanılır.
async function getTodo(req, res, next) {
    let todo;
    try {
        // URL'den gelen ID'yi kullanarak veritabanında görevi bul
        todo = await Todo.findById(req.params.id);
        if (todo == null) {
            // Eğer o ID'de bir görev yoksa, 404 (Not Found) hatası dön
            return res.status(404).json({ message: 'Görev bulunamadı.' });
        }
    } catch (err) {
        // Geçersiz ID formatı gibi veritabanı hataları için 500 (Server Error) dön
        return res.status(500).json({ message: err.message });
    }

    res.todo = todo; // Bulunan görevi bir sonraki işleyiciye taşımak için res.todo içine kaydet
    next(); // Bir sonraki rotaya geç (PATCH veya DELETE)
}

// =======================================================
// A. READ: TÜM GÖREVLERİ GETİR - GET /api/todos
// =======================================================
router.get('/', async (req, res) => {
    try {
        // Tüm görevleri çek ve oluşturulma tarihine göre en yeniden eskiye doğru sırala
        const todos = await Todo.find().sort({ createdAt: -1 }); 
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =======================================================
// B. CREATE: YENİ GÖREV EKLE - POST /api/todos
// =======================================================
router.post('/', async (req, res) => {
    // İstek gövdesinden (req.body) sadece 'gorev' alanını al
    const { gorev } = req.body; 

    if (!gorev) {
        return res.status(400).json({ message: "Görev içeriği boş olamaz." });
    }
    
    // Yeni bir Todo (görev) nesnesi oluştur
    const todo = new Todo({ gorev });

    try {
        const newTodo = await todo.save(); // Veritabanına kaydet
        res.status(201).json(newTodo); // Başarıyla oluşturuldu (201) cevabını dön
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// =======================================================
// C. UPDATE: GÖREVİ GÜNCELLE - PATCH /api/todos/:id
// =======================================================
// Önce getTodo middleware'i çalışır, görevi bulur
router.patch('/:id', getTodo, async (req, res) => {
    // Sadece istek gövdesinde (req.body) gelen alanlar varsa güncelleme yap
    if (req.body.gorev != null) {
        res.todo.gorev = req.body.gorev;
    }
    if (req.body.tamamlandi != null) {
        res.todo.tamamlandi = req.body.tamamlandi;
    }
    
    try {
        const updatedTodo = await res.todo.save(); // Değişiklikleri kaydet
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); // <-- router.patch rotası burada düzgünce kapanır

// =======================================================
// D. DELETE: GÖREVİ SİL - DELETE /api/todos/:id
// =======================================================
// Önce getTodo middleware'i çalışır, görevi bulur
router.delete('/:id', getTodo, async (req, res) => {
    try {
        // Bulunan görevi sil
        await res.todo.deleteOne(); 
        res.json({ message: 'Görev başarıyla silindi.' }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); // <-- router.delete rotası burada kapanır


module.exports = router;