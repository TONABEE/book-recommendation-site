// ランキング機能
document.addEventListener('DOMContentLoaded', () => {
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
});
