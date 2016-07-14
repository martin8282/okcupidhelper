var consts = {
    ROOT_URL: 'http://www.okcupid.com',
    PAGE_INDEX: 'index.html',
    PAGE_LOGIN: 'login.html',
    PAGE_HOME: 'home.html',
    PAGE_GEO: 'geo.html',
    PAGE_RESULTS: 'results.html',
    PAGE_SETTINGS: 'settings.html',

    KEY_GOOGLE_API: 'AIzaSyDathjZMlxipK8CpB2JsIiYyp6PGcNJxAI',
    KEY_CURRENT_PAGE: 'current_page',
    KEY_PREVIOUS_PAGE: 'prev_page',
    KEY_SEARCH_ID: 'search_id',
    KEY_SEARCH_PAGE: 'next_search',

    SETTING_LOCATION: 'locid',
    SETTING_USER_ID: 'userid',
    SETTING_GENDER: 'usergender',
    SETTING_ACCESS_TOKEN: 'oauth_accesstoken',
    SETTING_CITY: 'city_name',
    SETTING_COUNTRY: 'country_name',
    SETTING_DISTANCE: 'distance',
    SETTING_AGE_FROM: 'age_from',
    SETTING_AGE_TO: 'age_to',
    SETTING_NUMBER: 'find_number',
    SETTING_FIND_WHO: 'find_who',

    GENDER_ALL: 0,
    GENDER_WOMEN: 1,
    GENDER_MEN: 2,

    MESSAGE_SORRY_REQUEST: 'Sorry, error occurred while requesting Okcupid.com',
    MESSAGE_SORRY: 'Sorry, error occurred',
    MESSAGE_WAIT: 'Please, wait...',
    MESSAGE_ENTER_CITY: 'Enter Your city, please',
    MESSAGE_ENTER_ZIP: 'Enter Zip code, please',

    COUNTRY_USA: 'United States',
    COUNTRY_USA_CODE: 'US',

    optionsLogin: function(login, password) {
        return { method: 'GET', url: 'login', data: { username: login, password: password, okc_api: 1 } }
    },

    optionsProfile: function() {
        return { method: 'GET', url: 'profile', data: { okc_api: 1 } }
    },

    optionsSearch: function(data) {
        return { method: 'POST', url: '1/apitun/match/search', data: data }
    },

    optionsLocation: function(country, mask) {
        var url = '1/apitun/location/query?q=' + encodeURIComponent(mask);
        if (country != null) url += '%2C+' + encodeURIComponent(country);
        return { method: 'GET', url: url }
    },

    optionsLike: function(userId, auth_token) {
        var options = { method: 'POST', url: '1/apitun/profile/' + userId + '/like' }
        options.headers = { authorization: 'Bearer ' + auth_token };
        return options;
    },

    optionsGeocode: function(latitude, longitude) {
        return {
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +
                ',' + longitude +
                '&language=en' +
                '&key=' + consts.KEY_GOOGLE_API
        }
    }
};
