// ブラウザ上で動く純粋な DOM 操作コード
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
    
      if (window.Swiper) {
    new Swiper('.swiper-container', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      effect: 'coverflow',
      speed: 1500,
    });
  }

  // ライブフィルター機能
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.book-card').forEach(card => {
      const title = card.querySelector('.book-title').textContent.toLowerCase();
      const author = card.querySelector('.book-author').textContent.toLowerCase();
      card.classList.toggle('hidden', !(title.includes(keyword) || author.includes(keyword)));
    });
  });

  // // 目次（Table of Contents）生成
  // const toc = document.querySelector('.toc');
  // document.querySelectorAll('.book-section').forEach(section => {
  //   const id = section.id;
  //   const title = section.querySelector('h2').textContent;
  //   const li = document.createElement('li');
  //   const a = document.createElement('a');
  //   a.href = `#${id}`;
  //   a.textContent = title;
  //   a.addEventListener('click', e => {
  //     e.preventDefault();
  //     document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  //   });
  //   li.appendChild(a);
  //   toc.appendChild(li);
  // });

  // カスタムコントロール（コメントモーダル）
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    const commentBtn = document.createElement('button');
    commentBtn.textContent = '💬';
    commentBtn.className = 'comment-btn';
    slide.appendChild(commentBtn);
    commentBtn.addEventListener('click', () => {
      document.getElementById('commentModal').classList.remove('hidden');
    });
  });
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('commentModal').classList.add('hidden');
  });
  document.getElementById('commentSubmit').addEventListener('click', () => {
    const text = document.getElementById('commentText').value.trim();
    if (text) alert(`コメント: ${text}`);
    document.getElementById('commentText').value = '';
    document.getElementById('commentModal').classList.add('hidden');
  });

  // ランキング表示更新
  function updateRanking() {
    const cardsArr = Array.from(document.querySelectorAll('.book-card'));
    cardsArr.sort((a, b) => Number(b.dataset.likes) - Number(a.dataset.likes));
    const top3 = cardsArr.slice(0, 3);
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    top3.forEach((card, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      const clone = card.cloneNode(true);
      clone.classList.remove('hidden');
      
      // 順位ラベルを追加
      const rankLabel = document.createElement('div');
      rankLabel.className = 'ranking-label';
      const rankText = ['1位', '2位', '3位'][index];
      rankLabel.textContent = rankText;
      rankLabel.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        background: #FFD700;
        color: #333;
        padding: 5px 10px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 10;
      `;
      
      // 順位に応じて色を変更
      if (index === 0) rankLabel.style.background = '#FFD700'; // 金
      else if (index === 1) rankLabel.style.background = '#C0C0C0'; // 銀
      else if (index === 2) rankLabel.style.background = '#CD7F32'; // 銅
      
      col.style.position = 'relative';
      col.appendChild(rankLabel);
      col.appendChild(clone);
      rankingList.appendChild(col);
    });
  }
  updateRanking();
  // レビュー表示トグル（クリックで開閉）
  document.querySelectorAll('.review-toggle').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const reviewDiv = toggleBtn.nextElementSibling;
      if (reviewDiv) {
        reviewDiv.classList.toggle('hidden');
      }
    });
  });

  // レイティング＆レビュー機能
  const ratingCards = document.querySelectorAll('.book-card');
  let storedRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
  let storedReviews = JSON.parse(localStorage.getItem('reviews') || '{}');

  ratingCards.forEach((card, idx) => {
    const ratingDiv = card.querySelector('.rating');
    if (!ratingDiv) {
      // Skip cards that do not have a rating section
      return;
    }
    const stars     = ratingDiv.querySelectorAll('.star');
    // 初期状態を復元
    const saved = storedRatings[idx] || 0;
    ratingDiv.dataset.rating = saved;
    stars.forEach(star => {
      if (Number(star.dataset.value) <= saved) star.classList.add('filled');
      star.addEventListener('click', e => {
        const val = Number(e.target.dataset.value);
        storedRatings[idx] = val;
        localStorage.setItem('ratings', JSON.stringify(storedRatings));
        stars.forEach(s => s.classList.toggle('filled', Number(s.dataset.value) <= val));
      });
    });

    // レビューの復元・保存
    const reviewText = card.querySelector('.review-text');
    const reviewBtn  = card.querySelector('.review-submit');
    if (reviewText && reviewBtn) {
      reviewText.value = storedReviews[idx] || '';
      reviewBtn.addEventListener('click', () => {
        storedReviews[idx] = reviewText.value.trim();
        localStorage.setItem('reviews', JSON.stringify(storedReviews));
        alert('レビューを保存しました');
      });
    }
  });

  // 読書進捗トラッカー機能
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
  document.querySelectorAll('.book-card').forEach((card, idx) => {
    const canvas = card.querySelector('.progress-canvas');
    const decBtn = card.querySelector('.progress-decrement');
    const incBtn = card.querySelector('.progress-increment');
    if (!canvas || !decBtn || !incBtn) return;
    const ctx = canvas.getContext('2d');
    let progress = Number(card.dataset.progress) || 0;
    const radius = canvas.width / 2 - 5;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    function drawProgress(pct) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 背景円
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 5;
      ctx.stroke();
      // 進捗円
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * pct / 100));
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 5;
      ctx.stroke();
      // 中央に進捗度の数字を表示
      ctx.fillStyle = secondaryColor;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pct + '%', cx, cy);
    }

    // 初期描画
    drawProgress(progress);

    // データ属性に保存
    card.dataset.progress = progress;

    decBtn.addEventListener('click', () => {
      progress = Math.max(0, progress - 10);
      drawProgress(progress);
      card.dataset.progress = progress;
      localStorage.setItem('progress', JSON.stringify(
        Object.assign(
          JSON.parse(localStorage.getItem('progress') || '{}'),
          { [idx]: progress }
        )
      ));
    });

    incBtn.addEventListener('click', () => {
      progress = Math.min(100, progress + 10);
      drawProgress(progress);
      card.dataset.progress = progress;
      localStorage.setItem('progress', JSON.stringify(
        Object.assign(
          JSON.parse(localStorage.getItem('progress') || '{}'),
          { [idx]: progress }
        )
      ));
    });

    // ローカル保存から復元
    const stored = JSON.parse(localStorage.getItem('progress') || '{}');
    if (stored[idx] != null) {
      progress = stored[idx];
      drawProgress(progress);
      card.dataset.progress = progress;
    }
  });
});