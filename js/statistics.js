// statistics.js - İstatistik takip ve görselleştirme modülü
// BookMark - Zihin Hızlandırıcı Okuma Platformu

// İstatistik işlevleri
const Statistics = {
    // Sayfa yüklendiğinde çalışacak başlatma fonksiyonu
    init: function() {
        console.log('Statistics modülü başlatılıyor...');
        
        // İstatistik özetini yükle
        this.loadStatsSummary();
        
        // Grafikleri yükle
        this.loadCharts();
        
        // Detaylı istatistik tablosunu yükle
        this.loadStatsTable();
        
        console.log('Statistics modülü başlatıldı.');
    },
    
    // İstatistik özetini yükle
    loadStatsSummary: function() {
        console.log('İstatistik özeti yükleniyor...');
        
        // Özet kartlarını al
        const todayWordsElement = document.getElementById('today-words');
        const totalWordsElement = document.getElementById('total-words');
        const avgSpeedElement = document.getElementById('avg-speed');
        const completedBooksElement = document.getElementById('completed-books');
        
        if (!todayWordsElement || !totalWordsElement || !avgSpeedElement || !completedBooksElement) {
            console.error('İstatistik özet elementleri bulunamadı');
            return;
        }
        
        // İstatistik özetini al
        const summary = this.getSummaryStats();
        
        // Değerleri güncelle
        todayWordsElement.textContent = summary.todayWords.toLocaleString('tr-TR');
        totalWordsElement.textContent = summary.totalWords.toLocaleString('tr-TR');
        avgSpeedElement.textContent = summary.avgSpeed;
        completedBooksElement.textContent = summary.completedBooks;
        
        // Günlük hedef takibi
        this.updateGoalCompletion(summary.todayWords);
        
        console.log('İstatistik özeti yüklendi:', summary);
    },
    
    // İstatistik özeti hesapla
    getSummaryStats: function() {
        console.log('İstatistik özeti hesaplanıyor...');
        
        try {
            // Kitap istatistiklerini al
            const bookStats = BookStorage.getBookStats();
            
            // Günlük istatistikleri al
            const today = new Date().toISOString().split('T')[0];
            const dailyStats = this.getDailyStats(today);
            
            // Okuma oturumlarını al
            const sessions = this.getReadingSessions();
            
            // Bugün okunan kelime sayısı
            const todayWords = dailyStats.wordsRead || 0;
            
            // Toplam okunan kelime sayısı
            const totalWords = sessions.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
            
            // Ortalama okuma hızı
            let avgSpeed = 0;
            const speedSessions = sessions.filter(session => session.readingSpeed > 0);
            
            if (speedSessions.length > 0) {
                const totalSpeed = speedSessions.reduce((sum, session) => sum + session.readingSpeed, 0);
                avgSpeed = Math.round(totalSpeed / speedSessions.length);
            }
            
            // Tamamlanan kitap sayısı
            const completedBooks = bookStats.completedBooks || 0;
            
            return {
                todayWords,
                totalWords,
                avgSpeed,
                completedBooks
            };
        } catch (error) {
            console.error('İstatistik özeti hesaplanırken hata oluştu:', error);
            return {
                todayWords: 0,
                totalWords: 0,
                avgSpeed: 0,
                completedBooks: 0
            };
        }
    },
    
    // Günlük istatistikleri al
    getDailyStats: function(dateStr) {
        const date = dateStr || new Date().toISOString().split('T')[0];
        
        try {
            // Okuma oturumlarını al
            const sessions = this.getReadingSessions();
            
            // Belirli tarihteki oturumları filtrele
            const dailySessions = sessions.filter(session => session.date === date);
            
            // İstatistikleri hesapla
            const wordsRead = dailySessions.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
            const timeSpent = dailySessions.reduce((sum, session) => sum + (session.readingTime || 0), 0);
            const booksRead = new Set(dailySessions.map(session => session.bookId)).size;
            
            return {
                wordsRead,
                timeSpent,
                booksRead,
                sessions: dailySessions.length
            };
        } catch (error) {
            console.error('Günlük istatistikler hesaplanırken hata oluştu:', error);
            return {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0
            };
        }
    },
    
    // Okuma oturumlarını al
    getReadingSessions: function() {
        try {
            return JSON.parse(localStorage.getItem('bookmark_reading_sessions') || '[]');
        } catch (error) {
            console.error('Okuma oturumları yüklenirken hata oluştu:', error);
            return [];
        }
    },
    
    // Günlük hedef tamamlama durumunu güncelle
    updateGoalCompletion: function(todayWords) {
        const settings = SettingsStorage.getAllSettings();
        const dailyGoal = settings.dailyGoal || 1000; // Varsayılan 1000 kelime
        
        // Hedef tamamlama yüzdesini hesapla
        const goalPercentage = Math.min(Math.round((todayWords / dailyGoal) * 100), 100);
        
        // Hedef tamamlama bölümünü oluştur
        const chartsContainer = document.querySelector('.stats-charts .container');
        if (!chartsContainer) return;
        
        // Mevcut hedef bölümünü kontrol et
        let goalElement = document.querySelector('.goal-completion');
        if (!goalElement) {
            // Hedef bölümünü oluştur
            goalElement = document.createElement('div');
            goalElement.className = 'goal-completion';
            goalElement.innerHTML = `
                <div class="goal-icon">📚</div>
                <div class="goal-info">
                    <h4>Günlük Okuma Hedefi</h4>
                    <p><span id="goal-progress-text">${todayWords}</span> / ${dailyGoal} kelime</p>
                    <div class="goal-progress">
                        <div class="fill" style="width: ${goalPercentage}%"></div>
                    </div>
                </div>
            `;
            
            // Hedef bölümünü ekle
            chartsContainer.insertBefore(goalElement, chartsContainer.firstChild);
        } else {
            // Mevcut hedef bölümünü güncelle
            const progressText = goalElement.querySelector('#goal-progress-text');
            const progressBar = goalElement.querySelector('.goal-progress .fill');
            
            if (progressText) progressText.textContent = todayWords;
            if (progressBar) progressBar.style.width = `${goalPercentage}%`;
        }
        
        console.log('Günlük hedef güncellendi:', todayWords, '/', dailyGoal, '(', goalPercentage, '%)');
    },
    
    // Grafikleri yükle
    loadCharts: function() {
        console.log('Grafikler yükleniyor...');
        
        // Grafik konteynerlerini al
        const dailyPerformanceChart = document.getElementById('daily-performance-chart');
        const speedProgressChart = document.getElementById('speed-progress-chart');
        const bookProgressChart = document.getElementById('book-progress-chart');
        
        if (!dailyPerformanceChart || !speedProgressChart || !bookProgressChart) {
            console.error('Grafik konteynerleri bulunamadı');
            return;
        }
        
        // Grafik verilerini al
        const dailyPerformance = this.getDailyPerformance();
        const speedProgress = this.getSpeedProgress();
        const bookProgress = this.getBookProgress();
        
        // Grafikleri oluştur
        this.createDailyPerformanceChart(dailyPerformanceChart, dailyPerformance);
        this.createSpeedProgressChart(speedProgressChart, speedProgress);
        this.createBookProgressChart(bookProgressChart, bookProgress);
        
        console.log('Grafikler yüklendi');
    },
    
    // Günlük performans verilerini al
    getDailyPerformance: function() {
        try {
            // Son 7 günün tarihlerini oluştur
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            
            // Her gün için istatistikleri al
            return dates.map(date => {
                const stats = this.getDailyStats(date);
                return {
                    date,
                    wordsRead: stats.wordsRead
                };
            });
        } catch (error) {
            console.error('Günlük performans verileri hesaplanırken hata oluştu:', error);
            return [];
        }
    },
    
    // Okuma hızı gelişim verilerini al
    getSpeedProgress: function() {
        try {
            // Okuma oturumlarını al
            const sessions = this.getReadingSessions();
            
            // Tarihe göre sırala
            sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Son 10 oturumu al
            const recentSessions = sessions.slice(-10);
            
            // Her oturum için okuma hızını al
            return recentSessions.map(session => ({
                date: session.date,
                speed: session.readingSpeed
            }));
        } catch (error) {
            console.error('Okuma hızı gelişim verileri hesaplanırken hata oluştu:', error);
            return [];
        }
    },
    
    // Kitap ilerleme verilerini al
    getBookProgress: function() {
        try {
            // Tüm kitapları al
            const books = BookStorage.getAllBooks();
            
            // Son okunan 5 kitabı al
            const recentBooks = books
                .filter(book => book.lastRead)
                .sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))
                .slice(0, 5);
            
            // Her kitap için ilerleme bilgisini al
            return recentBooks.map(book => ({
                title: book.title,
                progress: Math.min(Math.round((book.progress / book.wordCount) * 100), 100) || 0
            }));
        } catch (error) {
            console.error('Kitap ilerleme verileri hesaplanırken hata oluştu:', error);
            return [];
        }
    },
    
    // Günlük okuma performansı grafiğini oluştur
    createDailyPerformanceChart: function(container, data) {
        // Veri kontrolü
        if (!data || data.length === 0 || data.every(item => item.wordsRead === 0)) {
            container.innerHTML = '<div class="chart-placeholder"><p>Henüz yeterli veri bulunmuyor.</p></div>';
            return;
        }
        
        // Grafik HTML'ini oluştur
        let chartHTML = '<div class="chart-content">';
        
        // Maksimum değeri bul
        const maxValue = Math.max(...data.map(item => item.wordsRead));
        const chartHeight = 250; // piksel cinsinden
        
        // Her gün için çubuk oluştur
        data.forEach(item => {
            const barHeight = item.wordsRead > 0 ? (item.wordsRead / maxValue) * chartHeight : 0;
            const date = new Date(item.date);
            const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
            
            chartHTML += `
                <div class="chart-bar">
                    <div class="bar-value">${item.wordsRead}</div>
                    <div class="bar" style="height: ${barHeight}px"></div>
                    <div class="bar-label">${dayName}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        
        // Grafik açıklamasını ekle
        chartHTML += `
            <div class="chart-legend">
                <p>Son 7 günde okunan kelime sayısı</p>
            </div>
        `;
        
        // HTML'i ekle
        container.innerHTML = chartHTML;
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .chart-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                height: ${chartHeight}px;
                padding-bottom: 30px;
                position: relative;
            }
            
            .chart-bar {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 12%;
            }
            
            .bar-value {
                margin-bottom: 5px;
                font-size: 0.8rem;
            }
            
            .bar {
                width: 100%;
                background-color: var(--secondary-color);
                border-radius: 3px 3px 0 0;
                transition: height 0.5s ease;
            }
            
            .bar-label {
                margin-top: 5px;
                font-size: 0.8rem;
            }
            
            .chart-legend {
                text-align: center;
                margin-top: 10px;
                font-size: 0.9rem;
                color: var(--dark-text);
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Okuma hızı gelişimi grafiğini oluştur
    createSpeedProgressChart: function(container, data) {
        // Veri kontrolü
        if (!data || data.length < 2) {
            container.innerHTML = '<div class="chart-placeholder"><p>Henüz yeterli veri bulunmuyor.</p></div>';
            return;
        }
        
        // Grafik HTML'ini oluştur
        let chartHTML = '<div class="chart-content line-chart">';
        
        // Değer aralığını belirle
        const speeds = data.map(item => item.speed);
        const minSpeed = Math.min(...speeds);
        const maxSpeed = Math.max(...speeds);
        const range = maxSpeed - minSpeed;
        const chartHeight = 250; // piksel cinsinden
        
        // Çizgi noktalarını oluştur
        let points = '';
        const width = 100 / (data.length - 1);
        
        data.forEach((item, index) => {
            // Normalize edilmiş yükseklik (ters çevrilmiş, çünkü düşük hız daha iyi)
            const normalizedHeight = 100 - ((item.speed - minSpeed) / (range || 1)) * 100;
            const x = index * width;
            
            points += `${x},${normalizedHeight} `;
            
            // Nokta ekle
            chartHTML += `
                <div class="chart-point" style="left: ${x}%; bottom: ${normalizedHeight}%;" title="${item.date}: ${item.speed} ms">
                    <span class="point-value">${item.speed}</span>
                </div>
            `;
        });
        
        // SVG çizgi ekle
        chartHTML += `
            <svg class="chart-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points="${points}" />
            </svg>
        `;
        
        chartHTML += '</div>';
        
        // Grafik açıklamasını ekle
        chartHTML += `
            <div class="chart-legend">
                <p>Okuma hızı gelişimi (ms/kelime, düşük değer daha hızlı)</p>
            </div>
        `;
        
        // HTML'i ekle
        container.innerHTML = chartHTML;
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .line-chart {
                position: relative;
                height: ${chartHeight}px;
                margin-bottom: 30px;
            }
            
            .chart-point {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: var(--secondary-color);
                border-radius: 50%;
                transform: translate(-50%, 50%);
            }
            
            .point-value {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.8rem;
                white-space: nowrap;
            }
            
            .chart-line {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .chart-line polyline {
                fill: none;
                stroke: var(--secondary-color);
                stroke-width: 2;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Kitap bazında ilerleme grafiğini oluştur
    createBookProgressChart: function(container, data) {
        // Veri kontrolü
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="chart-placeholder"><p>Henüz yeterli veri bulunmuyor.</p></div>';
            return;
        }
        
        // Grafik HTML'ini oluştur
        let chartHTML = '<div class="chart-content">';
        
        // Her kitap için ilerleme çubuğu oluştur
        data.forEach(book => {
            chartHTML += `
                <div class="book-progress-item">
                    <div class="book-title">${book.title}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${book.progress}%"></div>
                    </div>
                    <div class="progress-value">${book.progress}%</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        
        // HTML'i ekle
        container.innerHTML = chartHTML;
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .book-progress-item {
                margin-bottom: 15px;
            }
            
            .book-title {
                margin-bottom: 5px;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .progress-bar {
                height: 10px;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background-color: var(--secondary-color);
                border-radius: 5px;
                transition: width 0.5s ease;
            }
            
            .progress-value {
                text-align: right;
                font-size: 0.8rem;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Detaylı istatistik tablosunu yükle
    loadStatsTable: function() {
        console.log('İstatistik tablosu yükleniyor...');
        
        const tableBody = document.getElementById('stats-table-body');
        if (!tableBody) {
            console.error('İstatistik tablosu bulunamadı');
            return;
        }
        
        // Tüm istatistikleri al
        const sessions = this.getReadingSessions();
        
        // Veri kontrolü
        if (!sessions || sessions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty-table">Henüz okuma verisi bulunmuyor.</td></tr>';
            return;
        }
        
        // Tarihe göre sırala (en yeniden en eskiye)
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Tablo satırlarını oluştur
        let tableHTML = '';
        
        sessions.forEach(session => {
            const date = new Date(session.date);
            const formattedDate = date.toLocaleDateString('tr-TR');
            const readingTime = this.formatTime(session.readingTime || 0);
            
            tableHTML += `
                <tr>
                    <td>${formattedDate}</td>
                    <td>${session.bookTitle}</td>
                    <td>${session.wordsRead.toLocaleString('tr-TR')}</td>
                    <td>${session.readingSpeed}</td>
                    <td>${readingTime}</td>
                </tr>
            `;
        });
        
        // HTML'i ekle
        tableBody.innerHTML = tableHTML;
        
        console.log('İstatistik tablosu yüklendi:', sessions.length, 'oturum');
    },
    
    // Zamanı formatla (saniyeden dakika:saniye formatına)
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// Sayfa yüklendiğinde Statistics'i başlat
document.addEventListener('DOMContentLoaded', () => {
    // İstatistikler sayfasında olduğumuzu kontrol et
    if (window.location.pathname.includes('statistics.html')) {
        Statistics.init();
    }
});
