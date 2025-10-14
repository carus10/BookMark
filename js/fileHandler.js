// fileHandler.js - File upload and processing module
// BookMark - Mind Accelerating Reading Platform

// File upload and processing functions
const FileHandler = {
    // Supported file types
    supportedFileTypes: ['application/pdf', 'text/plain'],
    
    // Initialization function to run when page loads
    init: function() {
        console.log('FileHandler module initializing...');
        
        // Initialize upload area
        this.initUploadArea();
        
        // Load book list
        this.loadBookList();
        
        console.log('FileHandler module initialized.');
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
                
            } catch (error) {
                console.error('PDF processing error:', error);
                alert('An error occurred while processing the PDF file: ' + error.message);
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
            }
        };
        
        reader.onerror = function(error) {
            console.error('FileReader error:', error);
            alert('File reading error: ' + error);
            if (loadingIndicator) {
                document.body.removeChild(loadingIndicator);
            }
        };
        
        console.log("Reading PDF as ArrayBuffer...");
        reader.readAsArrayBuffer(file);
    },
    
    // Process all PDF pages
    processAllPdfPages: async function(pdf, loadingIndicator) {
        console.log("Processing all PDF pages...");
        let allText = '';
        let allWords = [];
        
        // Improved front matter detection
        // Skip more initial pages for larger documents
        const skipInitialPages = Math.min(8, Math.floor(pdf.numPages * 0.12)); // Skip first 8 pages or 12% of total
        const startPage = skipInitialPages + 1;
        
        // Skip final pages that might contain back matter
        const skipFinalPages = Math.min(5, Math.floor(pdf.numPages * 0.08)); // Skip last 5 pages or 8% of total
        const endPage = pdf.numPages - skipFinalPages;
        
        console.log(`Skipping first ${skipInitialPages} pages as they likely contain front matter`);
        console.log(`Skipping last ${skipFinalPages} pages as they likely contain back matter`);
        
        // Process each page
        for (let i = startPage; i <= endPage; i++) {
            try {
                console.log(`Processing page: ${i}/${pdf.numPages}`);
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Processing PDF: ${i-startPage+1}/${endPage-startPage+1} pages</p>
                    `;
                }
                
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Extract page text
                let pageText = '';
                for (let j = 0; j < textContent.items.length; j++) {
                    const item = textContent.items[j];
                    pageText += item.str + ' ';
                }
                
                // More aggressive front/back matter detection
                if (this.isFrontOrBackMatter(pageText)) {
                    console.log(`Page ${i} appears to be front or back matter, skipping`);
                    continue;
                }
                
                // Check for national poems, pledges, or anthems
                if (this.isNationalContent(pageText)) {
                    console.log(`Page ${i} appears to contain national content, skipping`);
                    continue;
                }
                
                // Additional check for table of contents
                if (this.isTableOfContents(pageText)) {
                    console.log(`Page ${i} appears to be a table of contents, skipping`);
                    continue;
                }
                
                // Filter unnecessary content
                const cleanedText = this.filterUnnecessaryContent(pageText);
                
                // Split text into words
                const pageWords = this.extractWords(cleanedText);
                
                // Add words to main list
                allWords = allWords.concat(pageWords);
                
                // Also combine all text
                allText += pageText + '\n\n';
                
                // Show progress
                if ((i - startPage) % 5 === 0 || i === endPage) {
                    console.log(`Processing PDF: ${i}/${pdf.numPages} pages completed, ${allWords.length} words so far`);
                }
            } catch (pageError) {
                console.error(`Error processing page ${i}:`, pageError);
                // Continue processing other pages even if there's an error
                continue;
            }
        }
        
        // Clean all text once more and split into words
        const finalCleanedText = this.filterUnnecessaryContent(allText);
        
        // Final check for table of contents patterns in the combined text
        if (this.isTableOfContents(finalCleanedText)) {
            console.log("Table of contents patterns detected in combined text, applying additional filtering");
            // Apply more aggressive filtering to remove TOC-like content
            const lines = finalCleanedText.split('\n');
            const filteredLines = lines.filter(line => {
                // Filter out lines that look like TOC entries
                return !(
                    (/\d+\s*$/.test(line.trim())) || // Lines ending with numbers
                    (/[.]{3,}|[-]{3,}/.test(line) && /\d+/.test(line)) || // Lines with dots/dashes and numbers
                    (/^\s*\d+\.\s+/.test(line)) || // Lines starting with numbered items
                    (/^\s*[IVXivx]+\.\s+/.test(line)) // Lines starting with Roman numerals
                );
            });
            const extraFilteredText = filteredLines.join('\n');
            const finalWords = this.extractWords(extraFilteredText);
            
            if (finalWords.length > 0) {
                console.log(`After additional TOC filtering: ${finalWords.length} words`);
                return finalWords;
            }
        }
        
        const finalWords = this.extractWords(finalCleanedText);
        
        // If page-by-page processing found fewer words, use words extracted from all text
        if (finalWords.length > allWords.length) {
            console.log(`Full text processing found more words: ${finalWords.length} > ${allWords.length}`);
            return finalWords;
        }
        
        // Ensure we have a reasonable number of words
        if (allWords.length < 20) {
            // Try a more aggressive approach - just split by spaces
            const simpleWords = allText.split(/\s+/).filter(word => word.trim().length > 0);
            
            if (simpleWords.length > allWords.length) {
                console.log(`Simple extraction found more words: ${simpleWords.length} > ${allWords.length}`);
                return simpleWords;
            }
        }
        
        return allWords;
    },
    
    // Check if text appears to contain national content
    isNationalContent: function(text) {
        if (!text || typeof text !== 'string') return false;
        
        // Convert to lowercase for case-insensitive matching
        const lowerText = text.toLowerCase();
        
        // Common national content indicators - expanded list
        const nationalContentIndicators = [
            'national anthem', 'pledge of allegiance', 'gençliğe hitabe',
            'istiklal marşı', 'national pledge', 'oath of allegiance',
            'constitution preamble', 'declaration of independence',
            'andımız', 'türk bayrağı', 'flag code', 'national emblem',
            'milli marş', 'atatürk', 'cumhuriyet', 'republic', 'national symbol',
            'national motto', 'national flower', 'national bird', 'national animal',
            'national holiday', 'independence day', 'republic day', 'national day',
            'sovereignty', 'egemenlik', 'bağımsızlık', 'özgürlük', 'vatan', 'millet'
        ];
        
        // Check for national content indicators
        for (const indicator of nationalContentIndicators) {
            if (lowerText.includes(indicator)) {
                console.log(`National content indicator found: "${indicator}"`);
                return true;
            }
        }
        
        // Check for specific Turkish national content patterns
        const turkishPatterns = [
            /türk\s+(?:milleti|ulusu|halk[ıi])/i,
            /ey\s+türk\s+gençliği/i,
            /birinci\s+(?:vazife|görev)/i,
            /ne\s+mutlu\s+türk/i,
            /vatan\s+(?:sağolsun|için)/i,
            /bayrak\s+(?:yasası|kanunu)/i,
            /milli\s+(?:değerler|semboller)/i
        ];
        
        for (const pattern of turkishPatterns) {
            if (pattern.test(text)) {
                console.log(`Turkish national content pattern matched: ${pattern}`);
                return true;
            }
        }
        
        // Check for text that looks like a pledge or anthem
        if ((lowerText.includes('ey') || lowerText.includes('ah') || lowerText.includes('oh')) && 
            (lowerText.includes('!') || lowerText.includes('?')) && 
            (lowerText.length < 1000) && 
            (lowerText.split('\n').length > 3)) {
            console.log('Text appears to be a pledge or anthem based on structure');
            return true;
        }
        
        return false;
    },
    
    // Check if text appears to be front or back matter
    isFrontOrBackMatter: function(text) {
        if (!text || typeof text !== 'string') return false;
        
        // Convert to lowercase for case-insensitive matching
        const lowerText = text.toLowerCase();
        
        // Common front matter indicators - expanded list
        const frontMatterIndicators = [
            'table of contents', 'contents', 'preface', 'foreword', 'introduction',
            'acknowledgments', 'acknowledgements', 'dedication', 'copyright',
            'about the author', 'about this book', 'isbn', 'published by',
            'all rights reserved', 'legal notice', 'disclaimer', 'national anthem',
            'title page', 'copyright page', 'publisher information', 'publication data',
            'cataloging-in-publication', 'library of congress', 'printed in', 'edition notice',
            'editorial team', 'cover design', 'cover art', 'cover photo', 'cover image',
            'series page', 'also by', 'other books by', 'praise for', 'içindekiler',
            'önsöz', 'giriş', 'teşekkür', 'yazar hakkında', 'kitap hakkında', 'basım',
            'telif hakkı', 'tüm hakları saklıdır', 'yasal uyarı', 'kapak tasarımı'
        ];
        
        // Common back matter indicators - expanded list
        const backMatterIndicators = [
            'appendix', 'glossary', 'bibliography', 'references', 'index',
            'about the author', 'acknowledgments', 'acknowledgements', 'afterword',
            'epilogue', 'conclusion', 'notes', 'endnotes', 'footnotes', 'sources',
            'further reading', 'recommended reading', 'works cited', 'permissions',
            'photo credits', 'image credits', 'illustration credits', 'about the publisher',
            'about the type', 'colophon', 'also available', 'coming soon', 'preview of',
            'sözlük', 'kaynakça', 'referanslar', 'dizin', 'notlar', 'son notlar',
            'kaynaklar', 'önerilen okumalar', 'yayıncı hakkında', 'fotoğraf kredileri'
        ];
        
        // Check for front matter indicators
        for (const indicator of frontMatterIndicators) {
            if (lowerText.includes(indicator)) {
                console.log(`Front matter indicator found: "${indicator}"`);
                return true;
            }
        }
        
        // Check for back matter indicators
        for (const indicator of backMatterIndicators) {
            if (lowerText.includes(indicator)) {
                console.log(`Back matter indicator found: "${indicator}"`);
                return true;
            }
        }
        
        // Check for page numbers or headers/footers
        const pageNumberPattern = /page\s+\d+|\d+\s+of\s+\d+|\bpage\b|\bchapter\b|sayfa\s+\d+|\bbölüm\b/i;
        if (pageNumberPattern.test(lowerText) && lowerText.length < 200) {
            console.log('Page appears to be just a header/footer or page number');
            return true;
        }
        
        // Check for very short pages that might be section dividers
        if (lowerText.trim().length < 100 && lowerText.split(/\s+/).length < 15) {
            console.log('Page appears to be a section divider or blank page');
            return true;
        }
        
        // Check for table of contents patterns
        if (this.isTableOfContents(text)) {
            console.log('Page appears to be a table of contents');
            return true;
        }
        
        return false;
    },
    
    // Special function to detect table of contents
    isTableOfContents: function(text) {
        if (!text || typeof text !== 'string') return false;
        
        const lowerText = text.toLowerCase();
        
        // Check for common TOC patterns
        
        // Pattern 1: Multiple lines with page numbers at the end
        const pageNumberLines = text.split('\n')
            .filter(line => line.trim().length > 0)
            .filter(line => /\d+\s*$/.test(line.trim()));
            
        if (pageNumberLines.length >= 3 && pageNumberLines.length >= text.split('\n').filter(line => line.trim().length > 0).length * 0.5) {
            console.log('Table of contents detected: Multiple lines with page numbers');
            return true;
        }
        
        // Pattern 2: Dots or dashes connecting text to numbers (........ 42)
        if (/[.]{3,}|[-]{3,}/.test(text) && /\d+\s*$/.test(text)) {
            console.log('Table of contents detected: Connecting dots or dashes');
            return true;
        }
        
        // Pattern 3: Chapter/section numbering patterns
        const chapterPatterns = [
            /chapter\s+\d+/i, 
            /section\s+\d+/i, 
            /part\s+\d+/i,
            /bölüm\s+\d+/i,
            /kısım\s+\d+/i,
            /\d+\.\s+[A-Za-zÇçĞğİıÖöŞşÜü]/,  // Numbered items like "1. Introduction"
            /[IVXivx]+\.\s+[A-Za-zÇçĞğİıÖöŞşÜü]/  // Roman numerals like "IV. Chapter"
        ];
        
        let chapterMatches = 0;
        for (const pattern of chapterPatterns) {
            const matches = lowerText.match(pattern) || [];
            chapterMatches += matches.length;
        }
        
        if (chapterMatches >= 3) {
            console.log('Table of contents detected: Multiple chapter/section patterns');
            return true;
        }
        
        // Pattern 4: Hierarchical numbering (1.1, 1.2, etc.)
        const hierarchicalMatches = lowerText.match(/\d+\.\d+/g) || [];
        if (hierarchicalMatches.length >= 3) {
            console.log('Table of contents detected: Hierarchical numbering');
            return true;
        }
        
        return false;
    },
    
    // Process TXT file
    processTxtFile: function(file, loadingIndicator) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Cleaning text and extracting words...</p>
                    `;
                }
                
                // Filter unnecessary sections
                const cleanedText = this.filterUnnecessaryContent(text);
                
                // Split text into words
                const words = this.extractWords(cleanedText);
                
                console.log(`Total ${words.length} words extracted.`);
                
                // Ensure we have a reasonable number of words
                let finalWords = words;
                if (words.length < 20) {
                    // Try a more aggressive approach - just split by spaces
                    const simpleWords = text.split(/\s+/).filter(word => word.trim().length > 0);
                    
                    if (simpleWords.length > words.length) {
                        console.log(`Simple extraction found more words: ${simpleWords.length} > ${words.length}`);
                        finalWords = simpleWords;
                    }
                }
                
                if (loadingIndicator) {
                    loadingIndicator.innerHTML = `
                        <div class="loading-spinner"></div>
                        <p>Saving book (${finalWords.length} words)...</p>
                    `;
                }
                
                // Save book
                this.saveBook({
                    title: file.name.replace('.txt', ''),
                    content: finalWords,  // Store word array directly as content
                    words: finalWords,    // Also store word array separately (for backward compatibility)
                    fileType: 'txt',
                    fileSize: file.size,
                    wordCount: finalWords.length, // Set word count correctly
                    processedAt: new Date().toISOString() // Add processing time
                });
                
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
                
            } catch (error) {
                console.error('TXT processing error:', error);
                alert('An error occurred while processing the TXT file.');
                if (loadingIndicator) {
                    document.body.removeChild(loadingIndicator);
                }
            }
        };
        
        reader.readAsText(file);
    },
    
    // Filter unnecessary content (preface, table of contents, etc.)
    filterUnnecessaryContent: function(text) {
        if (!text || typeof text !== 'string') {
            console.error("Invalid text input for filtering");
            return '';
        }
        
        // Enhanced filtering approach
        let cleanedText = text;
        
        // Detect and remove table of contents (more comprehensive)
        cleanedText = cleanedText.replace(/TABLE OF CONTENTS[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/CONTENTS[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Contents[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/İçindekiler[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        
        // Detect and remove preface
        cleanedText = cleanedText.replace(/PREFACE[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Preface[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/FOREWORD[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Foreword[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/INTRODUCTION[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Introduction[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Önsöz[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        cleanedText = cleanedText.replace(/Giriş[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        
        // Detect and remove acknowledgments
        cleanedText = cleanedText.replace(/ACKNOWLEDGMENTS[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Acknowledgments[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/ACKNOWLEDGEMENTS[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Acknowledgements[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Teşekkür[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        
        // Detect and remove copyright and publishing info
        cleanedText = cleanedText.replace(/COPYRIGHT[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Copyright[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/PUBLISHED BY[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Published by[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/ISBN[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Telif Hakkı[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        
        // Detect and remove references and appendices
        cleanedText = cleanedText.replace(/REFERENCES[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/References[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/BIBLIOGRAPHY[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Bibliography[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/APPENDIX[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Appendix[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/Kaynakça[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        cleanedText = cleanedText.replace(/Ek[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        
        // Detect and remove national anthem or similar non-content sections
        cleanedText = cleanedText.replace(/İSTİKLAL MARŞI[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        cleanedText = cleanedText.replace(/İstiklal Marşı[\s\S]*?(?=\n\n\w)/gi, ''); // Turkish
        cleanedText = cleanedText.replace(/NATIONAL ANTHEM[\s\S]*?(?=\n\n\w)/gi, '');
        cleanedText = cleanedText.replace(/National Anthem[\s\S]*?(?=\n\n\w)/gi, '');
        
        // Remove page numbers
        cleanedText = cleanedText.replace(/\b\d+\b(?:\s*\|\s*\d+)?/g, '');
        cleanedText = cleanedText.replace(/Page\s+\d+\s+of\s+\d+/gi, '');
        cleanedText = cleanedText.replace(/Sayfa\s+\d+/gi, ''); // Turkish
        
        // Remove headers and footers (often contain page numbers or chapter titles)
        cleanedText = cleanedText.replace(/^.{1,50}(?:\n|$)/gm, function(match) {
            // Check if this short line is likely a header/footer
            if (/chapter|page|section|\d+\s*of\s*\d+|bölüm|sayfa|kısım/i.test(match)) {
                return '';
            }
            return match;
        });
        
        // Clean up extra spaces
        cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
        cleanedText = cleanedText.replace(/\s{2,}/g, ' ');
        
        return cleanedText;
    },
    
    // Extract words from text
    extractWords: function(text) {
        if (!text || typeof text !== 'string') {
            console.error("Invalid text input for word extraction");
            return [];
        }
        
        // First try: standard approach with punctuation removal
        const words = text
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => {
                // Filter out empty words and words consisting only of numbers
                return word.length > 0 && !/^\d+$/.test(word);
            });
        
        // If we got very few words, try a simpler approach
        if (words.length < 20) {
            console.warn("Very few words extracted, using alternative method");
            
            // Second try: simple split by whitespace
            const simpleWords = text.split(/\s+/).filter(word => word.trim().length > 0);
            
            if (simpleWords.length > words.length) {
                console.log(`Simple extraction found more words: ${simpleWords.length} > ${words.length}`);
                return simpleWords;
            }
            
            // Third try: even more aggressive approach - split by any non-alphanumeric character
            if (simpleWords.length < 20) {
                const aggressiveWords = text
                    .replace(/[^a-zA-Z0-9\s]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .split(' ')
                    .filter(word => word.trim().length > 0);
                
                if (aggressiveWords.length > simpleWords.length) {
                    console.log(`Aggressive extraction found more words: ${aggressiveWords.length} > ${simpleWords.length}`);
                    return aggressiveWords;
                }
            }
        }
        
        return words;
    },
    
    // Count words
    countWords: function(text) {
        if (!text || typeof text !== 'string') return 0;
        return text.split(/\s+/).filter(word => word.trim().length > 0).length;
    },
    
    // Save book
    saveBook: function(bookData) {
        // Set word count correctly
        if (bookData.content && Array.isArray(bookData.content)) {
            bookData.wordCount = bookData.content.length;
        } else if (bookData.words && Array.isArray(bookData.words)) {
            bookData.wordCount = bookData.words.length;
        }
        
        console.log("Saving book with word count:", bookData.wordCount);
        
        // Save book to localStorage
        const book = BookStorage.addBook(bookData);
        
        // Update book list
        this.loadBookList();
        
        alert(`"${book.title}" successfully uploaded. (${book.wordCount} words)`);
        
        return book;
    },
    
    // Load book list
    loadBookList: function() {
        const bookGrid = document.getElementById('book-grid');
        const emptyLibrary = document.getElementById('empty-library');
        
        if (!bookGrid) return;
        
        // Get all books
        const books = BookStorage.getAllBooks();
        
        // Check for empty library
        if (books.length === 0) {
            if (emptyLibrary) emptyLibrary.style.display = 'block';
            bookGrid.innerHTML = '';
            return;
        }
        
        // Hide empty library message
        if (emptyLibrary) emptyLibrary.style.display = 'none';
        
        // Create book cards
        let booksHTML = '';
        
        books.forEach(book => {
            // Check and update word count
            const wordCount = book.wordCount || (book.content ? book.content.length : 0) || (book.words ? book.words.length : 0) || 0;
            
            booksHTML += `
                <div class="book-card" data-id="${book.id}">
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-meta">
                            <span class="book-type">${book.fileType.toUpperCase()}</span>
                            <span class="book-size">${this.formatFileSize(book.fileSize)}</span>
                            <span class="book-date">${this.formatDate(book.uploadDate)}</span>
                            <span class="book-words">${wordCount} words</span>
                        </p>
                    </div>
                    <div class="book-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${book.progress || 0}%"></div>
                        </div>
                        <span class="progress-text">${book.progress || 0}%</span>
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary btn-read" data-id="${book.id}">Read</button>
                        <button class="btn btn-danger btn-delete" data-id="${book.id}">Delete</button>
                    </div>
                </div>
            `;
        });
        
        bookGrid.innerHTML = booksHTML;
        
        // Add book card events
        this.addBookCardEvents();
    },
    
    // Add book card events
    addBookCardEvents: function() {
        // Read buttons
        const readButtons = document.querySelectorAll('.btn-read');
        readButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                
                const bookId = e.target.getAttribute('data-id');
                // Save book ID to localStorage (to be used in reader.js)
                localStorage.setItem('currentBookId', bookId);
                
                // Add reading mode to URL
                const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
                const readingMode = settings.defaultMode || 1;
                
                window.location.href = `reader.html?id=${bookId}&mode=${readingMode}`;
            });
        });
        
        // Delete buttons
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                
                const bookId = e.target.getAttribute('data-id');
                const book = BookStorage.getBookById(bookId);
                
                if (book && confirm(`Are you sure you want to delete "${book.title}"?`)) {
                    const result = BookStorage.deleteBook(bookId);
                    console.log("Book deletion result:", result);
                    this.loadBookList(); // Reload book list
                    alert(`"${book.title}" has been successfully deleted.`);
                }
            });
        });
        
        // Make entire book card clickable for reading
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Only trigger if the click was not on a button
                if (!e.target.closest('.btn')) {
                    const bookId = card.getAttribute('data-id');
                    localStorage.setItem('currentBookId', bookId);
                    
                    // Add reading mode to URL
                    const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
                    const readingMode = settings.defaultMode || 1;
                    
                    window.location.href = `reader.html?id=${bookId}&mode=${readingMode}`;
                }
            });
        });
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    },
    
    // Format date
    formatDate: function(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

// Initialize FileHandler when page loads
document.addEventListener('DOMContentLoaded', function() {
    FileHandler.init();
});
