// subscription.js - Subscription system for BookMark platform

const SubscriptionSystem = {
    // Subscription plans
    PLANS: {
        FREE: 'free',
        PREMIUM: 'premium'
    },
    
    // Storage key for subscription data
    STORAGE_KEY: 'bookmark_subscription',
    
    // Default subscription data
    defaultSubscription: {
        plan: 'free',
        startDate: null,
        expiryDate: null,
        paymentStatus: 'none'
    },
    
    // Get current subscription
    getCurrentSubscription: function() {
        const savedSubscription = localStorage.getItem(this.STORAGE_KEY);
        if (savedSubscription) {
            return JSON.parse(savedSubscription);
        }
        
        // Initialize with default subscription
        const defaultSub = { ...this.defaultSubscription };
        defaultSub.startDate = new Date().toISOString();
        this.saveSubscription(defaultSub);
        return defaultSub;
    },
    
    // Save subscription data
    saveSubscription: function(subscription) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscription));
        return true;
    },
    
    // Check if user is on premium plan
    isPremium: function() {
        const subscription = this.getCurrentSubscription();
        
        // Check if premium and not expired
        if (subscription.plan === this.PLANS.PREMIUM) {
            if (subscription.expiryDate) {
                const now = new Date();
                const expiryDate = new Date(subscription.expiryDate);
                return now < expiryDate;
            }
            return true; // No expiry date means lifetime premium
        }
        
        return false;
    },
    
    // Get book limit based on subscription - No limit for any plan
    getBookLimit: function() {
        return Infinity; // Always return unlimited books for all users
    },
    
    // Check if user can add more books - Always return true
    canAddMoreBooks: function() {
        return true; // Always allow adding more books
    },
    
    // Upgrade to premium (simulated)
    upgradeToPremium: function() {
        const subscription = this.getCurrentSubscription();
        
        // Set to premium plan
        subscription.plan = this.PLANS.PREMIUM;
        subscription.startDate = new Date().toISOString();
        
        // Set expiry date to 1 year from now
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        subscription.expiryDate = expiryDate.toISOString();
        
        subscription.paymentStatus = 'completed';
        
        this.saveSubscription(subscription);
        return true;
    },
    
    // Downgrade to free plan
    downgradeToFree: function() {
        const subscription = this.getCurrentSubscription();
        
        // Set to free plan
        subscription.plan = this.PLANS.FREE;
        subscription.startDate = new Date().toISOString();
        subscription.expiryDate = null;
        subscription.paymentStatus = 'none';
        
        this.saveSubscription(subscription);
        return true;
    },
    
    // Get subscription details for display
    getSubscriptionDetails: function() {
        const subscription = this.getCurrentSubscription();
        const isPremium = this.isPremium();
        
        return {
            plan: subscription.plan,
            isPremium: isPremium,
            startDate: subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A',
            expiryDate: subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A',
            bookLimit: 'Unlimited', // Always show unlimited books
            daysRemaining: subscription.expiryDate ? this.getDaysRemaining() : 'N/A'
        };
    },
    
    // Get days remaining in premium subscription
    getDaysRemaining: function() {
        const subscription = this.getCurrentSubscription();
        
        if (subscription.plan !== this.PLANS.PREMIUM || !subscription.expiryDate) {
            return 0;
        }
        
        const now = new Date();
        const expiryDate = new Date(subscription.expiryDate);
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 0 ? diffDays : 0;
    },
    
    // Initialize subscription system
    init: function() {
        console.log('Subscription system initialized');
        
        // Ensure we have subscription data
        this.getCurrentSubscription();
        
        // No need to hook into BookStorage to enforce limits
        // All users can add unlimited books
    }
};

// Initialize subscription system when the script loads
document.addEventListener('DOMContentLoaded', function() {
    SubscriptionSystem.init();
});
