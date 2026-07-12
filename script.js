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
});
