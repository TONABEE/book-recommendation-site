// モーダル機能
document.addEventListener('DOMContentLoaded', () => {
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
});
