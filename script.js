// Perlin Noise implementation
class PerlinNoise {
    constructor() {
        this.p = [];
        this.size = 256;
        this.init();
    }
    
    init() {
        this.p = [];
        for (let i = 0; i < this.size * 2; i++) {
            this.p[i] = Math.floor(Math.random() * this.size);
        }
    }
    
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : (h === 12 || h === 14 ? x : 0);
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    noise2(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        
        x -= Math.floor(x);
        y -= Math.floor(y);
        
        const u = this.fade(x);
        const v = this.fade(y);
        
        const a = this.p[X] + Y;
        const aa = this.p[a];
        const ab = this.p[a + 1];
        const b = this.p[X + 1] + Y;
        const ba = this.p[b];
        const bb = this.p[b + 1];
        
        return this.lerp(v, 
            this.lerp(u, this.grad(this.p[aa], x, y), this.grad(this.p[ba], x - 1, y)),
            this.lerp(u, this.grad(this.p[ab], x, y - 1), this.grad(this.p[bb], x - 1, y - 1))
        );
    }
}

// Global Perlin instance
const perlin = new PerlinNoise();

document.addEventListener('DOMContentLoaded', function() {
    // Animation state
    let animationFrameId = null;
    let lastTime = 0;
    
    function animateBlocks(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        lastTime = timestamp;
        
        const currentModalMain = document.querySelector('#current .jobelement-modal-main');
        if (currentModalMain) {
            fillModalMainWithBlocks(timestamp / 1000);
        }
        
        animationFrameId = requestAnimationFrame(animateBlocks);
    }
    
    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            lastTime = 0;
        }
    }

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

    // Fill current job modal-main with Perlin noise block characters
    function fillModalMainWithBlocks(time = 0) {
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
        
        // Perlin noise parameters - larger scale, faster X for wavy motion
        const scale = 0.12;
        const speedX = 0.6;
        const speedY = 0.15;
        
        // Map noise value to block character
        function noiseToChar(n) {
            const blockChars = ['░', '▒', '▓', '█'];
            // Normalize from [-1,1] to [0,1] and map to character
            const normalized = (n + 1) / 2;
            const idx = Math.floor(normalized * blockChars.length);
            return blockChars[Math.min(Math.max(idx, 0), blockChars.length - 1)];
        }
        
        let content = '';
        for (let i = 0; i < rows; i++) {
            let row = '';
            for (let j = 0; j < cols; j++) {
                const nx = j * scale + time * speedX;
                const ny = i * scale + time * speedY;
                const noiseVal = perlin.noise2(nx, ny);
                row += noiseToChar(noiseVal);
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
    
    // Start animation when modal is opened
    document.querySelectorAll('.jobelement-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const modal = this.closest('.jobelement-container').querySelector('.jobelement-modal');
            if (modal) {
                // Start animation
                stopAnimation();
                setTimeout(() => {
                    lastTime = 0;
                    animateBlocks(0);
                }, 100);
            }
        });
    });
    
    // Stop animation when modal is closed
    document.querySelectorAll('.jobelement-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                stopAnimation();
            }
        });
    });
    
    // Handle window resize - restart animation to recalculate
    window.addEventListener('resize', () => {
        if (animationFrameId) {
            fillModalMainWithBlocks(performance.now() / 1000);
        }
    });
});
