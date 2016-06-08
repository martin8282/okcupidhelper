function isDef(object) {
    return typeof(object) != 'undefined';
}

var utils = {
    request: function(options) {
        if (!isDef(options.method)) throw ('Method is not defined')
        if (!isDef(options.url) || $.trim(options.url) == '') throw ('Request url is not defined');
        if (!isDef(options.success)) throw('OnSuccess is not defined');

        var okUrl = consts.ROOT_URL;
        if (options.url[0] != '/') okUrl += '/';
        okUrl += options.url;

        if (!isDef(options.headers)) options.headers = {};
        if (!isDef(options.data)) options.data = {};
        if (!isDef(options.error)) options.error = utils.onRequestError;

        if (options.method.toLowerCase() == 'get') {
            cordovaHTTP.get(okUrl, options.data, options.headers, options.success, options.error);
        }
        else if (options.method.toLowerCase() == 'post') {
            cordovaHTTP.post(okUrl, options.data, options.headers, options.success, options.error);
        }
        else {
            throw 'Method unknown';
        }
    },

    parseJSON: function(data) {
        var result = JSON.parse(data)
        return result;
    },

    showXhrDebug: function(status, message, headers) {
        var headersStr = '';
        try { headersStr = typeof(headers) == "object" ? JSON.stringify(headers) : headers.toString(); } catch (ex) {};
        flash.error('Status: ' + status + '<br />Message: ' + message + '<br />Headers:' + headersStr);
    },

    onRequestError: function(response) {
        if (app.isDebug()) {
            utils.showXhrDebug(response.status, response.error, response.headers);
        }
        else {
            flash.error(consts.SORRY_REQ_MESSAGE);
        }
    },

    viewH: function() {
        return $(window).outerHeight()
    },

    viewW: function() {
        return $(window).outerWidth()
    },

    navigateTo: function(pageName) {
        // TODO animation
        if (pageName != app.currentPage()) {
            app.currentPage(pageName);
            document.location = pageName;
        }
    }
}