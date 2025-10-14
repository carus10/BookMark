// storage.js - Storage functionality for BookMark platform

// BookStorage - Kitap verilerini yönetmek için kullanılan modül
const BookStorage = {
    // Tüm kitapları getir
    getAllBooks: function() {
        try {
            const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            return books;
        } catch (error) {
            console.error('Kitaplar yüklenirken hata oluştu:', error);
            return [];
        }
    },
    
    // ID'ye göre kitap getir
    getBookById: function(id) {
        try {
            const books = this.getAllBooks();
            return books.find(book => book.id === id) || null;
        } catch (error) {
            console.error('Kitap bulunamadı:', error);
            return null;
        }
    },
    
    // Yeni kitap ekle
    addBook: function(bookData) {
        try {
            const books = this.getAllBooks();
            
            // Yeni kitap için ID oluştur
            const id = 'book_' + Date.now();
            
            // Kitap nesnesini oluştur
            const book = {
                id: id,
                title: bookData.title || 'Adsız Kitap',
                content: bookData.content || [],
                words: bookData.words || [],
                fileType: bookData.fileType || 'txt',
                fileSize: bookData.fileSize || 0,
                wordCount: bookData.wordCount || (bookData.content ? bookData.content.length : 0),
                uploadDate: new Date().toISOString(),
                lastRead: null,
                progress: 0,
                bookmark: 0,
                processedAt: bookData.processedAt || new Date().toISOString()
            };
            
            // Kitabı listeye ekle
            books.push(book);
            
            // Listeyi kaydet
            localStorage.setItem('bookmark_books', JSON.stringify(books));
            
            return book;
        } catch (error) {
            console.error('Kitap eklenirken hata oluştu:', error);
            return null;
        }
    },
    
    // Kitabı güncelle
    updateBook: function(id, updates) {
        try {
            const books = this.getAllBooks();
            const index = books.findIndex(book => book.id === id);
            
            if (index !== -1) {
                // Kitabı güncelle
                books[index] = { ...books[index], ...updates };
                
                // Listeyi kaydet
                localStorage.setItem('bookmark_books', JSON.stringify(books));
                
                return books[index];
            }
            
            return null;
        } catch (error) {
            console.error('Kitap güncellenirken hata oluştu:', error);
            return null;
        }
    },
    
    // Kitabı sil
    deleteBook: function(id) {
        try {
            const books = this.getAllBooks();
            const filteredBooks = books.filter(book => book.id !== id);
            
            // Eğer kitap bulunduysa ve silindiyse
            if (books.length !== filteredBooks.length) {
                // Listeyi kaydet
                localStorage.setItem('bookmark_books', JSON.stringify(filteredBooks));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Kitap silinirken hata oluştu:', error);
            return false;
        }
    },
    
    // Son okunan kitabı getir
    getLastReadBook: function() {
        try {
            const books = this.getAllBooks();
            
            // lastRead değeri olan kitapları filtrele
            const readBooks = books.filter(book => book.lastRead);
            
            // lastRead değerine göre sırala (en son okunan en üstte)
            readBooks.sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead));
            
            return readBooks.length > 0 ? readBooks[0] : null;
        } catch (error) {
            console.error('Son okunan kitap bulunamadı:', error);
            return null;
        }
    },
    
    // Kitap istatistiklerini getir
    getBookStats: function() {
        try {
            const books = this.getAllBooks();
            
            // Toplam kitap sayısı
            const totalBooks = books.length;
            
            // Toplam kelime sayısı
            const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
            
            // Tamamlanan kitap sayısı (ilerleme %100 olanlar)
            const completedBooks = books.filter(book => book.progress >= 100).length;
            
            // Ortalama ilerleme
            const averageProgress = totalBooks > 0 
                ? books.reduce((sum, book) => sum + (book.progress || 0), 0) / totalBooks 
                : 0;
            
            // Dosya türlerine göre dağılım
            const fileTypes = {};
            books.forEach(book => {
                const type = book.fileType || 'unknown';
                fileTypes[type] = (fileTypes[type] || 0) + 1;
            });
            
            return {
                totalBooks,
                totalWords,
                completedBooks,
                averageProgress,
                fileTypes
            };
        } catch (error) {
            console.error('Kitap istatistikleri hesaplanırken hata oluştu:', error);
            return {
                totalBooks: 0,
                totalWords: 0,
                completedBooks: 0,
                averageProgress: 0,
                fileTypes: {}
            };
        }
    },
    
    // Kitaplığı temizle (tüm kitapları sil)
    clearLibrary: function() {
        try {
            localStorage.removeItem('bookmark_books');
            return true;
        } catch (error) {
            console.error('Kitaplık temizlenirken hata oluştu:', error);
            return false;
        }
    },
    
    // Kitap verilerini dışa aktar
    exportLibrary: function() {
        try {
            const books = this.getAllBooks();
            return JSON.stringify(books);
        } catch (error) {
            console.error('Kitaplık dışa aktarılırken hata oluştu:', error);
            return null;
        }
    },
    
    // Kitap verilerini içe aktar
    importLibrary: function(data) {
        try {
            const books = JSON.parse(data);
            
            if (!Array.isArray(books)) {
                throw new Error('Geçersiz kitaplık verisi');
            }
            
            localStorage.setItem('bookmark_books', data);
            return true;
        } catch (error) {
            console.error('Kitaplık içe aktarılırken hata oluştu:', error);
            return false;
        }
    }
};

// SettingsStorage - Kullanıcı ayarlarını yönetmek için kullanılan modül
const SettingsStorage = {
    // Varsayılan ayarlar
    defaultSettings: {
        defaultSpeed: 300,
        defaultMode: 1,
        wordsPerView: 1,
        orpColor: '#c25b56',
        theme: 'dark',
        fontSize: 'medium',
        autoStart: false
    },
    
    // Tüm ayarları getir
    getAllSettings: function() {
        try {
            const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
            return { ...this.defaultSettings, ...settings };
        } catch (error) {
            console.error('Ayarlar yüklenirken hata oluştu:', error);
            return { ...this.defaultSettings };
        }
    },
    
    // Belirli bir ayarı getir
    getSetting: function(key) {
        const settings = this.getAllSettings();
        return settings[key];
    },
    
    // Ayarları güncelle
    updateSettings: function(updates) {
        try {
            const settings = this.getAllSettings();
            const updatedSettings = { ...settings, ...updates };
            
            localStorage.setItem('bookmarkSettings', JSON.stringify(updatedSettings));
            return true;
        } catch (error) {
            console.error('Ayarlar güncellenirken hata oluştu:', error);
            return false;
        }
    },
    
    // Ayarları sıfırla
    resetSettings: function() {
        try {
            localStorage.setItem('bookmarkSettings', JSON.stringify(this.defaultSettings));
            return true;
        } catch (error) {
            console.error('Ayarlar sıfırlanırken hata oluştu:', error);
            return false;
        }
    }
};

// StatsStorage - Okuma istatistiklerini yönetmek için kullanılan modül
const StatsStorage = {
    // Tüm istatistikleri getir
    getAllStats: function() {
        try {
            const stats = JSON.parse(localStorage.getItem('bookmarkStats') || '{}');
            return stats;
        } catch (error) {
            console.error('İstatistikler yüklenirken hata oluştu:', error);
            return {};
        }
    },
    
    // Günlük istatistikleri getir
    getDailyStats: function(date) {
        const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const stats = this.getAllStats();
        
        return stats[dateStr] || {
            wordsRead: 0,
            timeSpent: 0,
            booksRead: 0,
            sessions: 0
        };
    },
    
    // İstatistikleri güncelle
    updateStats: function(updates) {
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const stats = this.getAllStats();
            
            // Günün istatistiklerini al veya oluştur
            const dailyStats = stats[dateStr] || {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0
            };
            
            // İstatistikleri güncelle
            const updatedDailyStats = { ...dailyStats, ...updates };
            
            // Toplam değerleri güncelle
            if (updates.wordsRead) {
                updatedDailyStats.wordsRead = (dailyStats.wordsRead || 0) + updates.wordsRead;
            }
            
            if (updates.timeSpent) {
                updatedDailyStats.timeSpent = (dailyStats.timeSpent || 0) + updates.timeSpent;
            }
            
            if (updates.booksRead) {
                updatedDailyStats.booksRead = (dailyStats.booksRead || 0) + updates.booksRead;
            }
            
            if (updates.sessions) {
                updatedDailyStats.sessions = (dailyStats.sessions || 0) + updates.sessions;
            }
            
            // İstatistikleri kaydet
            stats[dateStr] = updatedDailyStats;
            localStorage.setItem('bookmarkStats', JSON.stringify(stats));
            
            return true;
        } catch (error) {
            console.error('İstatistikler güncellenirken hata oluştu:', error);
            return false;
        }
    },
    
    // İstatistikleri sıfırla
    resetStats: function() {
        try {
            localStorage.removeItem('bookmarkStats');
            return true;
        } catch (error) {
            console.error('İstatistikler sıfırlanırken hata oluştu:', error);
            return false;
        }
    },
    
    // Haftalık istatistikleri getir
    getWeeklyStats: function() {
        try {
            const stats = this.getAllStats();
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            
            const weeklyStats = {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0,
                dailyBreakdown: {}
            };
            
            // Son 7 günün istatistiklerini topla
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                
                const dailyStats = stats[dateStr] || {
                    wordsRead: 0,
                    timeSpent: 0,
                    booksRead: 0,
                    sessions: 0
                };
                
                weeklyStats.wordsRead += dailyStats.wordsRead || 0;
                weeklyStats.timeSpent += dailyStats.timeSpent || 0;
                weeklyStats.booksRead += dailyStats.booksRead || 0;
                weeklyStats.sessions += dailyStats.sessions || 0;
                
                weeklyStats.dailyBreakdown[dateStr] = dailyStats;
            }
            
            return weeklyStats;
        } catch (error) {
            console.error('Haftalık istatistikler hesaplanırken hata oluştu:', error);
            return {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0,
                dailyBreakdown: {}
            };
        }
    },
    
    // Aylık istatistikleri getir
    getMonthlyStats: function() {
        try {
            const stats = this.getAllStats();
            const today = new Date();
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const monthlyStats = {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0,
                dailyBreakdown: {}
            };
            
            // Ayın tüm günlerinin istatistiklerini topla
            for (let i = 0; i < monthEnd.getDate(); i++) {
                const date = new Date(monthStart);
                date.setDate(monthStart.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                
                const dailyStats = stats[dateStr] || {
                    wordsRead: 0,
                    timeSpent: 0,
                    booksRead: 0,
                    sessions: 0
                };
                
                monthlyStats.wordsRead += dailyStats.wordsRead || 0;
                monthlyStats.timeSpent += dailyStats.timeSpent || 0;
                monthlyStats.booksRead += dailyStats.booksRead || 0;
                monthlyStats.sessions += dailyStats.sessions || 0;
                
                monthlyStats.dailyBreakdown[dateStr] = dailyStats;
            }
            
            return monthlyStats;
        } catch (error) {
            console.error('Aylık istatistikler hesaplanırken hata oluştu:', error);
            return {
                wordsRead: 0,
                timeSpent: 0,
                booksRead: 0,
                sessions: 0,
                dailyBreakdown: {}
            };
        }
    }
};

// Modülleri dışa aktar
window.BookStorage = BookStorage;
window.SettingsStorage = SettingsStorage;
window.StatsStorage = StatsStorage;
