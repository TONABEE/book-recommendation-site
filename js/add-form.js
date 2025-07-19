// 書籍追加フォーム機能
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addForm');
    form.addEventListener('submit', function(e)  {
      e.preventDefault();
  
      // 入力値取得
      const title       = document.getElementById('title').value.trim();
      const author      = document.getElementById('author').value.trim();
      const description = document.getElementById('description').value.trim();
      const category    = document.getElementById('category').value;
      const imageUrl    = document.getElementById('imageUrl').value.trim();
  
      // サーバーへ POST するときも require は不要
      try {
        async function postData() {
          const res = await fetch('/api/resource', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ title, author, description, category, imageUrl })
          });
          if (!res.ok) throw new Error(res.status);

          // 画面にカードを追加
          const card = document.createElement('div');
          card.className = 'book-card';
        }
        postData();
        card.innerHTML = `
          <div class="book-image-container">
            <img src="${imageUrl}" class="book-image" alt="${title} 表紙">
          </div>
          <div class="book-info">
            <h2 class="book-title">${title}</h2>
            <p class="book-author">${author}</p>
            <p class="book-description">${description}</p>
            <span class="category">${category}</span>
          </div>
        `;
        document.getElementById(`grid-${category}`).appendChild(card);
  
        form.reset();
        new bootstrap.Tab(document.querySelector('#view-tab')).show();
      } catch (err) {
        console.error(err);
        alert('追加に失敗しました');
      }
    });
});
