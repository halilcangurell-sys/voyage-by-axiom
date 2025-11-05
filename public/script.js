// public/script.js

const todoList = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');
const gorevInput = document.getElementById('gorevInput');
const API_URL = '/api/todos';

// ----------------------------------------------------
// A. GÖREVLERİ ÇEKME VE LİSTELEME
// ----------------------------------------------------
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        
        todoList.innerHTML = ''; // Listeyi temizle

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.gorev;
            li.dataset.id = todo._id; // Görev ID'sini data özelliğine kaydet

            // Tamamlandı durumuna göre stil ve olay dinleyicisi ekle
            if (todo.tamamlandi) {
                li.classList.add('tamamlandi');
            }
            li.addEventListener('click', () => toggleComplete(todo._id, !todo.tamamlandi));

            // Silme butonu ekle
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Sil';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // li'nin click olayını engelle
                deleteTodo(todo._id);
            });

            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Görevler çekilemedi:', error);
        todoList.innerHTML = '<li>Görevler yüklenirken bir hata oluştu. Sunucuyu kontrol edin.</li>';
    }
}

// ----------------------------------------------------
// B. YENİ GÖREV EKLEME (CREATE)
// ----------------------------------------------------
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const gorev = gorevInput.value.trim();

    if (!gorev) return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gorev: gorev })
        });

        gorevInput.value = ''; 
        fetchTodos(); // Listeyi yenile
    } catch (error) {
        console.error('Yeni görev eklenirken hata:', error);
        alert('Görev eklenemedi!');
    }
});

// ----------------------------------------------------
// C. GÖREVİ TAMAMLAMA (UPDATE - PATCH)
// ----------------------------------------------------
async function toggleComplete(id, currentStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tamamlandi: currentStatus }) // Yeni durumu gönder
        });
        fetchTodos(); // Güncellenmiş listeyi yenile
    } catch (error) {
        console.error('Görev güncellenirken hata:', error);
    }
}

// ----------------------------------------------------
// D. GÖREVİ SİLME (DELETE)
// ----------------------------------------------------
async function deleteTodo(id) {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        return;
    }
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchTodos(); // Listeyi yenile
    } catch (error) {
        console.error('Görev silinirken hata:', error);
    }
}

// Sayfa yüklendiğinde görevleri otomatik olarak çek
document.addEventListener('DOMContentLoaded', fetchTodos);