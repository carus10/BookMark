// animations.js - Animasyonları etkinleştirmek için JavaScript dosyası
// BookMark - Zihin Hızlandırıcı Okuma Platformu - Modern Deneysel Tasarım

document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yükleme animasyonları
    initPageLoadAnimations();
    
    // Kaydırma animasyonları
    initScrollAnimations();
    
    // 3D dönüşüm efektleri
    init3DEffects();
    
    // İmleç efektleri
    initCursorEffects();
    
    // Okuma animasyonları
    initReaderAnimations();
});

// Sayfa yükleme animasyonları
function initPageLoadAnimations() {
    // Hero bölümü animasyonu
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('gradient-animation');
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('stagger-fade-in');
        }
    }
    
    // Özellikler bölümü animasyonu
    const features = document.querySelector('.features-grid');
    if (features) {
        features.classList.add('stagger-fade-in');
        
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('tilt-effect');
            card.style.animationDelay = `${0.1 * index}s`;
        });
    }
    
    // İstatistik kartları animasyonu
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.classList.add('float-shadow');
        card.style.animationDelay = `${0.2 * index}s`;
    });
    
    // Kitap kartları animasyonu
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.classList.add('tilt-effect');
        card.style.animationDelay = `${0.1 * index}s`;
    });
    
    // Logo animasyonu
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.classList.add('neon-text-animation');
    }
    
    // Sayfa başlığı animasyonu
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.classList.add('gradient-animation');
    }
    
    // Hızlı erişim bağlantıları animasyonu
    const quickAccessLinks = document.querySelectorAll('.quick-access-link');
    quickAccessLinks.forEach((link, index) => {
        link.classList.add('pulse-animation');
        link.style.animationDelay = `${0.2 * index}s`;
    });
}

// Kaydırma animasyonları
function initScrollAnimations() {
    // Kaydırma ile görünür olan elementler
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // İlk yükleme kontrolü
    handleScrollAnimation();
    
    // Kaydırma olayı dinleyicisi
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Sayfa bölümlerine scroll-reveal sınıfı ekle
    document.querySelectorAll('.section').forEach(section => {
        if (!section.classList.contains('scroll-reveal')) {
            section.classList.add('scroll-reveal');
        }
    });
}

// 3D dönüşüm efektleri
function init3DEffects() {
    // 3D dönüşüm efekti için fare hareketi izleme
    const cards = document.querySelectorAll('.feature-card, .book-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Butonlar için 3D efekt
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// İmleç efektleri
function initCursorEffects() {
    // İmleç parlaması efekti
    const cursorElements = document.querySelectorAll('.cursor-glow');
    
    cursorElements.forEach(element => {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            element.style.setProperty('--x', `${x}%`);
            element.style.setProperty('--y', `${y}%`);
        });
    });
    
    // Tüm butonlara cursor-glow sınıfı ekle
    document.querySelectorAll('.btn').forEach(button => {
        if (!button.classList.contains('cursor-glow')) {
            button.classList.add('cursor-glow');
        }
    });
}

// Okuma animasyonları
function initReaderAnimations() {
    // Okuma ekranındaki kelime animasyonları
    const readerDisplay = document.getElementById('reader-display');
    const currentWord = document.getElementById('current-word');
    
    if (readerDisplay && currentWord) {
        // ORP vurgusu için animasyon
        const orpElements = document.querySelectorAll('.orp');
        orpElements.forEach(element => {
            element.classList.add('orp-pulse');
        });
        
        // Mod seçimi değiştiğinde animasyon stilini güncelle
        const modeSelect = document.getElementById('mode-select');
        if (modeSelect) {
            modeSelect.addEventListener('change', function() {
                const mode = parseInt(this.value);
                
                if (mode === 1) {
                    // Mod 1 için fade-in-scale animasyonu
                    currentWord.classList.remove('word-slide-in');
                    currentWord.classList.add('word-fade-in-scale');
                } else if (mode === 2) {
                    // Mod 2 için slide-in animasyonu
                    currentWord.classList.remove('word-fade-in-scale');
                    currentWord.classList.add('word-slide-in');
                }
            });
        }
    }
}

// Sayfa geçiş animasyonları
function initPageTransitions() {
    // Tüm sayfayı page-transition sınıfıyla sar
    const main = document.querySelector('main');
    if (main && !main.classList.contains('page-transition')) {
        main.classList.add('page-transition');
    }
    
    // Bağlantılara tıklandığında sayfa geçiş animasyonu
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname || link.hostname === '') {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Aynı sayfadaki bağlantıları atla
                if (href.startsWith('#')) return;
                
                e.preventDefault();
                
                // Çıkış animasyonu
                document.body.classList.add('page-exit');
                
                // Animasyon tamamlandıktan sonra yönlendir
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        }
    });
}

// Sayfa yüklendiğinde giriş animasyonu
window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
});
