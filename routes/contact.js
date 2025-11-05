// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Yeni Contact modelini dahil et

// POST /api/contact - Yeni iletişim mesajını kaydetme
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Basit doğrulama
    if (!firstName || !email || !message) {
        return res.status(400).json({ message: 'Ad, E-posta ve Mesaj alanları gereklidir.' });
    }

    const newMessage = new Contact({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
    });

    try {
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Mesajınız başarıyla alındı.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Sunucu hatası: Mesaj kaydedilemedi.' });
    }
});

module.exports = router;