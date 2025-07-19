// 進捗管理機能
document.addEventListener('DOMContentLoaded', () => {
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
