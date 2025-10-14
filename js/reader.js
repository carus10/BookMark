// reader.js - Reading functionality for BookMark platform

document.addEventListener('DOMContentLoaded', function() {
    console.log("Reader.js loaded - DOM Content Loaded");
    
    // DOM Elements
    const readerDisplay = document.getElementById('reader-display');
    const currentWord = document.getElementById('current-word');
    const playPauseBtn = document.getElementById('play-pause');
    const restartBtn = document.getElementById('restart');
    const bookmarkBtn = document.getElementById('bookmark');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const modeSelect = document.getElementById('mode-select');
    const progressBar = document.getElementById('progress-bar');
    const progressStart = document.getElementById('progress-start');
    const progressEnd = document.getElementById('progress-end');
    const wordsPerViewContainer = document.getElementById('words-per-view-container');
    const wordsPerViewSlider = document.getElementById('words-per-view');
    const wordsPerViewValue = document.getElementById('words-per-view-value');
    const backToLibraryBtn = document.getElementById('back-to-library');
    const bookTitle = document.querySelector('.book-title');
    
    console.log("DOM Elements initialized:", {
        playPauseBtn: playPauseBtn ? "Found" : "Not found",
        currentWord: currentWord ? "Found" : "Not found",
        bookTitle: bookTitle ? "Found" : "Not found"
    });
    
    // Fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.className = 'btn btn-secondary';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
    document.querySelector('.reader-controls').appendChild(fullscreenBtn);

    // Variables
    let isPlaying = false;
    let intervalId = null;
    let currentBookId = null;
    let currentBook = null;
    let currentIndex = 0;
    let readingSpeed = 300; // WPM
    let readingMode = 1; // 1: Classic RSVP, 2: Book Simulation
    let wordsPerView = 1; // For Mode 2
    let isFullscreen = false;
    let fullscreenContainer = null;
    let bookModeContainer = null;
    let sequentialWordElement = null;
    let fullscreenBookContainer = null;
    let fullscreenSequentialWord = null;
    let currentPosition = 0; // Position for sequential word animation
    let bookLoaded = false; // Flag to track if book is successfully loaded

    // Initialize
    init();

    // Event Listeners - DEMO STYLE DIRECT APPROACH
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
        console.log("Added click event listener to play-pause button DIRECTLY");
    } else {
        console.error("play-pause button not found!");
    }
    
    if (restartBtn) restartBtn.addEventListener('click', restartReading);
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', setBookmark);
    if (speedSlider) speedSlider.addEventListener('input', updateSpeed);
    if (modeSelect) modeSelect.addEventListener('change', updateMode);
    if (wordsPerViewSlider) wordsPerViewSlider.addEventListener('input', updateWordsPerView);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    if (backToLibraryBtn) {
        backToLibraryBtn.addEventListener('click', function() {
            window.location.href = 'library.html';
        });
    }

    // Functions
    function init() {
        console.log("Initializing reader");
        
        // Load user settings
        loadSettings();
        
        // Get book ID from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        currentBookId = urlParams.get('id') || localStorage.getItem('currentBookId');
        
        // Get reading mode from URL if available
        const modeParam = urlParams.get('mode');
        if (modeParam) {
            readingMode = parseInt(modeParam) || 1;
            console.log("Reading mode set from URL:", readingMode);
            
            // Update UI to match mode from URL
            if (modeSelect) {
                modeSelect.value = readingMode;
            }
            
            // Show/hide words per view setting based on mode
            if (readingMode == 2) {
                wordsPerViewContainer.style.display = 'flex';
            } else {
                wordsPerViewContainer.style.display = 'none';
            }
        }
        
        console.log("Current book ID:", currentBookId);
        
        if (currentBookId) {
            loadBook(currentBookId);
        } else {
            currentWord.textContent = 'No book selected. Please return to the library and select a book.';
            console.warn("No book ID found");
        }
        
        // Set background color to black for reader display
        readerDisplay.style.backgroundColor = '#000000';
        
        // Create book mode container for sequential words
        bookModeContainer = document.createElement('div');
        bookModeContainer.className = 'book-mode-container';
        readerDisplay.appendChild(bookModeContainer);
        
        // Create sequential word element
        sequentialWordElement = document.createElement('div');
        sequentialWordElement.className = 'sequential-word';
        bookModeContainer.appendChild(sequentialWordElement);
        
        // Initially hide the book mode container
        bookModeContainer.style.display = 'none';
        
        // Apply reading mode immediately
        applyReadingMode();
        
        console.log("Reader initialization complete");
    }

    function loadSettings() {
        console.log("Loading settings");
        
        // Load settings directly from localStorage
        let settings = {};
        try {
            const savedSettings = localStorage.getItem('bookmarkSettings');
            if (savedSettings) {
                settings = JSON.parse(savedSettings);
                console.log("Settings loaded from localStorage:", settings);
            } else {
                console.warn("No settings found in localStorage");
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            settings = {
                defaultSpeed: 300,
                defaultMode: 1,
                wordsPerView: 1,
                orpColor: '#c25b56'
            };
        }
        
        readingSpeed = settings.defaultSpeed || 300;
        readingMode = settings.defaultMode || 1;
        wordsPerView = settings.wordsPerView || 1;
        
        // Update UI to match settings
        if (speedSlider) speedSlider.value = readingSpeed;
        if (speedValue) speedValue.textContent = readingSpeed;
        if (modeSelect) modeSelect.value = readingMode;
        if (wordsPerViewSlider) wordsPerViewSlider.value = wordsPerView;
        if (wordsPerViewValue) wordsPerViewValue.textContent = wordsPerView;
        
        // Show/hide words per view setting based on mode
        if (wordsPerViewContainer) {
            if (readingMode == 2) {
                wordsPerViewContainer.style.display = 'flex';
            } else {
                wordsPerViewContainer.style.display = 'none';
            }
        }
        
        // Apply ORP color
        document.documentElement.style.setProperty('--orp-color', settings.orpColor || '#c25b56');
        
        console.log("Settings applied to UI");
    }

    function loadBook(bookId) {
        console.log("Loading book with ID:", bookId);
        
        // Reset book loaded flag
        bookLoaded = false;
        
        // Load book from BookStorage (directly from localStorage)
        try {
            const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            console.log("All books from localStorage:", books);
            
            currentBook = books.find(book => book.id === bookId);
            console.log("Book loaded from localStorage:", currentBook);
            
            if (!currentBook && books.length > 0) {
                // If book not found by ID, use the first book
                console.warn("Book not found with ID, using first book instead");
                currentBook = books[0];
                currentBookId = currentBook.id;
                // Update URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('id', currentBookId);
                window.history.replaceState({}, '', newUrl);
                localStorage.setItem('currentBookId', currentBookId);
            }
        } catch (error) {
            console.error("Error loading book from localStorage:", error);
            currentBook = null;
        }
        
        if (currentBook) {
            // Update UI with book info
            if (bookTitle) {
                bookTitle.textContent = currentBook.title;
                console.log("Book title updated:", currentBook.title);
            } else {
                console.error("Book title element not found");
            }
            
            // Check and prepare book content
            prepareBookContent();
            
            // Load saved progress position
            if (currentBook.progress !== undefined && currentBook.progress !== null) {
                currentIndex = currentBook.progress;
                console.log("Starting from saved progress position:", currentIndex);
            } else if (currentBook.bookmark) {
                // If no progress but bookmark exists, start from there
                currentIndex = currentBook.bookmark;
                console.log("Starting from bookmark position:", currentIndex);
            } else {
                // If no progress or bookmark, start from beginning
                currentIndex = 0;
                console.log("Starting from beginning (no saved progress)");
            }
            
            // Set progress
            updateProgress();
            
            // Display initial word or message
            displayCurrentWord();
            
            // Set book loaded flag to true
            bookLoaded = true;
            
            // Save the current book ID to localStorage for persistence
            localStorage.setItem('currentBookId', currentBookId);
            console.log("Current book ID saved to localStorage:", currentBookId);
        } else {
            currentWord.textContent = 'Book not found. Please return to the library and select a book.';
            console.error("Book not found with ID:", bookId);
            
            // Check if library is empty
            try {
                const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
                if (books.length === 0) {
                    currentWord.textContent = 'Your library is empty. Please upload a book first.';
                }
            } catch (error) {
                console.error("Error checking library:", error);
            }
        }
    }
    
    // Prepare book content
    function prepareBookContent() {
        console.log("Preparing book content");
        
        if (!currentBook) {
            console.error("No book to prepare content for");
            return false;
        }
        
        // Check book content
        let words = [];
        
        // If words array exists, use it
        if (currentBook.words && Array.isArray(currentBook.words) && currentBook.words.length > 0) {
            words = currentBook.words;
            console.log("Using words array, length:", words.length);
        } 
        // If content is a string, split into words
        else if (typeof currentBook.content === 'string' && currentBook.content.trim().length > 0) {
            words = currentBook.content.split(/\s+/).filter(w => w.length > 0);
            console.log("Using content string, words length:", words.length);
        }
        // If content is an array, use it
        else if (Array.isArray(currentBook.content) && currentBook.content.length > 0) {
            words = currentBook.content;
            console.log("Using content array, length:", words.length);
        }
        
        // If no words, create an empty array with a message
        if (!words || words.length === 0) {
            console.warn("No words found in book, creating empty array");
            words = ["No", "content", "found", "in", "this", "book"];
            return false;
        }
        
        // Update book content
        currentBook.content = words;
        console.log("Book content prepared, words:", words.length);
        return true;
    }

    // DEMO STYLE TOGGLE FUNCTION
    function togglePlayPause() {
        console.log("togglePlayPause called");
        
        // Check if book is loaded
        if (!bookLoaded) {
            console.error("No book loaded, cannot toggle play/pause");
            
            // Try to reload the book from localStorage
            const storedBookId = localStorage.getItem('currentBookId');
            if (storedBookId) {
                console.log("Attempting to reload book with ID:", storedBookId);
                loadBook(storedBookId);
                
                // If still no book loaded, show error
                if (!bookLoaded) {
                    alert("Please select a book first.");
                    return;
                }
            } else {
                alert("Please select a book first.");
                return;
            }
        }
        
        // Ensure book content is prepared
        if (!prepareBookContent()) {
            console.error("Book content preparation failed");
            alert("This book has no readable content. Please try another book.");
            return;
        }
        
        // Check if book content is valid
        if (!currentBook.content || !Array.isArray(currentBook.content) || currentBook.content.length === 0) {
            console.error("Book content is empty or invalid");
            alert("This book has no readable content. Please try another book.");
            return;
        }
        
        console.log("Current play state:", isPlaying ? "Playing" : "Paused");
        
        if (isPlaying) {
            pauseReading();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            console.log("Reading paused");
        } else {
            startReading();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            console.log("Reading started");
        }
    }

    function startReading() {
        console.log("startReading called");
        
        // Check if book is loaded
        if (!bookLoaded) {
            console.error("No book loaded, cannot start reading");
            
            // Try to reload the book from localStorage
            const storedBookId = localStorage.getItem('currentBookId');
            if (storedBookId) {
                console.log("Attempting to reload book with ID:", storedBookId);
                loadBook(storedBookId);
                
                // If still no book loaded, show error
                if (!bookLoaded) {
                    alert("Please select a book first.");
                    return;
                }
            } else {
                alert("Please select a book first.");
                return;
            }
        }
        
        // Ensure book content is prepared
        if (!prepareBookContent()) {
            console.error("Book content preparation failed");
            alert("This book has no readable content. Please try another book.");
            return;
        }
        
        // Check book content
        if (!currentBook.content || !Array.isArray(currentBook.content) || currentBook.content.length === 0) {
            console.error("Book content is empty or invalid");
            currentWord.textContent = 'No readable content found in this book.';
            return;
        }
        
        console.log("Book content is valid, starting reading");
        isPlaying = true;
        
        // Calculate interval based on WPM
        const interval = 60000 / readingSpeed;
        console.log("Reading interval:", interval, "ms");
        
        // Start interval
        clearInterval(intervalId); // Clear previous interval
        intervalId = setInterval(displayNextWord, interval);
        console.log("Interval set for displaying words");
        
        // Update stats
        try {
            // Update last read book
            updateLastReadBook(currentBookId);
            
            // Update reading statistics
            updateReadingStats();
            
            console.log("Reading stats updated");
        } catch (error) {
            console.error("Error updating reading stats:", error);
        }
    }
    
    // Update reading statistics
    function updateReadingStats() {
        if (!currentBook) return;
        
        try {
            // Get current date
            const today = new Date().toISOString().split('T')[0];
            
            // Create stats update object
            const statsUpdate = {
                wordsRead: 1, // Increment by 1 word
                timeSpent: 60 / readingSpeed, // Time in seconds per word
                sessions: 1
            };
            
            // Update stats in storage
            if (window.StatsStorage && typeof window.StatsStorage.updateStats === 'function') {
                window.StatsStorage.updateStats(statsUpdate);
                console.log("Reading statistics updated:", statsUpdate);
            } else {
                console.error("StatsStorage not available");
            }
            
            // Also record detailed reading session
            recordReadingSession(today);
            
        } catch (error) {
            console.error("Error updating reading statistics:", error);
        }
    }
    
    // Record detailed reading session
    function recordReadingSession(dateStr) {
        try {
            // Get existing reading sessions
            const sessions = JSON.parse(localStorage.getItem('bookmark_reading_sessions') || '[]');
            
            // Create new session or update existing
            let session = sessions.find(s => s.date === dateStr && s.bookId === currentBookId);
            
            if (!session) {
                // Create new session
                session = {
                    date: dateStr,
                    bookId: currentBookId,
                    bookTitle: currentBook.title,
                    wordsRead: 0,
                    readingTime: 0,
                    readingSpeed: readingSpeed
                };
                sessions.push(session);
            }
            
            // Update session data
            session.wordsRead += 1;
            session.readingTime += 60 / readingSpeed;
            session.readingSpeed = readingSpeed;
            session.lastUpdated = new Date().toISOString();
            
            // Save updated sessions
            localStorage.setItem('bookmark_reading_sessions', JSON.stringify(sessions));
            console.log("Reading session recorded");
            
        } catch (error) {
            console.error("Error recording reading session:", error);
        }
    }
    
    // Update last read book
    function updateLastReadBook(id) {
        try {
            const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            
            // Set lastRead value to null for all books
            books.forEach(book => book.lastRead = null);
            
            // Update lastRead value for the specified book
            const index = books.findIndex(book => book.id === id);
            if (index !== -1) {
                books[index].lastRead = new Date().toISOString();
                localStorage.setItem('bookmark_books', JSON.stringify(books));
                console.log("Last read book updated in localStorage");
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Error updating last read book:", error);
            return false;
        }
    }

    function pauseReading() {
        console.log("pauseReading called");
        isPlaying = false;
        clearInterval(intervalId);
        
        // Save progress
        updateBookProgress(currentBookId, currentIndex);
        console.log("Reading paused, progress saved");
    }
    
    // Update book progress
    function updateBookProgress(id, position, isBookmark = false) {
        try {
            const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            const index = books.findIndex(book => book.id === id);
            
            if (index !== -1) {
                // Update progress
                books[index].progress = position;
                
                // If bookmark, update bookmark value
                if (isBookmark) {
                    books[index].bookmark = position;
                    console.log("Bookmark set at position:", position);
                }
                
                localStorage.setItem('bookmark_books', JSON.stringify(books));
                console.log("Book progress updated in localStorage");
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Error updating book progress:", error);
            return false;
        }
    }

    function restartReading() {
        console.log("restartReading called");
        pauseReading();
        currentIndex = 0;
        currentPosition = 0;
        displayCurrentWord();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        console.log("Reading restarted");
    }

    function setBookmark() {
        console.log("setBookmark called");
        
        if (!bookLoaded) {
            console.error("No book loaded, cannot set bookmark");
            alert("Please select a book first.");
            return;
        }
        
        // Save current position as bookmark
        updateBookProgress(currentBookId, currentIndex, true);
        
        // Visual feedback
        bookmarkBtn.classList.add('active');
        setTimeout(() => {
            bookmarkBtn.classList.remove('active');
        }, 1000);
        
        console.log("Bookmark set at position:", currentIndex);
    }

    function updateSpeed() {
        console.log("updateSpeed called");
        
        // Get new speed value
        readingSpeed = parseInt(speedSlider.value);
        speedValue.textContent = readingSpeed;
        
        // If currently playing, restart with new speed
        if (isPlaying) {
            clearInterval(intervalId);
            const interval = 60000 / readingSpeed;
            intervalId = setInterval(displayNextWord, interval);
        }
        
        // Save to settings
        try {
            const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
            settings.defaultSpeed = readingSpeed;
            localStorage.setItem('bookmarkSettings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving speed setting:", error);
        }
        
        console.log("Reading speed updated to:", readingSpeed);
    }

    function updateMode() {
        console.log("updateMode called");
        
        // Get new mode value
        readingMode = parseInt(modeSelect.value);
        
        // Apply reading mode
        applyReadingMode();
        
        // Save to settings
        try {
            const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
            settings.defaultMode = readingMode;
            localStorage.setItem('bookmarkSettings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving mode setting:", error);
        }
        
        console.log("Reading mode updated to:", readingMode);
    }
    
    // Apply reading mode based on current mode value
    function applyReadingMode() {
        // Show/hide words per view setting based on mode
        if (readingMode == 2) {
            wordsPerViewContainer.style.display = 'flex';
            
            // Show book mode container, hide current word
            if (bookModeContainer) bookModeContainer.style.display = 'block';
            if (currentWord) currentWord.style.display = 'none';
            
            // Update fullscreen display if active
            if (isFullscreen && fullscreenWord && fullscreenBookContainer) {
                fullscreenWord.style.display = 'none';
                fullscreenBookContainer.style.display = 'block';
            }
        } else {
            wordsPerViewContainer.style.display = 'none';
            
            // Hide book mode container, show current word
            if (bookModeContainer) bookModeContainer.style.display = 'none';
            if (currentWord) currentWord.style.display = 'block';
            
            // Update fullscreen display if active
            if (isFullscreen && fullscreenWord && fullscreenBookContainer) {
                fullscreenWord.style.display = 'block';
                fullscreenBookContainer.style.display = 'none';
            }
        }
        
        // Update display
        displayCurrentWord();
    }

    function updateWordsPerView() {
        console.log("updateWordsPerView called");
        
        // Get new words per view value
        wordsPerView = parseInt(wordsPerViewSlider.value);
        wordsPerViewValue.textContent = wordsPerView;
        
        // Save to settings
        try {
            const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
            settings.wordsPerView = wordsPerView;
            localStorage.setItem('bookmarkSettings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving words per view setting:", error);
        }
        
        console.log("Words per view updated to:", wordsPerView);
    }

    function displayNextWord() {
        if (!bookLoaded || !currentBook || !currentBook.content) {
            console.error("No book content available for displayNextWord");
            return;
        }
        
        // Check book content
        let contentLength = 0;
        
        // If content is an array, use its length
        if (Array.isArray(currentBook.content)) {
            contentLength = currentBook.content.length;
        } else {
            console.error("Book content is not an array");
            return;
        }
        
        // If no content, exit
        if (contentLength === 0) {
            console.error("Book content is empty");
            return;
        }
        
        // Increment index
        currentIndex++;
        
        // Check if we've reached the end
        if (currentIndex >= contentLength) {
            pauseReading();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            
            // Mark as completed if 100%
            if (currentIndex >= contentLength - 1) {
                updateBookProgress(currentBookId, currentIndex, false);
                console.log("Book completed");
            }
            
            return;
        }
        
        // Display current word
        displayCurrentWord();
        
        // Update progress every word to ensure accurate tracking
        updateProgress();
        
        // Update reading statistics for each word
        updateReadingStats();
    }

    function displayCurrentWord() {
        console.log("displayCurrentWord called, index:", currentIndex);
        
        if (!bookLoaded || !currentBook) {
            console.error("No book loaded, cannot display word");
            return;
        }
        
        // Check book content and split into words
        let words = [];
        
        // If content is an array, use it
        if (Array.isArray(currentBook.content)) {
            words = currentBook.content;
            console.log("Using content array, length:", words.length);
        } else {
            console.error("Book content is not an array");
            return;
        }
        
        // If no words, exit
        if (words.length === 0) {
            console.error("No words found in book");
            currentWord.textContent = 'No readable content found in this book.';
            return;
        }
        
        // Check current index
        if (currentIndex >= words.length) {
            currentIndex = words.length - 1;
            console.warn("Current index exceeds word count, adjusted to:", currentIndex);
        }
        
        // Get current word
        const word = words[currentIndex];
        console.log("Current word:", word, "at index:", currentIndex);
        
        if (readingMode === 1) {
            // Classic RSVP mode - highlight ORP (Optimal Recognition Point)
            const orpIndex = Math.floor(word.length / 3);
            
            // Create HTML with ORP highlight
            let html = '';
            for (let i = 0; i < word.length; i++) {
                if (i === orpIndex) {
                    html += `<span class="orp">${word[i]}</span>`;
                } else {
                    html += word[i];
                }
            }
            
            // Update display
            currentWord.innerHTML = html;
            
            // Hide book mode container
            bookModeContainer.style.display = 'none';
            currentWord.style.display = 'block';
            
        } else if (readingMode === 2) {
            // Book Simulation mode - improved version
            // Get current word only
            const currentWordText = words[currentIndex];
            
            // Apply ORP highlighting to the current word
            const orpIndex = Math.floor(currentWordText.length / 3);
            let html = '';
            for (let i = 0; i < currentWordText.length; i++) {
                if (i === orpIndex) {
                    html += `<span class="orp">${currentWordText[i]}</span>`;
                } else {
                    html += currentWordText[i];
                }
            }
            
            // Update sequential word element with highlighted word
            sequentialWordElement.innerHTML = html;
            
            // Position the word based on reading progress
            // Calculate position to create left-to-right reading flow
            const containerWidth = bookModeContainer.offsetWidth || 800;
            const wordWidth = sequentialWordElement.offsetWidth || 100;
            
            // Calculate position based on current index within the view window
            const positionFactor = (currentIndex % 10) / 10; // Creates a cycle every 10 words
            const leftPosition = Math.floor(positionFactor * (containerWidth - wordWidth));
            
            // Apply position
            sequentialWordElement.style.position = 'absolute';
            sequentialWordElement.style.left = leftPosition + 'px';
            sequentialWordElement.style.top = '50%';
            sequentialWordElement.style.transform = 'translateY(-50%)';
            
            // Add animation class for smooth transition
            sequentialWordElement.classList.remove('word-animation');
            void sequentialWordElement.offsetWidth; // Force reflow
            sequentialWordElement.classList.add('word-animation');
            
            // Show book mode container
            bookModeContainer.style.display = 'block';
            currentWord.style.display = 'none';
            
            // Reset position counter when reaching the right edge
            if (leftPosition > containerWidth * 0.8) {
                currentPosition = 0;
            } else {
                // Increment position for next word
                currentPosition++;
            }
            
            // Update fullscreen display if active
            if (isFullscreen && fullscreenSequentialWord) {
                fullscreenSequentialWord.innerHTML = html;
                fullscreenSequentialWord.style.position = 'absolute';
                fullscreenSequentialWord.style.left = leftPosition + 'px';
                fullscreenSequentialWord.style.top = '50%';
                fullscreenSequentialWord.style.transform = 'translateY(-50%)';
                
                fullscreenSequentialWord.classList.remove('word-animation');
                void fullscreenSequentialWord.offsetWidth; // Force reflow
                fullscreenSequentialWord.classList.add('word-animation');
            }
        }
        
        // Update progress
        updateProgress();
    }

    function updateProgress() {
        if (!bookLoaded || !currentBook || !currentBook.content) return;
        
        // Calculate progress percentage
        const total = Array.isArray(currentBook.content) ? currentBook.content.length : 0;
        const percentage = total > 0 ? Math.floor((currentIndex / total) * 100) : 0;
        
        // Update progress bar
        progressBar.style.width = percentage + '%';
        progressStart.textContent = percentage + '%';
        
        // Save progress to localStorage immediately
        updateBookProgress(currentBookId, currentIndex, false);
        
        console.log("Progress updated and saved:", percentage + "%");
    }

    function toggleFullscreen() {
        console.log("toggleFullscreen called");
        
        // Force browser fullscreen first
        if (!document.fullscreenElement && 
            !document.mozFullScreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {
            
            console.log("Requesting browser fullscreen");
            
            // Request browser fullscreen
            const docElement = document.documentElement;
            if (docElement.requestFullscreen) {
                docElement.requestFullscreen();
            } else if (docElement.mozRequestFullScreen) { // Firefox
                docElement.mozRequestFullScreen();
            } else if (docElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                docElement.webkitRequestFullscreen();
            } else if (docElement.msRequestFullscreen) { // IE/Edge
                docElement.msRequestFullscreen();
            }
        }
        
        // Small delay to ensure browser fullscreen is processed
        setTimeout(() => {
            if (!isFullscreen) {
                // Enter fullscreen mode
                enterFullscreen();
            } else {
                // Exit fullscreen mode
                exitFullscreen();
            }
        }, 100);
    }

    function enterFullscreen() {
        console.log("Entering fullscreen mode");
        
        // Create fullscreen container
        fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fullscreen-reader';
        document.body.appendChild(fullscreenContainer);
        
        // Create fullscreen display
        const fullscreenDisplay = document.createElement('div');
        fullscreenDisplay.className = 'fullscreen-display';
        fullscreenContainer.appendChild(fullscreenDisplay);
        
        // Create fullscreen word element
        fullscreenWord = document.createElement('div');
        fullscreenWord.className = 'fullscreen-word';
        fullscreenWord.innerHTML = currentWord.innerHTML;
        fullscreenDisplay.appendChild(fullscreenWord);
        
        // Create fullscreen book container for sequential words
        fullscreenBookContainer = document.createElement('div');
        fullscreenBookContainer.className = 'fullscreen-book-container';
        fullscreenDisplay.appendChild(fullscreenBookContainer);
        
        // Create fullscreen sequential word element
        fullscreenSequentialWord = document.createElement('div');
        fullscreenSequentialWord.className = 'fullscreen-sequential-word';
        fullscreenSequentialWord.textContent = sequentialWordElement.textContent;
        fullscreenBookContainer.appendChild(fullscreenSequentialWord);
        
        // Show/hide elements based on reading mode
        if (readingMode === 1) {
            fullscreenWord.style.display = 'block';
            fullscreenBookContainer.style.display = 'none';
        } else {
            fullscreenWord.style.display = 'none';
            fullscreenBookContainer.style.display = 'block';
        }
        
        // Create fullscreen controls
        const fullscreenControls = document.createElement('div');
        fullscreenControls.className = 'fullscreen-controls';
        fullscreenContainer.appendChild(fullscreenControls);
        
        // Create exit fullscreen button
        const exitFullscreenBtn = document.createElement('button');
        exitFullscreenBtn.className = 'fullscreen-btn';
        exitFullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        exitFullscreenBtn.addEventListener('click', exitFullscreen);
        fullscreenControls.appendChild(exitFullscreenBtn);
        
        // Create pause mode button
        const pauseModeBtn = document.createElement('button');
        pauseModeBtn.className = 'fullscreen-btn';
        pauseModeBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Mode';
        pauseModeBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseReading();
                pauseModeBtn.style.display = 'none';
                continueModeBtn.style.display = 'inline-block';
            }
        });
        fullscreenControls.appendChild(pauseModeBtn);
        
        // Create continue mode button
        const continueModeBtn = document.createElement('button');
        continueModeBtn.className = 'fullscreen-btn';
        continueModeBtn.innerHTML = '<i class="fas fa-play"></i> Continue Mode';
        continueModeBtn.style.display = 'none'; // Initially hidden
        continueModeBtn.addEventListener('click', function() {
            if (!isPlaying) {
                startReading();
                continueModeBtn.style.display = 'none';
                pauseModeBtn.style.display = 'inline-block';
            }
        });
        fullscreenControls.appendChild(continueModeBtn);
        
        // Create exit button at the top right
        const exitBtn = document.createElement('button');
        exitBtn.className = 'fullscreen-exit';
        exitBtn.innerHTML = '<i class="fas fa-times"></i>';
        exitBtn.addEventListener('click', exitFullscreen);
        fullscreenContainer.appendChild(exitBtn);
        
        // Add class to body for fullscreen styling
        document.body.classList.add('fullscreen-active');
        document.documentElement.classList.add('fullscreen-active');
        
        // Update state
        isFullscreen = true;
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        
        // Store original function for later restoration
        window.originalDisplayCurrentWord = displayCurrentWord;
        
        // Override display function to handle fullscreen mode
        displayCurrentWord = function() {
            // Call original function
            window.originalDisplayCurrentWord.call(this);
            
            // Update fullscreen display
            if (isFullscreen) {
                if (readingMode === 1) {
                    // Mode 1: Classic RSVP
                    fullscreenWord.innerHTML = currentWord.innerHTML;
                    fullscreenWord.style.display = 'block';
                    fullscreenBookContainer.style.display = 'none';
                } else {
                    // Mode 2: Book Simulation
                    // Copy all properties from the sequential word element
                    fullscreenSequentialWord.innerHTML = sequentialWordElement.innerHTML;
                    fullscreenSequentialWord.style.position = sequentialWordElement.style.position;
                    fullscreenSequentialWord.style.left = sequentialWordElement.style.left;
                    fullscreenSequentialWord.style.top = sequentialWordElement.style.top;
                    fullscreenSequentialWord.style.transform = sequentialWordElement.style.transform;
                    
                    // Apply animation classes
                    if (sequentialWordElement.classList.contains('word-animation')) {
                        fullscreenSequentialWord.classList.add('word-animation');
                    } else {
                        fullscreenSequentialWord.classList.remove('word-animation');
                    }
                    
                    fullscreenWord.style.display = 'none';
                    fullscreenBookContainer.style.display = 'block';
                }
            }
        };
        
        console.log("Fullscreen mode entered");
    }

    function exitFullscreen() {
        console.log("Exiting fullscreen mode");
        
        // Remove fullscreen container
        if (fullscreenContainer) {
            document.body.removeChild(fullscreenContainer);
            fullscreenContainer = null;
        }
        
        // Remove fullscreen classes from body and html
        document.body.classList.remove('fullscreen-active');
        document.documentElement.classList.remove('fullscreen-active');
        
        // Restore original displayCurrentWord function
        if (window.originalDisplayCurrentWord) {
            displayCurrentWord = window.originalDisplayCurrentWord;
            window.originalDisplayCurrentWord = null;
        }
        
        // Update state
        isFullscreen = false;
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        
        console.log("Fullscreen mode exited");
    }
    
    // Expose functions for debugging
    window.readerDebug = {
        togglePlayPause,
        startReading,
        pauseReading,
        restartReading,
        displayCurrentWord,
        getCurrentState: function() {
            return {
                isPlaying,
                currentBookId,
                currentIndex,
                readingMode,
                readingSpeed,
                bookLoaded,
                currentBook: currentBook ? {
                    id: currentBook.id,
                    title: currentBook.title,
                    contentLength: currentBook.content ? currentBook.content.length : 0
                } : null
            };
        }
    };
    
    console.log("Reader.js initialization complete");
});
