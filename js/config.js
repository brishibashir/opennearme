// ============================================
// config.js - إعدادات Supabase
// OpenNearMe.online
// ============================================

const SUPABASE_CONFIG = {
    SUPABASE_URL: 'https://mozzwbvoywtohixylgsp.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_rCVLQUhej25Uyiz95pltAA_Wk9UF6YS',
    
    LANGUAGE: 'en',
    ITEMS_PER_PAGE: 20,
    CACHE_DURATION: 3600000,
    
    TABLES: {
        CONTINENTS: 'continents',
        COUNTRIES: 'countries',
        STATES: 'states',
        CITIES: 'cities',
        CATEGORIES: 'categories',
        BUSINESSES: 'businesses',
        REVIEWS: 'reviews',
        USER_PROFILES: 'user_profiles'
    }
};

function validateConfig() {
    if (SUPABASE_CONFIG.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
        console.error('❌ Please update SUPABASE_URL in config.js');
        return false;
    }
    if (SUPABASE_CONFIG.SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')) {
        console.error('❌ Please update SUPABASE_ANON_KEY in config.js');
        return false;
    }
    return true;
}
