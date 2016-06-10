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
<<<<<<< HEAD
        if (!isDef(options.leave_mask)) options.leave_mask = false;

        var success = function(response) {
            if (!options.leave_mask) utils.unmask();
            options.success(response);
        };

        var error = function(response) {
            if (!options.leave_mask) utils.unmask();
            options.error(response);
        };

        utils.mask();

        if (options.method.toLowerCase() == 'get') {
            cordovaHTTP.get(okUrl, options.data, options.headers, success, error);
        }
        else if (options.method.toLowerCase() == 'post') {
            cordovaHTTP.post(okUrl, options.data, options.headers, success, error);
=======

        if (options.method.toLowerCase() == 'get') {
            cordovaHTTP.get(okUrl, options.data, options.headers, options.success, options.error);
        }
        else if (options.method.toLowerCase() == 'post') {
            cordovaHTTP.post(okUrl, options.data, options.headers, options.success, options.error);
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
        }
        else {
            throw 'Method unknown';
        }
    },

<<<<<<< HEAD
    mask: function(message) {
        if (!isDef(message)) message  = consts.MESSAGE_WAIT;
        $('body').waiting({
            size: 30,
            quantity: 8,
            dotSize: 8,
            enableReverse: true,
            light: true
        });
    },

    unmask: function() {
        $('body').waiting('done');
    },

=======
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
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
        alert('err');
        if (app.isDebug()) {
            utils.showXhrDebug(response.status, response.error, response.headers);
        }
        else {
<<<<<<< HEAD
            flash.error(consts.MESSAGE_SORRY_REQUEST);
=======
            flash.error(consts.SORRY_REQ_MESSAGE);
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
        }
    },

    viewH: function() {
        return $(window).outerHeight()
    },

    viewW: function() {
        return $(window).outerWidth()
    },

    navigateTo: function(pageName) {
<<<<<<< HEAD
=======
        // TODO animation
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
        if (pageName != app.currentPage()) {
            app.currentPage(pageName);
            document.location = pageName;
        }
    }
}