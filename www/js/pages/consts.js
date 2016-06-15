var consts = {
    ROOT_URL: 'http://www.okcupid.com',
    PAGE_INDEX: 'index.html',
    PAGE_LOGIN: 'login.html',
    PAGE_HOME: 'home.html',
    PAGE_GEO: 'geo.html',
    PAGE_RESULTS: 'results.html',

    KEY_CURRENT_PAGE: 'current_page',
    KEY_ACCESS_TOKEN: 'oauth_accesstoken',
    KEY_USER_ID: 'userid',
    KEY_DISPLAY_NAME: 'screenname',
    KEY_LOCATION: 'locid',
    KEY_LATITUDE: 'latitude',
    KEY_LONGITUDE: 'latitude',
    KEY_RESULTS: 'results',

    MESSAGE_SORRY_REQUEST: 'Sorry, error occurred while requesting Okcupid.com',
    MESSAGE_SORRY: 'Sorry, error occurred',
    MESSAGE_WAIT: 'Please, wait...',
    MESSAGE_ENTER_CITY: 'Enter Your city, please',
    MESSAGE_ENTER_ZIP: 'Enter Zip code, please',
    SORRY_REQ_MESSAGE: 'Sorry, error occurred while requesting Okcupid.com',
    SORRY_MESSAGE: 'Sorry, error occurred',

    COUNTRY_USA: 'United States',
    SEARCH_COUNT: 10,

    optionsLogin: function(login, password) {
        return { method: 'GET', url: 'login', data: { username: login, password: password, okc_api: 1 } }
    },

    optionsSearch: function(data) {
        return { method: 'POST', url: '1/apitun/match/search', data: data }
    },

    optionsLocation: function(country, mask) {
        var url = '1/apitun/location/query?q=' + encodeURIComponent(mask);
        if (country != null) url += '+' + encodeURIComponent(country);
        return { method: 'GET', url: url }
    },

    optionsLike: function(userId) {
        var data = JSON.stringify({ access_token: app.get(consts.KEY_ACCESS_TOKEN) });
        return { method: 'POST', url: '1/apitun/profile/' + userId + '/like', data: data }
    }
}
