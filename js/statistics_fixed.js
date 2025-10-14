// statistics_fixed.js - Fixed statistics tracking and visualization module
// BookMark - Mind Accelerating Reading Platform

// Statistics functions
const Statistics = {
    // Initialize function to run when page loads
    init: function() {
        console.log('Statistics module initializing...');
        
        // Load statistics summary
        this.loadStatsSummary();
        
        // Load charts
        this.loadCharts();
        
        // Load detailed statistics table
        this.loadStatsTable();
        
        console.log('Statistics module initialized.');
    },
    
    // Load statistics summary
    loadStatsSummary: function() {
        console.log('Loading statistics summary...');
        
        // Get summary cards
        const dailyWordsElement = document.getElementById('daily-words');
        const totalWordsElement = document.getElementById('total-words');
        const avgSpeedElement = document.getElementById('avg-speed');
        const bookCountElement = document.getElementById('book-count');
        
        // Check if elements exist
        if (!totalWordsElement) {
            console.error('Total words element not found');
        }
        if (!avgSpeedElement) {
            console.error('Average speed element not found');
        }
        if (!bookCountElement) {
            console.error('Book count element not found');
        }
        
        // Get statistics summary
        const summary = this.getSummaryStats();
        
        // Update values
        if (totalWordsElement) totalWordsElement.textContent = summary.totalWords.toLocaleString();
        if (avgSpeedElement) avgSpeedElement.textContent = summary.avgSpeed;
        if (bookCountElement) bookCountElement.textContent = summary.bookCount;
        
        // Update daily goal progress
        this.updateGoalProgress(summary.todayWords);
        
        console.log('Statistics summary loaded:', summary);
    },
    
    // Calculate statistics summary
    getSummaryStats: function() {
        console.log('Calculating statistics summary...');
        
        try {
            // Get books from localStorage
            const books = this.getAllBooks();
            
            // Get today's date
            const today = new Date().toISOString().split('T')[0];
            
            // Get reading sessions
            const sessions = this.getReadingSessions();
            
            // Calculate words read today
            const todaySessions = sessions.filter(session => {
                if (!session.date) return false;
                return session.date.startsWith(today);
            });
            const todayWords = todaySessions.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
            
            // Calculate total words read
            const totalWords = sessions.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
            
            // Calculate average reading speed
            let avgSpeed = 0;
            const speedSessions = sessions.filter(session => session.readingSpeed > 0);
            
            if (speedSessions.length > 0) {
                const totalSpeed = speedSessions.reduce((sum, session) => sum + session.readingSpeed, 0);
                avgSpeed = Math.round(totalSpeed / speedSessions.length);
            }
            
            // Count books
            const bookCount = books.length;
            
            return {
                todayWords,
                totalWords,
                avgSpeed,
                bookCount
            };
        } catch (error) {
            console.error('Error calculating statistics summary:', error);
            return {
                todayWords: 0,
                totalWords: 0,
                avgSpeed: 0,
                bookCount: 0
            };
        }
    },
    
    // Get all books from localStorage
    getAllBooks: function() {
        try {
            return JSON.parse(localStorage.getItem('bookmark_books') || '[]');
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    },
    
    // Get reading sessions from localStorage
    getReadingSessions: function() {
        try {
            return JSON.parse(localStorage.getItem('bookmark_reading_sessions') || '[]');
        } catch (error) {
            console.error('Error loading reading sessions:', error);
            return [];
        }
    },
    
    // Update daily goal progress
    updateGoalProgress: function(todayWords) {
        console.log('Updating goal progress with', todayWords, 'words');
        
        // Get goal elements
        const goalProgressBar = document.getElementById('goal-progress-bar');
        const goalText = document.getElementById('goal-text');
        
        if (!goalProgressBar || !goalText) {
            console.error('Goal progress elements not found');
            return;
        }
        
        // Get daily goal from settings (default: 1000 words)
        const dailyGoal = this.getDailyGoal();
        
        // Calculate progress percentage
        const percentage = Math.min(Math.round((todayWords / dailyGoal) * 100), 100);
        
        // Update progress bar
        goalProgressBar.style.width = percentage + '%';
        
        // Update progress text
        goalText.textContent = `${todayWords.toLocaleString()} / ${dailyGoal.toLocaleString()} words (${percentage}%)`;
        
        console.log('Goal progress updated:', percentage + '%');
    },
    
    // Get daily goal from settings
    getDailyGoal: function() {
        try {
            const settings = JSON.parse(localStorage.getItem('bookmarkSettings') || '{}');
            return settings.dailyGoal || 1000; // Default: 1000 words
        } catch (error) {
            console.error('Error loading settings:', error);
            return 1000; // Default: 1000 words
        }
    },
    
    // Load charts
    loadCharts: function() {
        console.log('Loading charts...');
        
        // Get weekly chart container
        const weeklyChart = document.getElementById('weekly-chart');
        
        if (!weeklyChart) {
            console.error('Weekly chart container not found');
            return;
        }
        
        // Get weekly data
        const weeklyData = this.getWeeklyData();
        
        // Create weekly chart
        this.createWeeklyChart(weeklyChart, weeklyData);
        
        console.log('Charts loaded');
    },
    
    // Get weekly reading data
    getWeeklyData: function() {
        try {
            // Create array for last 7 days
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                days.push({
                    date: date.toISOString().split('T')[0],
                    label: date.toLocaleDateString('en-US', { weekday: 'short' })
                });
            }
            
            // Get reading sessions
            const sessions = this.getReadingSessions();
            
            // Calculate words read for each day
            return days.map(day => {
                const daySessions = sessions.filter(session => {
                    if (!session.date) return false;
                    return session.date.startsWith(day.date);
                });
                
                const wordsRead = daySessions.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
                
                return {
                    label: day.label,
                    value: wordsRead
                };
            });
        } catch (error) {
            console.error('Error calculating weekly data:', error);
            return [
                { label: 'Mon', value: 0 },
                { label: 'Tue', value: 0 },
                { label: 'Wed', value: 0 },
                { label: 'Thu', value: 0 },
                { label: 'Fri', value: 0 },
                { label: 'Sat', value: 0 },
                { label: 'Sun', value: 0 }
            ];
        }
    },
    
    // Create weekly chart
    createWeeklyChart: function(container, data) {
        console.log('Creating weekly chart with data:', data);
        
        // Clear container
        container.innerHTML = '';
        
        // Find maximum value for scaling
        const maxValue = Math.max(...data.map(item => item.value), 100);
        
        // Create bars for each day
        data.forEach(item => {
            // Calculate height percentage (minimum 5% for visibility)
            const heightPercentage = item.value > 0 ? Math.max(5, (item.value / maxValue) * 100) : 5;
            
            // Create bar element
            const barElement = document.createElement('div');
            barElement.className = 'chart-bar';
            barElement.style.height = heightPercentage + '%';
            
            // Create value element
            const valueElement = document.createElement('div');
            valueElement.className = 'chart-value';
            valueElement.textContent = item.value.toLocaleString();
            
            // Create label element
            const labelElement = document.createElement('div');
            labelElement.className = 'chart-label';
            labelElement.textContent = item.label;
            
            // Add elements to bar
            barElement.appendChild(valueElement);
            barElement.appendChild(labelElement);
            
            // Add bar to container
            container.appendChild(barElement);
        });
        
        console.log('Weekly chart created');
    },
    
    // Load statistics table
    loadStatsTable: function() {
        console.log('Loading statistics table...');
        
        // Get table body
        const tableBody = document.getElementById('stats-table-body');
        
        if (!tableBody) {
            console.error('Statistics table body not found');
            return;
        }
        
        // Clear table
        tableBody.innerHTML = '';
        
        // Get books
        const books = this.getAllBooks();
        
        // Sort books by last read date (most recent first)
        books.sort((a, b) => {
            if (!a.lastRead) return 1;
            if (!b.lastRead) return -1;
            return new Date(b.lastRead) - new Date(a.lastRead);
        });
        
        // Add rows for each book
        books.forEach(book => {
            // Calculate progress percentage
            const totalWords = book.wordCount || (book.content ? book.content.length : 0);
            const wordsRead = book.progress || 0;
            const progressPercentage = totalWords > 0 ? Math.round((wordsRead / totalWords) * 100) : 0;
            
            // Create row
            const row = document.createElement('tr');
            
            // Add cells
            row.innerHTML = `
                <td>${book.title || 'Untitled Book'}</td>
                <td>${wordsRead.toLocaleString()}</td>
                <td>${totalWords.toLocaleString()}</td>
                <td>${progressPercentage}%</td>
                <td>${book.readingSpeed || 0} WPM</td>
            `;
            
            // Add row to table
            tableBody.appendChild(row);
        });
        
        // If no books, add message
        if (books.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">No books in your library yet.</td>';
            tableBody.appendChild(row);
        }
        
        console.log('Statistics table loaded with', books.length, 'books');
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    Statistics.init();
});
