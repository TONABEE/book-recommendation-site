// 検索・フィルター機能
document.addEventListener('DOMContentLoaded', () => {
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
});
