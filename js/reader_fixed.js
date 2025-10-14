// reader_fixed.js - Fixed reading functionality for BookMark platform

document.addEventListener('DOMContentLoaded', function() {
    console.log("Reader Fixed JS loaded");
    
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
    const settingsBtn = document.getElementById('settings-btn');
    const settingsIcon = document.getElementById('settings-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressSlider = document.getElementById('progress-slider');
    const progressValue = document.getElementById('progress-value');
    
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
    let currentPosition = 0; // Position for sequential word animation
    let bookLoaded = false; // Flag to track if book is successfully loaded
    
    // Initialize
    init();

    // Event Listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePlayPause();
        });
        console.log("Added click event listener to play-pause button");
    }
    
    if (playPauseBtnAlt) {
        playPauseBtnAlt.addEventListener('click', function(e) {
            e.preventDefault();
            togglePlayPause();
        });
        console.log("Added click event listener to play-pause-btn button");
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            restartReading();
        });
    }
    
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setBookmark();
        });
    }
    
    if (speedSlider) speedSlider.addEventListener('input', updateSpeed);
    if (modeSelect) modeSelect.addEventListener('change', updateMode);
    if (wordsPerViewSlider) wordsPerViewSlider.addEventListener('input', updateWordsPerView);
    if (prevBtn) prevBtn.addEventListener('click', previousWord);
    if (nextBtn) nextBtn.addEventListener('click', nextWord);
    if (progressSlider) progressSlider.addEventListener('input', seekToPosition);
    
    if (backToLibraryBtn) {
        backToLibraryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'library.html';
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);

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
            readerDisplay.style.backgroundColor = '#000000';
        }
        
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
        
        // Calculate interval based on reading speed
        const interval = 60000 / readingSpeed;
        
        // Start interval
        intervalId = setInterval(displayNextWord, interval);
        
        // Update last read timestamp
        updateLastReadBook(currentBookId);
        
        console.log("Reading started with interval:", interval, "ms");
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
        
        // If currently playing, restart with new speed
        if (isPlaying) {
            clearInterval(intervalId);
            const interval = 60000 / readingSpeed;
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
        
        console.log("Words per view updated to:", wordsPerView);
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
        
        // Display current word
        displayCurrentWord();
        
        // Update progress every word to ensure accurate tracking
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
            }
            
            // Hide book mode container
            if (bookModeContainer) bookModeContainer.style.display = 'none';
            if (currentWord) currentWord.style.display = 'block';
            
        } else if (readingMode === 2) {
            // Book Simulation mode
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
                    updateSpeed();
                }
                break;
            case '-':
                // - key - decrease speed
                if (readingSpeed > 100) {
                    readingSpeed -= 50;
                    if (speedSlider) speedSlider.value = readingSpeed;
                    if (speedValue) speedValue.textContent = readingSpeed;
                    updateSpeed();
                }
                break;
        }
    }
});
