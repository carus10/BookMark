// Modified app.js to remove subscription restrictions
// app.js - Main application logic for BookMark platform

const app = {
    // App state
    books: [],
    stats: {
        totalWords: 0,
        dailyWords: 0,
        avgSpeed: 0,
        lastRead: null,
        dailyStats: {}
    },
    settings: {
        defaultSpeed: 300,
        defaultMode: 1,
        orpColor: '#c25b56',
        fontSize: 'medium',
        fontFamily: 'sans-serif',
        dailyGoal: 1000,
        wordsPerView: 1
    },
    subscription: null,
    
    // Initialization
    init: function() {
        console.log('BookMark application initialized');
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        
        // Initialize subscription system if available
        if (typeof SubscriptionSystem !== 'undefined') {
            this.subscription = SubscriptionSystem.getCurrentSubscription();
            this.updateSubscriptionUI();
        }
    },
    
    // Load data from localStorage
    loadData: function() {
        // Load books
        const savedBooks = localStorage.getItem('bookmarkBooks');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        }
        
        // Load stats
        const savedStats = localStorage.getItem('bookmarkStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
        
        // Load settings
        const savedSettings = localStorage.getItem('bookmarkSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
        
        // Check if we need to reset daily stats
        this.checkDailyReset();
    },
    
    // Save data to localStorage
    saveData: function() {
        localStorage.setItem('bookmarkBooks', JSON.stringify(this.books));
        localStorage.setItem('bookmarkStats', JSON.stringify(this.stats));
        localStorage.setItem('bookmarkSettings', JSON.stringify(this.settings));
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Setup based on current page
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'index') {
            // Home page
            
        } else if (currentPage === 'library') {
            // Library page
            const uploadArea = document.getElementById('upload-area');
            const fileInput = document.getElementById('file-input');
            
            if (uploadArea && fileInput) {
                uploadArea.addEventListener('click', () => {
                    // No subscription check - allow all uploads
                    fileInput.click();
                });
                
                uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadArea.classList.add('drag-over');
                });
                
                uploadArea.addEventListener('dragleave', () => {
                    uploadArea.classList.remove('drag-over');
                });
                
                uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadArea.classList.remove('drag-over');
                    
                    // No subscription check - allow all uploads
                    if (e.dataTransfer.files.length) {
                        fileInput.files = e.dataTransfer.files;
                        this.handleFileUpload(e.dataTransfer.files[0]);
                    }
                });
                
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length) {
                        this.handleFileUpload(e.target.files[0]);
                    }
                });
            }
            
            // Filter and sort controls
            const filterSelect = document.getElementById('filter-select');
            const sortSelect = document.getElementById('sort-select');
            
            if (filterSelect) {
                filterSelect.addEventListener('change', () => {
                    this.filterBooks(filterSelect.value);
                });
            }
            
            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    this.sortBooks(sortSelect.value);
                });
            }
            
        } else if (currentPage === 'settings') {
            // Settings page
            const settingsForm = document.querySelectorAll('.settings-group');
            const saveSettingsBtn = document.getElementById('save-settings');
            const resetSettingsBtn = document.getElementById('reset-settings');
            const exportDataBtn = document.getElementById('export-data');
            const importDataBtn = document.getElementById('import-data');
            const clearDataBtn = document.getElementById('clear-data');
            
            // Settings form elements
            const defaultSpeed = document.getElementById('default-speed');
            const speedValue = document.getElementById('speed-value');
            const defaultMode = document.getElementById('default-mode');
            const wordsPerViewSetting = document.getElementById('words-per-view-setting');
            const wordsPerViewValue = document.getElementById('words-per-view-value');
            const orpColor = document.getElementById('orp-color');
            const fontSize = document.getElementById('font-size');
            const fontFamily = document.getElementById('font-family');
            const dailyGoal = document.getElementById('daily-goal');
            
            // Update displayed values
            if (defaultSpeed && speedValue) {
                defaultSpeed.value = this.settings.defaultSpeed;
                speedValue.textContent = this.settings.defaultSpeed;
                
                defaultSpeed.addEventListener('input', () => {
                    speedValue.textContent = defaultSpeed.value;
                });
            }
            
            if (defaultMode) {
                defaultMode.value = this.settings.defaultMode;
            }
            
            if (wordsPerViewSetting && wordsPerViewValue) {
                wordsPerViewSetting.value = this.settings.wordsPerView || 1;
                wordsPerViewValue.textContent = this.settings.wordsPerView || 1;
                
                wordsPerViewSetting.addEventListener('input', () => {
                    wordsPerViewValue.textContent = wordsPerViewSetting.value;
                });
            }
            
            if (orpColor) {
                orpColor.value = this.settings.orpColor;
            }
            
            if (fontSize) {
                fontSize.value = this.settings.fontSize;
            }
            
            if (fontFamily) {
                fontFamily.value = this.settings.fontFamily;
            }
            
            if (dailyGoal) {
                dailyGoal.value = this.settings.dailyGoal;
            }
            
            // Save settings
            if (saveSettingsBtn) {
                saveSettingsBtn.addEventListener('click', () => {
                    this.settings.defaultSpeed = parseInt(defaultSpeed.value);
                    this.settings.defaultMode = parseInt(defaultMode.value);
                    this.settings.wordsPerView = parseInt(wordsPerViewSetting.value);
                    this.settings.orpColor = orpColor.value;
                    this.settings.fontSize = fontSize.value;
                    this.settings.fontFamily = fontFamily.value;
                    this.settings.dailyGoal = parseInt(dailyGoal.value);
                    
                    this.saveData();
                    alert('Settings saved successfully');
                });
            }
            
            // Reset settings
            if (resetSettingsBtn) {
                resetSettingsBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to reset all settings to default?')) {
                        this.settings = {
                            defaultSpeed: 300,
                            defaultMode: 1,
                            wordsPerView: 1,
                            orpColor: '#c25b56',
                            fontSize: 'medium',
                            fontFamily: 'sans-serif',
                            dailyGoal: 1000
                        };
                        
                        this.saveData();
                        location.reload();
                    }
                });
            }
            
            // Export data
            if (exportDataBtn) {
                exportDataBtn.addEventListener('click', () => {
                    this.exportData();
                });
            }
            
            // Import data
            if (importDataBtn) {
                importDataBtn.addEventListener('click', () => {
                    this.importData();
                });
            }
            
            // Clear data
            if (clearDataBtn) {
                clearDataBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                        this.clearAllData();
                    }
                });
            }
        } else if (currentPage === 'statistics') {
            // Statistics page
            this.updateStatisticsUI();
        } else if (currentPage === 'premium') {
            // Premium page
            const premiumBtn = document.getElementById('premium-subscribe-btn');
            if (premiumBtn) {
                premiumBtn.addEventListener('click', () => {
                    this.simulatePremiumPurchase();
                });
            }
        }
    },
    
    // Update UI based on current page
    updateUI: function() {
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'library') {
            this.updateLibraryUI();
        } else if (currentPage === 'statistics') {
            this.updateStatisticsUI();
        } else if (currentPage === 'premium') {
            this.updatePremiumUI();
        }
    },
    
    // Update subscription UI elements
    updateSubscriptionUI: function() {
        if (typeof SubscriptionSystem === 'undefined') return;
        
        const subscriptionDetails = SubscriptionSystem.getSubscriptionDetails();
        const isPremium = subscriptionDetails.isPremium;
        
        // Update UI elements based on subscription status
        const premiumBadges = document.querySelectorAll('.premium-badge');
        const premiumFeatures = document.querySelectorAll('.premium-feature');
        
        // Update premium badges
        premiumBadges.forEach(badge => {
            badge.style.display = isPremium ? 'inline-flex' : 'none';
        });
        
        // Update premium features
        premiumFeatures.forEach(feature => {
            // Remove premium-locked class from all features
            feature.classList.remove('premium-locked');
        });
    },
    
    // Simulate premium purchase (for demo purposes)
    simulatePremiumPurchase: function() {
        if (typeof SubscriptionSystem === 'undefined') return;
        
        // Show loading state
        const premiumBtn = document.getElementById('premium-subscribe-btn');
        if (premiumBtn) {
            premiumBtn.textContent = 'Processing...';
            premiumBtn.disabled = true;
        }
        
        // Simulate payment processing
        setTimeout(() => {
            // Upgrade to premium
            SubscriptionSystem.upgradeToPremium();
            
            // Show success message
            alert('Congratulations! You have successfully upgraded to Premium.');
            
            // Redirect to library
            window.location.href = 'library.html';
        }, 2000);
    },
    
    // Update premium page UI
    updatePremiumUI: function() {
        if (typeof SubscriptionSystem === 'undefined') return;
        
        const subscriptionDetails = SubscriptionSystem.getSubscriptionDetails();
        const isPremium = subscriptionDetails.isPremium;
        
        const premiumStatus = document.getElementById('premium-status');
        const premiumBtn = document.getElementById('premium-subscribe-btn');
        
        if (premiumStatus) {
            if (isPremium) {
                premiumStatus.innerHTML = `
                    <div class="premium-active">
                        <i class="fas fa-check-circle"></i>
                        <span>You are currently on the Premium plan</span>
                    </div>
                    <div class="premium-details">
                        <p>Subscription started: ${subscriptionDetails.startDate}</p>
                        <p>Expires on: ${subscriptionDetails.expiryDate}</p>
                        <p>Days remaining: ${subscriptionDetails.daysRemaining}</p>
                    </div>
                `;
            } else {
                premiumStatus.innerHTML = `
                    <div class="premium-inactive">
                        <i class="fas fa-info-circle"></i>
                        <span>You are currently on the Free plan</span>
                    </div>
                `;
            }
        }
        
        if (premiumBtn) {
            if (isPremium) {
                premiumBtn.textContent = 'Already Premium';
                premiumBtn.disabled = true;
            } else {
                premiumBtn.textContent = 'Upgrade to Premium - $5';
                premiumBtn.disabled = false;
            }
        }
    },
    
    // Get current page
    getCurrentPage: function() {
        const path = window.location.pathname;
        
        if (path.includes('library.html')) {
            return 'library';
        } else if (path.includes('reader.html')) {
            return 'reader';
        } else if (path.includes('statistics.html')) {
            return 'statistics';
        } else if (path.includes('settings.html')) {
            return 'settings';
        } else if (path.includes('premium.html')) {
            return 'premium';
        } else {
            return 'index';
        }
    },
    
    // Handle file upload
    handleFileUpload: function(file) {
        if (!file) return;
        
        // No subscription check - allow all uploads
        const fileType = file.name.split('.').pop().toLowerCase();
        
        if (fileType === 'txt') {
            this.processTxtFile(file);
        } else if (fileType === 'pdf') {
            this.processPdfFile(file);
        } else {
            alert('Unsupported file type. Please upload a TXT or PDF file.');
        }
    },
    
    // Process TXT file
    processTxtFile: function(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target.result;
            const words = this.processText(content);
            
            this.addBook({
                id: Date.now().toString(),
                title: file.name.replace('.txt', ''),
                type: 'txt',
                totalWords: words.length,
                content: words,
                dateAdded: new Date(),
                currentPosition: 0,
                completed: false
            });
        };
        
        reader.readAsText(file);
    },
    
    // Process PDF file (simplified - in a real app, would use PDF.js)
    processPdfFile: function(file) {
        alert('PDF processing would be implemented with PDF.js in a production environment.');
        
        // Simulate processing a PDF
        setTimeout(() => {
            const words = ['This', 'is', 'a', 'simulated', 'PDF', 'file', 'content', 'for', 'demonstration', 'purposes'];
            
            this.addBook({
                id: Date.now().toString(),
                title: file.name.replace('.pdf', ''),
                type: 'pdf',
                totalWords: words.length,
                content: words,
                dateAdded: new Date(),
                currentPosition: 0,
                completed: false
            });
        }, 1000);
    },
    
    // Process text into words
    processText: function(text) {
        // Remove extra whitespace and split by words
        return text
            .replace(/\s+/g, ' ')
            .trim()
            .split(/\s+/);
    },
    
    // Add a book to the library
    addBook: function(book) {
        // No subscription check - allow all uploads
        this.books.push(book);
        this.saveData();
        this.updateLibraryUI();
        this.updateSubscriptionUI();
    },
    
    // Update library UI
    updateLibraryUI: function() {
        const bookGrid = document.getElementById('book-grid');
        const emptyLibrary = document.getElementById('empty-library');
        
        if (!bookGrid) return;
        
        if (this.books.length === 0) {
            bookGrid.innerHTML = '';
            if (emptyLibrary) {
                emptyLibrary.style.display = 'block';
            }
            return;
        }
        
        if (emptyLibrary) {
            emptyLibrary.style.display = 'none';
        }
        
        // Clear and rebuild book grid
        bookGrid.innerHTML = '';
        
        this.books.forEach(book => {
            const progress = Math.floor((book.currentPosition / book.totalWords) * 100);
            
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card preserve-3d';
            
            bookCard.innerHTML = `
                <div class="book-cover">${book.title.charAt(0)}</div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <div class="book-meta">
                        <span>${book.type.toUpperCase()} • ${book.totalWords.toLocaleString()} words</span>
                    </div>
                    <div class="book-progress">
                        <div class="progress-bar" style="width: ${progress}%;"></div>
                    </div>
                    <div class="book-actions">
                        <a href="reader.html?id=${book.id}" class="btn btn-primary btn-sm">
                            ${progress > 0 ? 'Continue' : 'Start'}
                        </a>
                        <button class="btn btn-secondary btn-sm book-details" data-id="${book.id}">Details</button>
                    </div>
                </div>
            `;
            
            bookGrid.appendChild(bookCard);
            
            // Add event listener for details button
            const detailsBtn = bookCard.querySelector('.book-details');
            detailsBtn.addEventListener('click', () => {
                this.showBookDetails(book.id);
            });
        });
        
        // Update subscription UI elements
        this.updateSubscriptionUI();
    },
    
    // Show book details
    showBookDetails: function(bookId) {
        const book = this.getBookById(bookId);
        
        if (!book) return;
        
        const progress = Math.floor((book.currentPosition / book.totalWords) * 100);
        
        alert(`
            Title: ${book.title}
            Type: ${book.type.toUpperCase()}
            Total Words: ${book.totalWords}
            Progress: ${progress}%
            Date Added: ${new Date(book.dateAdded).toLocaleDateString()}
            Status: ${book.completed ? 'Completed' : 'In Progress'}
        `);
    },
    
    // Filter books
    filterBooks: function(filter) {
        const bookGrid = document.getElementById('book-grid');
        
        if (!bookGrid) return;
        
        const books = bookGrid.querySelectorAll('.book-card');
        
        books.forEach(book => {
            const bookId = book.querySelector('.book-details').dataset.id;
            const bookData = this.getBookById(bookId);
            
            if (!bookData) return;
            
            if (filter === 'all') {
                book.style.display = 'flex';
            } else if (filter === 'reading' && !bookData.completed) {
                book.style.display = 'flex';
            } else if (filter === 'completed' && bookData.completed) {
                book.style.display = 'flex';
            } else {
                book.style.display = 'none';
            }
        });
    },
    
    // Sort books
    sortBooks: function(sort) {
        const bookGrid = document.getElementById('book-grid');
        
        if (!bookGrid) return;
        
        const books = Array.from(bookGrid.querySelectorAll('.book-card'));
        
        books.sort((a, b) => {
            const aId = a.querySelector('.book-details').dataset.id;
            const bId = b.querySelector('.book-details').dataset.id;
            
            const aBook = this.getBookById(aId);
            const bBook = this.getBookById(bId);
            
            if (!aBook || !bBook) return 0;
            
            if (sort === 'recent') {
                return new Date(bBook.dateAdded) - new Date(aBook.dateAdded);
            } else if (sort === 'title') {
                return aBook.title.localeCompare(bBook.title);
            } else if (sort === 'progress') {
                const aProgress = aBook.currentPosition / aBook.totalWords;
                const bProgress = bBook.currentPosition / bBook.totalWords;
                return bProgress - aProgress;
            }
            
            return 0;
        });
        
        // Reorder DOM elements
        books.forEach(book => {
            bookGrid.appendChild(book);
        });
    },
    
    // Get book by ID
    getBookById: function(id) {
        return this.books.find(book => book.id === id);
    },
    
    // Check if daily stats need to be reset
    checkDailyReset: function() {
        const today = new Date().toDateString();
        
        if (this.stats.lastReset !== today) {
            this.stats.dailyWords = 0;
            this.stats.lastReset = today;
            this.saveData();
        }
    },
    
    // Update reading stats
    updateReadingStats: function(bookId, wordsRead, readingSpeed) {
        // Update daily word count
        this.stats.dailyWords += wordsRead;
        this.stats.totalWords += wordsRead;
        
        // Update average reading speed
        if (readingSpeed) {
            if (this.stats.avgSpeed === 0) {
                this.stats.avgSpeed = readingSpeed;
            } else {
                this.stats.avgSpeed = Math.round((this.stats.avgSpeed + readingSpeed) / 2);
            }
        }
        
        // Update last read book
        this.stats.lastRead = bookId;
        
        // Save stats
        this.saveData();
    },
    
    // Update statistics UI
    updateStatisticsUI: function() {
        // Daily goal progress
        const dailyGoalProgress = document.getElementById('daily-goal-progress');
        const dailyGoalPercent = document.getElementById('daily-goal-percent');
        
        if (dailyGoalProgress && dailyGoalPercent) {
            const percent = Math.min(Math.round((this.stats.dailyWords / this.settings.dailyGoal) * 100), 100);
            dailyGoalProgress.style.width = `${percent}%`;
            dailyGoalPercent.textContent = `${percent}%`;
        }
        
        // Stats summary
        const dailyWords = document.getElementById('daily-words');
        const totalWords = document.getElementById('total-words');
        const avgSpeed = document.getElementById('avg-speed');
        const completedBooks = document.getElementById('completed-books');
        
        if (dailyWords) dailyWords.textContent = this.stats.dailyWords.toLocaleString();
        if (totalWords) totalWords.textContent = this.stats.totalWords.toLocaleString();
        if (avgSpeed) avgSpeed.textContent = this.stats.avgSpeed;
        
        if (completedBooks) {
            const completed = this.books.filter(book => book.completed).length;
            completedBooks.textContent = completed;
        }
        
        // Reading history chart (simplified)
        const readingHistory = document.getElementById('reading-history');
        if (readingHistory) {
            // In a real app, would use a charting library like Chart.js
            readingHistory.innerHTML = '<p>Reading history chart would be implemented with Chart.js in a production environment.</p>';
        }
    },
    
    // Export data
    exportData: function() {
        const data = {
            books: this.books,
            stats: this.stats,
            settings: this.settings
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'bookmark_data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },
    
    // Import data
    importData: function() {
        alert('Data import functionality would be implemented in a production environment.');
    },
    
    // Clear all data
    clearAllData: function() {
        this.books = [];
        this.stats = {
            totalWords: 0,
            dailyWords: 0,
            avgSpeed: 0,
            lastRead: null,
            dailyStats: {},
            lastReset: new Date().toDateString()
        };
        
        this.settings = {
            defaultSpeed: 300,
            defaultMode: 1,
            wordsPerView: 1,
            orpColor: '#c25b56',
            fontSize: 'medium',
            fontFamily: 'sans-serif',
            dailyGoal: 1000
        };
        
        this.saveData();
        
        // Reset subscription if available
        if (typeof SubscriptionSystem !== 'undefined') {
            SubscriptionSystem.downgradeToFree();
        }
        
        location.reload();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});
