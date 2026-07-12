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

    // Fill current job modal-main with random block characters
    function fillModalMainWithBlocks() {
        const modalMain = document.querySelector('#current .jobelement-modal-main');
        if (!modalMain) return;
        
        // Ensure modal-main has relative positioning for absolute children
        modalMain.style.position = 'relative';
        modalMain.style.overflow = 'hidden';
        
        const pre = modalMain.querySelector('pre');
        if (!pre) return;
        
        // Get dimensions of modal-main
        const width = modalMain.clientWidth;
        const height = modalMain.clientHeight;
        
        // Get padding of modal-main to subtract
        const paddingLeft = parseInt(window.getComputedStyle(modalMain).paddingLeft) || 0;
        const paddingRight = parseInt(window.getComputedStyle(modalMain).paddingRight) || 0;
        const paddingTop = parseInt(window.getComputedStyle(modalMain).paddingTop) || 0;
        const paddingBottom = parseInt(window.getComputedStyle(modalMain).paddingBottom) || 0;
        
        const contentWidth = width - paddingLeft - paddingRight;
        const contentHeight = height - paddingTop - paddingBottom;
        
        // Get padding of pre element
        const prePaddingLeft = parseInt(window.getComputedStyle(pre).paddingLeft) || 0;
        const prePaddingRight = parseInt(window.getComputedStyle(pre).paddingRight) || 0;
        const prePaddingTop = parseInt(window.getComputedStyle(pre).paddingTop) || 0;
        const prePaddingBottom = parseInt(window.getComputedStyle(pre).paddingBottom) || 0;
        
        const preContentWidth = contentWidth - prePaddingLeft - prePaddingRight;
        const preContentHeight = contentHeight - prePaddingTop - prePaddingBottom;
        
        // Create test element to measure character dimensions
        const testSpan = document.createElement('span');
        testSpan.style.position = 'absolute';
        testSpan.style.visibility = 'hidden';
        testSpan.style.whiteSpace = 'pre';
        testSpan.style.fontFamily = 'monospace';
        testSpan.style.fontSize = window.getComputedStyle(pre).fontSize;
        testSpan.textContent = '█'.repeat(100);
        document.body.appendChild(testSpan);
        
        const testWidth = testSpan.clientWidth;
        const charWidth = testWidth / 100;
        
        // For line height, use the pre's line-height
        const lineHeight = parseInt(window.getComputedStyle(pre).lineHeight) || 
                          parseInt(window.getComputedStyle(pre).fontSize) * 1.2;
        
        document.body.removeChild(testSpan);
        
        // Calculate columns and rows
        const cols = Math.max(1, Math.floor(preContentWidth / charWidth));
        const rows = Math.max(1, Math.floor(preContentHeight / lineHeight));
        
        // Generate content with weighted block characters
        const blockChars = ['░', '▒', '▓', '█'];
        const weightedChars = [];
        for (let i = 0; i < 90; i++) {
            weightedChars.push(...blockChars);
        }
        for (let i = 0; i < 10; i++) {
            weightedChars.push(' ');
        }
        
        let content = '';
        for (let i = 0; i < rows; i++) {
            let row = '';
            for (let j = 0; j < cols; j++) {
                const randomChar = weightedChars[Math.floor(Math.random() * weightedChars.length)];
                row += randomChar;
            }
            content += row + '\n';
        }
        
        pre.textContent = content.trim();
        pre.style.color = 'red';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.textAlign = 'justify';
        pre.style.margin = '0';
        pre.style.padding = '0';
    }
    
    // Fill initially - but modal may not be visible, so try anyway
    fillModalMainWithBlocks();
    
    // Fill when modal is opened
    document.querySelectorAll('.jobelement-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const modal = this.closest('.jobelement-container').querySelector('.jobelement-modal');
            if (modal) {
                setTimeout(fillModalMainWithBlocks, 100);
            }
        });
    });
    
    // Handle window resize for responsiveness
    window.addEventListener('resize', fillModalMainWithBlocks);
});
