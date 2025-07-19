// レビュー・評価機能
document.addEventListener('DOMContentLoaded', () => {
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
});
