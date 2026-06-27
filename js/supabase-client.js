// ============================================
// supabase-client.js - اتصال Supabase
// OpenNearMe.online
// ============================================

// تحميل مكتبة Supabase تلقائياً
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        console.log('✅ Supabase library loaded');
        initSupabase();
    };
    script.onerror = () => {
        console.error('❌ Failed to load Supabase library');
    };
    document.head.appendChild(script);
})();

let supabase = null;

function initSupabase() {
    if (typeof validateConfig !== 'undefined' && !validateConfig()) {
        console.error('❌ Invalid Supabase configuration');
        return;
    }
    
    supabase = window.supabase.createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client initialized');
    console.log('🔗 URL:', SUPABASE_CONFIG.SUPABASE_URL);
}

// انتظار تهيئة العميل
function waitForClient() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            if (supabase) {
                resolve(supabase);
            } else if (attempts++ < 50) {
                setTimeout(check, 100);
            } else {
                reject(new Error('Supabase client not initialized'));
            }
        };
        check();
    });
}

// ============================================
// دوال القارات
// ============================================

async function getAllContinents() {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CONTINENTS)
        .select('*')
        .order('name');
    
    if (error) throw error;
    return data;
}

async function getContinentById(id) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CONTINENTS)
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال الدول
// ============================================

async function getCountriesByContinent(continentId) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.COUNTRIES)
        .select('*')
        .eq('continent_id', continentId)
        .order('name');
    
    if (error) throw error;
    return data;
}

async function getCountryById(id) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.COUNTRIES)
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

async function searchCountries(query) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.COUNTRIES)
        .select('*')
        .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .order('name')
        .limit(20);
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال الولايات
// ============================================

async function getStatesByCountry(countryId) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.STATES)
        .select('*')
        .eq('country_id', countryId)
        .order('name');
    
    if (error) throw error;
    return data;
}

async function getStateById(id) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.STATES)
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال المدن
// ============================================

async function getCitiesByState(stateId, limit = 50) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CITIES)
        .select('*')
        .eq('state_id', stateId)
        .order('name')
        .limit(limit);
    
    if (error) throw error;
    return data;
}

async function getCitiesByCountry(countryId, limit = 50) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CITIES)
        .select('*')
        .eq('country_id', countryId)
        .order('name')
        .limit(limit);
    
    if (error) throw error;
    return data;
}

async function searchCities(query, limit = 20) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CITIES)
        .select('*, countries(name, emoji), states(name)')
        .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .order('name')
        .limit(limit);
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال التصنيفات
// ============================================

async function getAllCategories() {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CATEGORIES)
        .select('*')
        .order('name');
    
    if (error) throw error;
    return data;
}

async function getCategoryById(id) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.CATEGORIES)
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال الأنشطة التجارية
// ============================================

async function getBusinesses(filters = {}) {
    const client = await waitForClient();
    let query = client
        .from(SUPABASE_CONFIG.TABLES.BUSINESSES)
        .select('*, categories(name, emoji), cities(name), countries(name, emoji)')
        .eq('status', 'approved');
    
    if (filters.continentId) {
        query = query.eq('continent_id', filters.continentId);
    }
    if (filters.countryId) {
        query = query.eq('country_id', filters.countryId);
    }
    if (filters.stateId) {
        query = query.eq('state_id', filters.stateId);
    }
    if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
    }
    if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
    }
    if (filters.openNow) {
        query = query.eq('is_open_now', true);
    }
    if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
    }
    
    query = query.order('rating', { ascending: false })
                 .limit(filters.limit || SUPABASE_CONFIG.ITEMS_PER_PAGE);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

async function getBusinessById(id) {
    const client = await waitForClient();
    const { data, error } = await client
        .from(SUPABASE_CONFIG.TABLES.BUSINESSES)
        .select('*, categories(name, emoji), cities(name), states(name), countries(name, emoji), continents(name)')
        .eq('id', id)
        .eq('status', 'approved')
        .single();
    
    if (error) throw error;
    return data;
}

// ============================================
// دوال البحث المتقدم
// ============================================

async function advancedSearch({ continent, country, state, city, category, openNow, query }) {
    const filters = {};
    
    if (continent) filters.continentId = continent;
    if (country) filters.countryId = country;
    if (state) filters.stateId = state;
    if (city) filters.cityId = city;
    if (category) filters.categoryId = category;
    if (openNow) filters.openNow = true;
    if (query) filters.search = query;
    
    return await getBusinesses(filters);
}

// ============================================
// دوال المصادقة
// ============================================

async function signUp(email, password, userData = {}) {
    const client = await waitForClient();
    const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
            data: userData
        }
    });
    
    if (error) throw error;
    return data;
}

async function signIn(email, password) {
    const client = await waitForClient();
    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) throw error;
    return data;
}

async function signOut() {
    const client = await waitForClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
}

async function getCurrentUser() {
    const client = await waitForClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw error;
    return user;
}

async function signInWithGoogle() {
    const client = await waitForClient();
    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) throw error;
    return data;
}

// ============================================
// دوال مساعدة
// ============================================

// تحميل البيانات مع التخزين المؤقت
async function fetchWithCache(key, fetchFn, duration = SUPABASE_CONFIG.CACHE_DURATION) {
    const cacheKey = `cache_${key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < duration) {
            return data;
        }
    }
    
    const data = await fetchFn();
    localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now()
    }));
    
    return data;
}

// مسح التخزين المؤقت
function clearCache() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
        }
    });
}
