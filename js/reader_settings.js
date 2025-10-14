// reader_settings.js - Improved settings functionality for BookMark platform

document.addEventListener('DOMContentLoaded', function() {
    console.log("Reader Settings JS loaded");
    
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
    const settingsBtn = document.getElementById('settings-btn');
    const settingsIcon = document.getElementById('settings-icon');
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
    let readingSpeed = 300; // WPM
    let readingMode = 1; // 1: Classic RSVP, 2: Book Simulation
    let wordsPerView = 1; // For Mode 2
    
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
    if (settingsBtn) settingsBtn.addEventListener('click', openPreferences);
    if (settingsIcon) settingsIcon.addEventListener('click', openPreferences);
    
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
        console.log("Initializing reader settings");
        
        // Load user preferences
        loadPreferences();
        
        // Apply preferences to UI
        applyPreferencesToUI();
        
        console.log("Reader settings initialization complete");
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
        
        // Apply window size
        if (readerDisplay) {
            const [width, height] = preferences.windowSize.split('x');
            readerDisplay.style.width = width + 'px';
            readerDisplay.style.height = height + 'px';
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
            case 's':
                // S key - settings
                openPreferences();
                break;
        }
    }
});
