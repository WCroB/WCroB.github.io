document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.jobelement-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.closest('.jobelement-container').querySelector('.jobelement-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    document.querySelectorAll('.jobelement-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    const repeatCount = 10;
    document.querySelectorAll('.jobelement-modal-top span').forEach(span => {
        const text = span.textContent;
        span.textContent = Array(repeatCount).fill(text).join(' // ');
    });

    document.querySelectorAll('.jobelement-modal-bottom span').forEach(span => {
        const text = span.textContent;
        span.textContent = Array(repeatCount).fill(text).join(' // ');
    });
});
