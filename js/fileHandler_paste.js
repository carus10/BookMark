// fileHandler_paste.js - Enhanced file upload and text paste processing module
// BookMark - Mind Accelerating Reading Platform

// File upload and processing functions
const FileHandler = {
    // Supported file types
    supportedFileTypes: ['application/pdf', 'text/plain'],
    
    // Initialization function to run when page loads
    init: function() {
        console.log('Enhanced FileHandler module initializing...');
        
        // Initialize upload area
        this.initUploadArea();
        
        // Initialize paste functionality
        this.initPasteFeature();
        
        // Initialize tab switching
        this.initTabSwitching();
        
        // Load book list
        this.loadBookList();
        
        console.log('Enhanced FileHandler module initialized.');
    },
    
    // Initialize tab switching
    initTabSwitching: function() {
        const tabs = document.querySelectorAll('.upload-tab');
        const panels = document.querySelectorAll('.upload-panel');
        
        if (!tabs.length || !panels.length) {
            console.error('Upload tabs or panels not found');
            return;
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding panel
                const panelId = tab.getAttribute('data-tab');
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });
        
        console.log('Tab switching initialized');
    },
    
    // Initialize paste functionality
    initPasteFeature: function() {
        console.log('Initializing paste feature');
        
        const createBookBtn = document.getElementById('create-book-btn');
        const bookTitleInput = document.getElementById('book-title');
        const bookContentTextarea = document.getElementById('book-content');
        
        if (!createBookBtn || !bookTitleInput || !bookContentTextarea) {
            console.error('Paste feature elements not found');
            return;
        }
        
        // Create book button click event
        createBookBtn.addEventListener('click', () => {
            const title = bookTitleInput.value.trim();
            const content = bookContentTextarea.value.trim();
            
            // Validate input
            if (!title) {
                alert('Please enter a book title');
                bookTitleInput.focus();
                return;
            }
            
            if (!content) {
                alert('Please paste some text content');
                bookContentTextarea.focus();
                return;
            }
            
            // Process pasted text
            this.processPastedText(title, content);
        });
        
        // Enable paste from clipboard directly
        bookContentTextarea.addEventListener('paste', (e) => {
            console.log('Text pasted into textarea');
        });
        
        console.log('Paste feature initialized');
    },
    
    // Process pasted text
    processPastedText: function(title, content) {
        console.log(`Processing pasted text for book: ${title}`);
        
        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing text, please wait...</p>
        `;
        document.body.appendChild(loadingIndicator);
        
        try {
            // Split content into words
            const words = this.extractWords(content);
            
            if (words.length === 0) {
                alert('No readable content found in the pasted text. Please try again with different content.');
                document.body.removeChild(loadingIndicator);
                return;
            }
            
            // Update loading indicator
            loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Creating book with ${words.length} words...</p>
            `;
            
            // Create book data
            const bookData = {
                title: title,
                content: words,
                words: words,
                fileType: 'text',
                wordCount: words.length,
                processedAt: new Date().toISOString()
            };
            
            // Save book
            const savedBook = this.saveBook(bookData);
            
            // Clear form
            document.getElementById('book-title').value = '';
            document.getElementById('book-content').value = '';
            
            // Show success message
            alert(`Book "${title}" created successfully with ${words.length} words.`);
            
            // Remove loading indicator
            document.body.removeChild(loadingIndicator);
            
            // Refresh book list
            this.loadBookList();
            
        } catch (error) {
            console.error('Error processing pasted text:', error);
            alert('An error occurred while processing the text: ' + error.message);
            
            // Remove loading indicator
            if (loadingIndicator.parentNode) {
                document.body.removeChild(loadingIndicator);
            }
        }
    },
    
    // Extract words from text
    extractWords: function(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }
        
        // Clean text
        const cleanedText = this.filterUnnecessaryContent(text);
        
        // Split into words
        return cleanedText
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => word.trim());
    },
    
    // Filter unnecessary content
    filterUnnecessaryContent: function(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        // Replace multiple spaces with a single space
        let cleaned = text.replace(/\s+/g, ' ');
        
        // Remove special characters that aren't part of words
        cleaned = cleaned.replace(/[^\w\s.,;:!?'"()-]/g, '');
        
        // Remove excessive punctuation
        cleaned = cleaned.replace(/([.,;:!?])\1+/g, '$1');
        
        return cleaned.trim();
    },
    
    // Initialize upload area
    initUploadArea: function() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadArea || !fileInput) {
            console.error('Upload area or file input not found');
            return;
        }
        
        console.log('Initializing upload area with improved handling');
        
        // Clear any existing event listeners to prevent duplicates
        const newUploadArea = uploadArea.cloneNode(true);
        uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);
        
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        
        // File drag and drop events
        newUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.add('drag-over');
        }, false);
        
        newUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.remove('drag-over');
        }, false);
        
        newUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                // Immediate visual feedback
                newUploadArea.classList.add('uploading');
                
                // Use setTimeout to ensure the UI updates before processing
                setTimeout(() => {
                    this.handleFileUpload(e.dataTransfer.files[0]);
                }, 50);
            }
        }, false);
        
        // File selection event
        newUploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newFileInput.click();
        }, false);
        
        newFileInput.addEventListener('change', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (newFileInput.files.length) {
                // Immediate visual feedback
                newUploadArea.classList.add('uploading');
                
                // Use setTimeout to ensure the UI updates before processing
                setTimeout(() => {
                    this.handleFileUpload(newFileInput.files[0]);
                }, 50);
            }
        }, false);
        
        console.log('Upload area initialization complete with improved event handling');
    },
    
    // File upload process
    handleFileUpload: function(file) {
        // Check file type
        if (!this.supportedFileTypes.includes(file.type)) {
            alert('Unsupported file type. Please upload a PDF or TXT file.');
            return;
        }
        
        console.log(`Uploading file: ${file.name} (${file.type})`);
        
        // Disable file input to prevent multiple uploads
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.disabled = true;
        }
        
        // Disable upload area
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.add('uploading');
            uploadArea.style.pointerEvents = 'none';
        }
        
        // Loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing file, please wait...</p>
        `;
        document.body.appendChild(loadingIndicator);
        
        // Process based on file type
        try {
            if (file.type === 'application/pdf') {
                this.processPdfFile(file, loadingIndicator);
            } else if (file.type === 'text/plain') {
                this.processTxtFile(file, loadingIndicator);
            }
        } catch (error) {
            console.error('Error processing file:', error);
            alert('An error occurred while processing the file: ' + error.message);
            this.resetUploadArea(loadingIndicator);
        }
    },
    
    // Reset upload area after processing
    resetUploadArea: function(loadingIndicator) {
        // Remove loading indicator
        if (loadingIndicator && loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        // Re-enable file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.disabled = false;
            fileInput.value = ''; // Clear file input
        }
        
        // Re-enable upload area
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.remove('uploading');
            uploadArea.style.pointerEvents = 'auto';
        }
    },
    
    // Process PDF file
    processPdfFile: function(file, loadingIndicator) {
        console.log("Processing PDF file:", file.name);
        
        // Load PDF.js library
        this.loadPdfJsLibrary(() => {
            this.extractTextFromPdf(file, loadingIndicator);
        });
    },
    
    // Load PDF.js library
    loadPdfJsLibrary: function(callback) {
        if (window.pdfjsLib) {
            console.log("PDF.js already loaded");
            // Check and set worker source
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
            }
            callback();
            return;
        }
        
        console.log("Loading PDF.js from CDN...");
        
        // Load PDF.js worker script
        window.pdfjsLib = {
            GlobalWorkerOptions: { workerSrc: null }
        };
        
        // First load worker script
        const workerScript = document.createElement('script');
        workerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
        document.head.appendChild(workerScript);
        
        // Then load main PDF.js library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js';
        script.onload = () => {
            console.log("PDF.js loaded successfully");
            // Set worker source
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
            callback();
        };
        script.onerror = (error) => {
            console.error("Error loading PDF.js:", error);
            alert("Failed to load PDF processing library. Please check your internet connection and refresh the page.");
            if (loadingIndicator) {
                document.body.removeChild(loadingIndicator);
            }
        };
        document.head.appendChild(script);
    },
    
    // Extract text from PDF
    extractTextFromPdf: function(file, loadingIndicator) {
        console.log("Starting PDF text extraction for:", file.name);
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                console.log("FileReader loaded PDF data");
                const typedArray = new Uint8Array(event.target.result);
                
                // Load PDF with PDF.js
                console.log("Loading PDF with PDF.js...");
                const loadingTask = pdfjsLib.getDocument(typedArray);
                
                // Monitor progress
                loadingTask.onProgress = function(progressData) {
                    if (progressData.total > 0) {
                        const percent = (progressData.loaded / progressData.total) * 100;
                        console.log(`Loading PDF: ${percent.toFixed(1)}%`);
                        if (loadingIndicator) {
                            loadingIndicator.innerHTML = `
                                <div class="loading-spinner"></div>
                                <p>Loading PDF: ${percent.toFixed(1)}%</p>
                            `;
                        }
                    }
                };
                
                const pdf = await loadingTask.promise;
                console.log(`PDF loaded: ${pdf.numPages} pages`);
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Processing PDF: 0/${pdf.numPages} pages</p>
                    `;
                }
                
                // Process all pages and extract words
                const allWords = await this.processAllPdfPages(pdf, loadingIndicator);
                
                console.log(`Total ${allWords.length} words extracted.`);
                
                if (allWords.length === 0) {
                    console.error("No words could be extracted!");
                    alert('No words could be extracted from the PDF file. Please try another file.');
                    if (loadingIndicator) {
                        document.body.removeChild(loadingIndicator);
                    }
                    return;
                }
                
                // Save book
                console.log("Saving book...");
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Saving book (${allWords.length} words)...</p>
                    `;
                }
                
                // Set word count correctly
                const bookData = {
                    title: file.name.replace('.pdf', ''),
                    content: allWords,  // Store word array directly as content
                    words: allWords,    // Also store word array separately (for backward compatibility)
                    fileType: 'pdf',
                    fileSize: file.size,
                    wordCount: allWords.length, // Set word count correctly
                    processedAt: new Date().toISOString() // Add processing time
                };
                
                // Save book
                const savedBook = this.saveBook(bookData);
                
                console.log("PDF processing completed successfully.");
                
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
                
                // Reset upload area
                this.resetUploadArea();
                
                // Refresh book list
                this.loadBookList();
                
            } catch (error) {
                console.error('PDF processing error:', error);
                alert('An error occurred while processing the PDF file: ' + error.message);
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
                
                // Reset upload area
                this.resetUploadArea();
            }
        };
        
        reader.onerror = function(error) {
            console.error('FileReader error:', error);
            alert('File reading error: ' + error);
            if (loadingIndicator) {
                document.body.removeChild(loadingIndicator);
            }
            
            // Reset upload area
            this.resetUploadArea();
        };
        
        console.log("Reading PDF as ArrayBuffer...");
        reader.readAsArrayBuffer(file);
    },
    
    // Process TXT file
    processTxtFile: function(file, loadingIndicator) {
        console.log("Processing TXT file:", file.name);
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                console.log("FileReader loaded TXT data");
                const text = event.target.result;
                
                // Update loading indicator
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Processing text file...</p>
                    `;
                }
                
                // Extract words
                const words = this.extractWords(text);
                
                console.log(`Total ${words.length} words extracted.`);
                
                if (words.length === 0) {
                    console.error("No words could be extracted!");
                    alert('No words could be extracted from the text file. Please try another file.');
                    if (loadingIndicator) {
                        document.body.removeChild(loadingIndicator);
                    }
                    return;
                }
                
                // Save book
                console.log("Saving book...");
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Saving book (${words.length} words)...</p>
                    `;
                }
                
                // Set word count correctly
                const bookData = {
                    title: file.name.replace('.txt', ''),
                    content: words,  // Store word array directly as content
                    words: words,    // Also store word array separately (for backward compatibility)
                    fileType: 'txt',
                    fileSize: file.size,
                    wordCount: words.length, // Set word count correctly
                    processedAt: new Date().toISOString() // Add processing time
                };
                
                // Save book
                const savedBook = this.saveBook(bookData);
                
                console.log("TXT processing completed successfully.");
                
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
                
                // Reset upload area
                this.resetUploadArea();
                
                // Refresh book list
                this.loadBookList();
                
            } catch (error) {
                console.error('TXT processing error:', error);
                alert('An error occurred while processing the text file: ' + error.message);
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
                
                // Reset upload area
                this.resetUploadArea();
            }
        };
        
        reader.onerror = function(error) {
            console.error('FileReader error:', error);
            alert('File reading error: ' + error);
            if (loadingIndicator) {
                document.body.removeChild(loadingIndicator);
            }
            
            // Reset upload area
            this.resetUploadArea();
        };
        
        console.log("Reading TXT as text...");
        reader.readAsText(file);
    },
    
    // Save book to localStorage
    saveBook: function(bookData) {
        try {
            // Generate unique ID
            const id = 'book_' + new Date().getTime();
            
            // Add additional metadata
            const book = {
                id: id,
                title: bookData.title,
                content: bookData.content,
                words: bookData.words,
                fileType: bookData.fileType,
                fileSize: bookData.fileSize,
                wordCount: bookData.wordCount,
                addedAt: new Date().toISOString(),
                lastRead: null,
                progress: 0,
                bookmark: null,
                readingSpeed: 300, // Default reading speed
                completed: false
            };
            
            // Get existing books
            let books = [];
            try {
                books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            } catch (error) {
                console.error('Error loading books from localStorage:', error);
                books = [];
            }
            
            // Add new book
            books.push(book);
            
            // Save to localStorage
            localStorage.setItem('bookmark_books', JSON.stringify(books));
            
            console.log(`Book saved: ${book.title} (${book.wordCount} words)`);
            
            return book;
        } catch (error) {
            console.error('Error saving book:', error);
            throw error;
        }
    },
    
    // Load book list
    loadBookList: function() {
        console.log('Loading book list...');
        
        // Get book grid
        const bookGrid = document.getElementById('book-grid');
        const emptyLibrary = document.getElementById('empty-library');
        
        if (!bookGrid || !emptyLibrary) {
            console.error('Book grid or empty library message not found');
            return;
        }
        
        // Clear book grid
        bookGrid.innerHTML = '';
        
        // Get books from localStorage
        let books = [];
        try {
            books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
        } catch (error) {
            console.error('Error loading books from localStorage:', error);
            books = [];
        }
        
        // Check if library is empty
        if (books.length === 0) {
            bookGrid.style.display = 'none';
            emptyLibrary.style.display = 'block';
            return;
        }
        
        // Show book grid, hide empty message
        bookGrid.style.display = 'grid';
        emptyLibrary.style.display = 'none';
        
        // Apply filter
        const filterSelect = document.getElementById('filter-select');
        const filter = filterSelect ? filterSelect.value : 'all';
        
        let filteredBooks = books;
        if (filter === 'reading') {
            filteredBooks = books.filter(book => book.progress > 0 && !book.completed);
        } else if (filter === 'completed') {
            filteredBooks = books.filter(book => book.completed);
        }
        
        // Apply sort
        const sortSelect = document.getElementById('sort-select');
        const sort = sortSelect ? sortSelect.value : 'recent';
        
        if (sort === 'recent') {
            filteredBooks.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        } else if (sort === 'title') {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'progress') {
            filteredBooks.sort((a, b) => {
                const progressA = a.wordCount > 0 ? (a.progress / a.wordCount) : 0;
                const progressB = b.wordCount > 0 ? (b.progress / b.wordCount) : 0;
                return progressB - progressA;
            });
        }
        
        // Create book cards
        filteredBooks.forEach(book => {
            // Calculate progress percentage
            const progressPercentage = book.wordCount > 0 ? Math.min(Math.round((book.progress / book.wordCount) * 100), 100) : 0;
            
            // Create book card
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.setAttribute('data-id', book.id);
            
            // Create book card content
            bookCard.innerHTML = `
                <div class="book-cover">
                    <div class="book-progress" style="width: ${progressPercentage}%"></div>
                    <div class="book-icon">
                        <i class="fas fa-book"></i>
                    </div>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-stats">${book.wordCount.toLocaleString()} words</p>
                    <p class="book-progress-text">${progressPercentage}% complete</p>
                </div>
                <div class="book-actions">
                    <button class="book-action read-btn" title="Read">
                        <i class="fas fa-book-reader"></i>
                    </button>
                    <button class="book-action delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add book card to grid
            bookGrid.appendChild(bookCard);
            
            // Add event listeners
            const readBtn = bookCard.querySelector('.read-btn');
            const deleteBtn = bookCard.querySelector('.delete-btn');
            
            if (readBtn) {
                readBtn.addEventListener('click', () => {
                    this.openBook(book.id);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteBook(book.id);
                });
            }
            
            // Make entire card clickable
            bookCard.addEventListener('click', (e) => {
                // Ignore clicks on buttons
                if (e.target.closest('.book-action')) {
                    return;
                }
                
                this.openBook(book.id);
            });
        });
        
        console.log(`Book list loaded with ${filteredBooks.length} books`);
    },
    
    // Open book
    openBook: function(bookId) {
        console.log(`Opening book: ${bookId}`);
        
        // Save current book ID to localStorage
        localStorage.setItem('currentBookId', bookId);
        
        // Redirect to reader page
        window.location.href = 'reader.html?id=' + bookId;
    },
    
    // Delete book
    deleteBook: function(bookId) {
        console.log(`Deleting book: ${bookId}`);
        
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            return;
        }
        
        try {
            // Get books from localStorage
            let books = [];
            try {
                books = JSON.parse(localStorage.getItem('bookmark_books') || '[]');
            } catch (error) {
                console.error('Error loading books from localStorage:', error);
                books = [];
            }
            
            // Find book index
            const bookIndex = books.findIndex(book => book.id === bookId);
            
            if (bookIndex === -1) {
                console.error(`Book not found with ID: ${bookId}`);
                return;
            }
            
            // Remove book
            books.splice(bookIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('bookmark_books', JSON.stringify(books));
            
            console.log(`Book deleted: ${bookId}`);
            
            // Refresh book list
            this.loadBookList();
            
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('An error occurred while deleting the book: ' + error.message);
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    FileHandler.init();
    
    // Add event listeners for filter and sort
    const filterSelect = document.getElementById('filter-select');
    const sortSelect = document.getElementById('sort-select');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            FileHandler.loadBookList();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            FileHandler.loadBookList();
        });
    }
});
