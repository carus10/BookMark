// reader_improved.js - Improved reading functionality for BookMark platform

document.addEventListener('DOMContentLoaded', function() {
    console.log("Reader Improved JS loaded");
    
    // DOM Elements
    const readerDisplay = document.getElementById('reader-display');
    const currentWord = document.getElementById('current-word');
    const playPauseBtn = document.getElementById('play-pause');
    const playPauseBtnAlt = document.getElementById('play-pause-btn');
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
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const preferencesBtn = document.getElementById('preferences-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressSlider = document.getElementById('progress-slider');
    const progressValue = document.getElementById('progress-value');
    
    // Preferences Modal Elements
    const preferencesModal = document.getElementById('preferences-modal');
    const closeModal = document.querySelector('.close-modal');
    const wpmInput = document.getElementById('wpm-input');
    const windowSizeSelect = document.getElementById('window-size');
    const chunkSizeSelect = document.getElementById('chunk-size');
    const fontSizeSelect = document.getElementById('font-size');
    const fontColorInput = document.getElementById('font-color');
    const bgColorInput = document.getElementById('bg-color');
    const textAlignSelect = document.getElementById('text-align');
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedSettings = document.getElementById('advanced-settings');
    const speedVariabilityCheck = document.getElementById('speed-variability');
    const newChunkAtSentenceCheck = document.getElementById('new-chunk-at-sentence');
    const pauseAtSentenceCheck = document.getElementById('pause-at-sentence');
    const restoreDefaultsBtn = document.getElementById('restore-defaults');
    const savePreferencesBtn = document.getElementById('save-preferences');
    
    // Book mode elements
    const bookModeContainer = document.getElementById('book-mode-container');
    const sequentialWordElement = document.getElementById('sequential-word');
    
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
    let currentPosition = 0; // Position for sequential word animation
    let bookLoaded = false; // Flag to track if book is successfully loaded
    
    // Preferences
    let preferences = {
        wpm: 300,
        windowSize: '700x500',
        chunkSize: 1,
        fontSize: 40,
        fontColor: '#FFFFFF',
        bgColor: '#000000',
        textAlign: 'center',
        speedVariability: false,
        newChunkAtSentence: false,
        pauseAtSentence: false
    };

    // Initialize
    init();

    // Event Listeners
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (playPauseBtnAlt) playPauseBtnAlt.addEventListener('click', togglePlayPause);
    if (restartBtn) restartBtn.addEventListener('click', restartReading);
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', setBookmark);
    if (speedSlider) speedSlider.addEventListener('input', updateSpeed);
    if (modeSelect) modeSelect.addEventListener('change', updateMode);
    if (wordsPerViewSlider) wordsPerViewSlider.addEventListener('input', updateWordsPerView);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (preferencesBtn) preferencesBtn.addEventListener('click', openPreferences);
    if (settingsBtn) settingsBtn.addEventListener('click', openPreferences);
    if (prevBtn) prevBtn.addEventListener('click', previousWord);
    if (nextBtn) nextBtn.addEventListener('click', nextWord);
    if (progressSlider) progressSlider.addEventListener('input', seekToPosition);
    
    if (backToLibraryBtn) {
        backToLibraryBtn.addEventListener('click', function() {
            window.location.href = 'library.html';
        });
    }
    
    // Preferences Modal Event Listeners
    if (closeModal) closeModal.addEventListener('click', closePreferences);
    if (advancedToggle) advancedToggle.addEventListener('click', toggleAdvancedSettings);
    if (restoreDefaultsBtn) restoreDefaultsBtn.addEventListener('click', restoreDefaults);
    if (savePreferencesBtn) savePreferencesBtn.addEventListener('click', savePreferences);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === preferencesModal) {
            closePreferences();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);

    // Functions
    function init() {
        console.log("Initializing improved reader");
        
        // Load user preferences
        loadPreferences();
        
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
            if (readingMode == 2 && wordsPerViewContainer) {
                wordsPerViewContainer.style.display = 'flex';
            } else if (wordsPerViewContainer) {
                wordsPerViewContainer.style.display = 'none';
            }
        }
        
        console.log("Current book ID:", currentBookId);
        
        if (currentBookId) {
            loadBook(currentBookId);
        } else {
            if (currentWord) {
                currentWord.textContent = 'No book selected. Please return to the library and select a book.';
            }
            console.warn("No book ID found");
        }
        
        // Set background color to black for reader display
        if (readerDisplay) {
            readerDisplay.style.backgroundColor = preferences.bgColor;
        }
        
        // Apply reading mode immediately
        applyReadingMode();
        
        // Apply preferences to UI
        applyPreferencesToUI();
        
        console.log("Reader initialization complete");
    }

    function loadPreferences() {
        console.log("Loading preferences");
        
        try {
            const savedPreferences = localStorage.getItem('bookmarkPreferences');
            if (savedPreferences) {
                preferences = JSON.parse(savedPreferences);
                console.log("Preferences loaded:", preferences);
            } else {
                console.warn("No preferences found, using defaults");
            }
        } catch (error) {
            console.error("Error loading preferences:", error);
        }
        
        // Set reading speed and mode from preferences
        readingSpeed = preferences.wpm;
        readingMode = preferences.chunkSize > 1 ? 2 : 1;
        wordsPerView = preferences.chunkSize;
        
        // Update UI elements with preferences
        updateUIFromPreferences();
    }
    
    function updateUIFromPreferences() {
        // Update speed slider and value
        if (speedSlider) speedSlider.value = readingSpeed;
        if (speedValue) speedValue.textContent = readingSpeed;
        if (wpmInput) wpmInput.value = readingSpeed;
        
        // Update mode select
        if (modeSelect) modeSelect.value = readingMode;
        
        // Update words per view
        if (wordsPerViewSlider) wordsPerViewSlider.value = wordsPerView;
        if (wordsPerViewValue) wordsPerViewValue.textContent = wordsPerView;
        if (chunkSizeSelect) chunkSizeSelect.value = wordsPerView;
        
        // Show/hide words per view setting based on mode
        if (wordsPerViewContainer) {
            if (readingMode == 2) {
                wordsPerViewContainer.style.display = 'flex';
            } else {
                wordsPerViewContainer.style.display = 'none';
            }
        }
        
        // Update other preferences UI elements
        if (windowSizeSelect) windowSizeSelect.value = preferences.windowSize;
        if (fontSizeSelect) fontSizeSelect.value = preferences.fontSize;
        if (fontColorInput) fontColorInput.value = preferences.fontColor;
        if (bgColorInput) bgColorInput.value = preferences.bgColor;
        if (textAlignSelect) textAlignSelect.value = preferences.textAlign;
        
        // Update advanced settings
        if (speedVariabilityCheck) speedVariabilityCheck.checked = preferences.speedVariability;
        if (newChunkAtSentenceCheck) newChunkAtSentenceCheck.checked = preferences.newChunkAtSentence;
        if (pauseAtSentenceCheck) pauseAtSentenceCheck.checked = preferences.pauseAtSentence;
    }
    
    function applyPreferencesToUI() {
        // Apply font size
        document.documentElement.style.setProperty('--reader-font-size', preferences.fontSize + 'px');
        
        // Apply font color
        if (currentWord) currentWord.style.color = preferences.fontColor;
        if (sequentialWordElement) sequentialWordElement.style.color = preferences.fontColor;
        
        // Apply background color
        if (readerDisplay) readerDisplay.style.backgroundColor = preferences.bgColor;
        
        // Apply text alignment
        if (currentWord) currentWord.style.textAlign = preferences.textAlign;
        
        // Apply window size if not in fullscreen
        if (!isFullscreen && readerDisplay) {
            const [width, height] = preferences.windowSize.split('x');
            readerDisplay.style.width = width + 'px';
            readerDisplay.style.height = height + 'px';
        }
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
            if (currentWord) {
                currentWord.textContent = 'Book not found. Please return to the library and select a book.';
            }
            console.error("Book not found with ID:", bookId);
            
            // Check if library is empty
            try {
                const books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
                if (books.length === 0 && currentWord) {
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
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (playPauseBtnAlt) playPauseBtnAlt.innerHTML = '<i class="fas fa-play"></i> Start';
            console.log("Reading paused");
        } else {
            startReading();
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (playPauseBtnAlt) playPauseBtnAlt.innerHTML = '<i class="fas fa-pause"></i> Pause';
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
            alert("This book has no readable content. Please try another book.");
            return;
        }
        
        // If we're at the end, restart
        if (currentIndex >= currentBook.content.length - 1) {
            currentIndex = 0;
            console.log("Reached end of book, restarting from beginning");
        }
        
        // Set playing flag
        isPlaying = true;
        
        // Calculate interval based on reading speed and apply speed variability if enabled
        let interval = calculateReadingInterval();
        
        // Start interval
        intervalId = setInterval(displayNextWord, interval);
        
        // Update last read timestamp
        updateLastReadBook(currentBookId);
        
        console.log("Reading started with interval:", interval, "ms");
    }
    
    function calculateReadingInterval() {
        // Base interval calculation (60000 ms / WPM)
        let interval = 60000 / readingSpeed;
        
        // Apply speed variability if enabled
        if (preferences.speedVariability && readingMode === 2) {
            // Adjust speed based on chunk size (words per view)
            // Slow down for larger chunks, speed up for smaller ones
            const adjustmentFactor = 1 + ((wordsPerView - 1) * 0.2);
            interval *= adjustmentFactor;
            console.log("Speed variability applied, adjustment factor:", adjustmentFactor);
        }
        
        return interval;
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

    function restartReading() {
        console.log("restartReading called");
        pauseReading();
        currentIndex = 0;
        currentPosition = 0;
        displayCurrentWord();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (playPauseBtnAlt) playPauseBtnAlt.innerHTML = '<i class="fas fa-play"></i> Start';
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
        if (bookmarkBtn) {
            bookmarkBtn.classList.add('active');
            setTimeout(() => {
                bookmarkBtn.classList.remove('active');
            }, 1000);
        }
        
        console.log("Bookmark set at position:", currentIndex);
    }

    function updateSpeed() {
        console.log("updateSpeed called");
        
        // Get new speed value
        readingSpeed = parseInt(speedSlider.value);
        if (speedValue) speedValue.textContent = readingSpeed;
        if (wpmInput) wpmInput.value = readingSpeed;
        
        // Update preferences
        preferences.wpm = readingSpeed;
        savePreferencesToStorage();
        
        // If currently playing, restart with new speed
        if (isPlaying) {
            clearInterval(intervalId);
            const interval = calculateReadingInterval();
            intervalId = setInterval(displayNextWord, interval);
        }
        
        console.log("Reading speed updated to:", readingSpeed);
    }

    function updateMode() {
        console.log("updateMode called");
        
        // Get new mode value
        readingMode = parseInt(modeSelect.value);
        
        // Apply reading mode
        applyReadingMode();
        
        // Update preferences
        preferences.chunkSize = readingMode === 2 ? wordsPerView : 1;
        savePreferencesToStorage();
        
        console.log("Reading mode updated to:", readingMode);
    }
    
    // Apply reading mode based on current mode value
    function applyReadingMode() {
        // Show/hide words per view setting based on mode
        if (wordsPerViewContainer) {
            if (readingMode == 2) {
                wordsPerViewContainer.style.display = 'flex';
                
                // Show book mode container, hide current word
                if (bookModeContainer) bookModeContainer.style.display = 'block';
                if (currentWord) currentWord.style.display = 'none';
            } else {
                wordsPerViewContainer.style.display = 'none';
                
                // Hide book mode container, show current word
                if (bookModeContainer) bookModeContainer.style.display = 'none';
                if (currentWord) currentWord.style.display = 'block';
            }
        }
        
        // Update display
        displayCurrentWord();
    }

    function updateWordsPerView() {
        console.log("updateWordsPerView called");
        
        // Get new words per view value
        wordsPerView = parseInt(wordsPerViewSlider.value);
        if (wordsPerViewValue) wordsPerViewValue.textContent = wordsPerView;
        if (chunkSizeSelect) chunkSizeSelect.value = wordsPerView;
        
        // Update preferences
        preferences.chunkSize = wordsPerView;
        savePreferencesToStorage();
        
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
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (playPauseBtnAlt) playPauseBtnAlt.innerHTML = '<i class="fas fa-play"></i> Start';
            
            // Mark as completed if 100%
            if (currentIndex >= contentLength - 1) {
                updateBookProgress(currentBookId, currentIndex, false);
                console.log("Book completed");
            }
            
            return;
        }
        
        // Check if we should pause at sentence end
        if (preferences.pauseAtSentence) {
            const currentWordText = currentBook.content[currentIndex];
            if (currentWordText && /[.!?]$/.test(currentWordText)) {
                // Add a slight pause by clearing and resetting the interval
                clearInterval(intervalId);
                setTimeout(() => {
                    if (isPlaying) {
                        intervalId = setInterval(displayNextWord, calculateReadingInterval());
                    }
                }, 500); // 500ms pause
            }
        }
        
        // Display current word
        displayCurrentWord();
        
        // Update progress every word to ensure accurate tracking
        updateProgress();
    }
    
    function previousWord() {
        if (!bookLoaded || !currentBook || !currentBook.content) {
            console.error("No book content available");
            return;
        }
        
        // Decrement index, but don't go below 0
        currentIndex = Math.max(0, currentIndex - 1);
        
        // Display current word
        displayCurrentWord();
        
        // Update progress
        updateProgress();
    }
    
    function nextWord() {
        if (!bookLoaded || !currentBook || !currentBook.content) {
            console.error("No book content available");
            return;
        }
        
        // Increment index, but don't exceed content length
        if (Array.isArray(currentBook.content)) {
            currentIndex = Math.min(currentBook.content.length - 1, currentIndex + 1);
        }
        
        // Display current word
        displayCurrentWord();
        
        // Update progress
        updateProgress();
    }
    
    function seekToPosition() {
        if (!bookLoaded || !currentBook || !currentBook.content) {
            console.error("No book content available");
            return;
        }
        
        // Calculate new index based on slider position
        const percentage = parseInt(progressSlider.value);
        if (Array.isArray(currentBook.content)) {
            currentIndex = Math.floor((percentage / 100) * currentBook.content.length);
        }
        
        // Display current word
        displayCurrentWord();
        
        // Update progress
        updateProgress();
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
        } else {
            console.error("Book content is not an array");
            return;
        }
        
        // If no words, exit
        if (words.length === 0) {
            console.error("No words found in book");
            if (currentWord) currentWord.textContent = 'No readable content found in this book.';
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
            if (currentWord) {
                currentWord.innerHTML = html;
                currentWord.style.fontSize = preferences.fontSize + 'px';
                currentWord.style.color = preferences.fontColor;
                currentWord.style.textAlign = preferences.textAlign;
            }
            
            // Hide book mode container
            if (bookModeContainer) bookModeContainer.style.display = 'none';
            if (currentWord) currentWord.style.display = 'block';
            
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
            if (sequentialWordElement) {
                sequentialWordElement.innerHTML = html;
                sequentialWordElement.style.fontSize = preferences.fontSize + 'px';
                sequentialWordElement.style.color = preferences.fontColor;
            }
            
            // Position the word based on reading progress
            // Calculate position to create left-to-right reading flow
            if (bookModeContainer && sequentialWordElement) {
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
            }
            
            // Show book mode container
            if (bookModeContainer) bookModeContainer.style.display = 'block';
            if (currentWord) currentWord.style.display = 'none';
            
            // Reset position counter when reaching the right edge
            if (bookModeContainer && sequentialWordElement) {
                const containerWidth = bookModeContainer.offsetWidth || 800;
                const wordWidth = sequentialWordElement.offsetWidth || 100;
                const leftPosition = parseInt(sequentialWordElement.style.left) || 0;
                
                if (leftPosition > containerWidth * 0.8) {
                    currentPosition = 0;
                } else {
                    // Increment position for next word
                    currentPosition++;
                }
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
        if (progressBar) progressBar.style.width = percentage + '%';
        if (progressStart) progressStart.textContent = percentage + '%';
        if (progressSlider) progressSlider.value = percentage;
        if (progressValue) progressValue.textContent = percentage + '%';
        
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
        } else if (isFullscreen) {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
        
        // Toggle fullscreen state
        isFullscreen = !isFullscreen;
        
        // Apply fullscreen styles
        if (readerDisplay) {
            if (isFullscreen) {
                readerDisplay.classList.add('fullscreen-mode');
                // Apply fullscreen size
                readerDisplay.style.width = '100%';
                readerDisplay.style.height = '80vh';
            } else {
                readerDisplay.classList.remove('fullscreen-mode');
                // Restore original size from preferences
                const [width, height] = preferences.windowSize.split('x');
                readerDisplay.style.width = width + 'px';
                readerDisplay.style.height = height + 'px';
            }
        }
    }
    
    function openPreferences() {
        console.log("openPreferences called");
        
        // Update preferences UI with current values
        updateUIFromPreferences();
        
        // Show modal
        if (preferencesModal) {
            preferencesModal.style.display = 'block';
        }
    }
    
    function closePreferences() {
        console.log("closePreferences called");
        
        // Hide modal
        if (preferencesModal) {
            preferencesModal.style.display = 'none';
        }
    }
    
    function toggleAdvancedSettings(e) {
        console.log("toggleAdvancedSettings called");
        
        // Prevent default link behavior
        if (e) e.preventDefault();
        
        // Toggle advanced settings visibility
        if (advancedSettings) {
            if (advancedSettings.style.display === 'none') {
                advancedSettings.style.display = 'block';
            } else {
                advancedSettings.style.display = 'none';
            }
        }
    }
    
    function restoreDefaults() {
        console.log("restoreDefaults called");
        
        // Set default preferences
        preferences = {
            wpm: 300,
            windowSize: '700x500',
            chunkSize: 1,
            fontSize: 40,
            fontColor: '#FFFFFF',
            bgColor: '#000000',
            textAlign: 'center',
            speedVariability: false,
            newChunkAtSentence: false,
            pauseAtSentence: false
        };
        
        // Update UI with default values
        updateUIFromPreferences();
        
        // Save to localStorage
        savePreferencesToStorage();
        
        // Apply preferences to UI
        applyPreferencesToUI();
    }
    
    function savePreferences() {
        console.log("savePreferences called");
        
        // Get values from UI
        preferences.wpm = parseInt(wpmInput.value) || 300;
        preferences.windowSize = windowSizeSelect.value;
        preferences.chunkSize = parseInt(chunkSizeSelect.value) || 1;
        preferences.fontSize = parseInt(fontSizeSelect.value) || 40;
        preferences.fontColor = fontColorInput.value;
        preferences.bgColor = bgColorInput.value;
        preferences.textAlign = textAlignSelect.value;
        preferences.speedVariability = speedVariabilityCheck.checked;
        preferences.newChunkAtSentence = newChunkAtSentenceCheck.checked;
        preferences.pauseAtSentence = pauseAtSentenceCheck.checked;
        
        // Update reading speed and mode
        readingSpeed = preferences.wpm;
        readingMode = preferences.chunkSize > 1 ? 2 : 1;
        wordsPerView = preferences.chunkSize;
        
        // Update UI elements
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
        
        // Save to localStorage
        savePreferencesToStorage();
        
        // Apply preferences to UI
        applyPreferencesToUI();
        
        // Apply reading mode
        applyReadingMode();
        
        // Close modal
        closePreferences();
    }
    
    function savePreferencesToStorage() {
        try {
            localStorage.setItem('bookmarkPreferences', JSON.stringify(preferences));
            console.log("Preferences saved to localStorage");
        } catch (error) {
            console.error("Error saving preferences to localStorage:", error);
        }
    }
    
    function handleKeyPress(e) {
        // Only handle key presses if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        switch (e.key) {
            case ' ':
            case 'p':
                // Space or P key - toggle play/pause
                togglePlayPause();
                break;
            case 'r':
                // R key - restart
                restartReading();
                break;
            case 'b':
                // B key - bookmark
                setBookmark();
                break;
            case 'f':
                // F key - fullscreen
                toggleFullscreen();
                break;
            case 's':
                // S key - settings
                openPreferences();
                break;
            case 'ArrowLeft':
                // Left arrow - previous word
                previousWord();
                break;
            case 'ArrowRight':
                // Right arrow - next word
                nextWord();
                break;
            case '+':
            case '=':
                // + key - increase speed
                if (readingSpeed < 1000) {
                    readingSpeed += 50;
                    if (speedSlider) speedSlider.value = readingSpeed;
                    if (speedValue) speedValue.textContent = readingSpeed;
                    if (wpmInput) wpmInput.value = readingSpeed;
                    updateSpeed();
                }
                break;
            case '-':
                // - key - decrease speed
                if (readingSpeed > 100) {
                    readingSpeed -= 50;
                    if (speedSlider) speedSlider.value = readingSpeed;
                    if (speedValue) speedValue.textContent = readingSpeed;
                    if (wpmInput) wpmInput.value = readingSpeed;
                    updateSpeed();
                }
                break;
        }
    }
});
