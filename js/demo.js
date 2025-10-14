// demo.js - Demo functionality for BookMark platform

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const demoDisplay = document.getElementById('demo-display');
    const demoWord = document.getElementById('demo-word');
    const demoStartBtn = document.getElementById('demo-start');
    const demoSpeedSlider = document.getElementById('demo-speed');
    const demoSpeedValue = document.getElementById('demo-speed-value');
    const readingModeTabs = document.querySelectorAll('.reading-mode-tab');

    // Variables
    let isPlaying = false;
    let intervalId = null;
    let currentIndex = 0;
    let readingSpeed = 300; // WPM
    let readingMode = 1; // 1: Classic RSVP, 2: Book Simulation
    let currentPosition = 0; // Position for sequential word animation
    
    // Create book mode container for sequential words
    const bookModeContainer = document.createElement('div');
    bookModeContainer.className = 'book-mode-container';
    bookModeContainer.style.display = 'none';
    demoDisplay.appendChild(bookModeContainer);
    
    // Create sequential word element
    const sequentialWordElement = document.createElement('div');
    sequentialWordElement.className = 'sequential-word';
    bookModeContainer.appendChild(sequentialWordElement);
    
    // Demo text
    const demoText = [
        "Welcome", "to", "BookMark", "the", "mind", "accelerating", "reading", 
        "platform", "that", "helps", "you", "read", "faster", "and", "comprehend", 
        "better", "This", "demo", "shows", "how", "the", "reading", "experience", 
        "works", "You", "can", "choose", "between", "two", "different", "modes", 
        "and", "adjust", "the", "reading", "speed", "to", "your", "preference"
    ];

    // Event Listeners
    demoStartBtn.addEventListener('click', toggleDemo);
    demoSpeedSlider.addEventListener('input', updateSpeed);
    
    readingModeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            readingModeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            readingMode = parseInt(this.dataset.mode);
            
            // Update display based on mode
            if (readingMode === 2) {
                demoDisplay.classList.add('book-simulation');
                demoWord.style.display = 'none';
                bookModeContainer.style.display = 'flex';
            } else {
                demoDisplay.classList.remove('book-simulation');
                demoWord.style.display = 'block';
                bookModeContainer.style.display = 'none';
            }
            
            // Reset demo
            resetDemo();
        });
    });

    // Functions
    function toggleDemo() {
        if (isPlaying) {
            pauseDemo();
            demoStartBtn.innerHTML = '<i class="fas fa-play"></i> Start Demo';
        } else {
            startDemo();
            demoStartBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Demo';
        }
    }

    function startDemo() {
        isPlaying = true;
        
        // Reset if at end
        if (currentIndex >= demoText.length) {
            currentIndex = 0;
            currentPosition = 0;
        }
        
        // Calculate interval based on WPM
        const interval = 60000 / readingSpeed;
        
        // Start interval
        intervalId = setInterval(displayNextWord, interval);
    }

    function pauseDemo() {
        isPlaying = false;
        clearInterval(intervalId);
    }

    function resetDemo() {
        pauseDemo();
        currentIndex = 0;
        currentPosition = 0;
        demoStartBtn.innerHTML = '<i class="fas fa-play"></i> Start Demo';
        
        // Reset display
        if (readingMode === 1) {
            demoWord.style.display = 'block';
            bookModeContainer.style.display = 'none';
            demoWord.innerHTML = '<span>Tap</span> <span class="orp">s</span><span>tart</span> <span>to</span> <span>see</span> <span>speed</span> <span>reading</span> <span>in</span> <span>action</span>';
        } else {
            demoWord.style.display = 'none';
            bookModeContainer.style.display = 'flex';
            sequentialWordElement.innerHTML = 'Tap start to see book simulation mode';
            sequentialWordElement.style.left = '10%';
        }
        
        // Set background color to black for mode 2
        if (readingMode === 2) {
            demoDisplay.style.backgroundColor = '#000000';
            demoWord.style.color = '#FFFFFF';
            sequentialWordElement.style.color = '#FFFFFF';
        } else {
            demoDisplay.style.backgroundColor = '';
            demoWord.style.color = '';
        }
    }

    function updateSpeed() {
        readingSpeed = parseInt(this.value);
        demoSpeedValue.textContent = readingSpeed;
        
        // If currently playing, restart with new speed
        if (isPlaying) {
            pauseDemo();
            startDemo();
        }
    }

    function displayNextWord() {
        if (currentIndex >= demoText.length) {
            pauseDemo();
            demoStartBtn.innerHTML = '<i class="fas fa-play"></i> Start Demo';
            return;
        }
        
        const word = demoText[currentIndex];
        
        if (readingMode === 1) {
            // Classic RSVP mode - highlight ORP (Optimal Recognition Point)
            const orpIndex = Math.floor(word.length / 3);
            let displayWord = '';
            
            for (let i = 0; i < word.length; i++) {
                if (i === orpIndex) {
                    displayWord += `<span class="orp">${word[i]}</span>`;
                } else {
                    displayWord += word[i];
                }
            }
            
            demoWord.innerHTML = displayWord;
            demoWord.classList.remove('book-slide-animation');
            demoWord.classList.add('word-animation');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                demoWord.classList.remove('word-animation');
            }, 100);
            
        } else {
            // Book Simulation mode - show sequential words with left-to-right animation
            const currentWord = demoText[currentIndex];
            const orpIndex = Math.floor(currentWord.length / 3);
            
            let formattedWord = '';
            for (let j = 0; j < currentWord.length; j++) {
                if (j === orpIndex) {
                    formattedWord += `<span class="orp">${currentWord[j]}</span>`;
                } else {
                    formattedWord += currentWord[j];
                }
            }
            
            // Calculate new position for sequential word
            // If we're at the end of the screen, reset to the beginning
            if (currentPosition > 60) {
                currentPosition = 0;
            }
            
            // Update sequential word element
            sequentialWordElement.innerHTML = formattedWord;
            sequentialWordElement.style.left = `${currentPosition}%`;
            sequentialWordElement.classList.remove('sequential-word-animation');
            void sequentialWordElement.offsetWidth; // Force reflow to restart animation
            sequentialWordElement.classList.add('sequential-word-animation');
            
            // Increment position for next word
            currentPosition += 20;
        }
        
        currentIndex++;
    }
    
    // Initialize demo display
    resetDemo();
});
