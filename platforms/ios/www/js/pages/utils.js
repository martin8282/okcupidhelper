function isDef(object) {
    return typeof(object) != 'undefined';
}

var utils = {
    request: function(options) {
        if (!isDef(options.method)) throw ('Method is not defined')
        if (!isDef(options.url) || $.trim(options.url) == '') throw ('Request url is not defined');
        if (!isDef(options.success)) throw('OnSuccess is not defined');

        var requestUrl = '';
        if (options.url.length > 4 && options.url.substr(0, 4) == 'http') {
            requestUrl = options.url;
        }
        else {
            requestUrl = consts.ROOT_URL;
            if (options.url[0] != '/') requestUrl += '/';
            requestUrl += options.url;
        }

        if (!isDef(options.headers)) options.headers = {};
        if (!isDef(options.data)) options.data = {};
        if (!isDef(options.error)) options.error = utils.onRequestError;
        if (!isDef(options.show_mask)) options.show_mask = true;

        var success = function(response) {
            if (options.show_mask) utils.unmask();
            options.success(response);
        };

        var error = function(response) {
            if (options.show_mask) utils.unmask();
            options.error(response);
        };

        if (options.show_mask) utils.mask();

        if (options.method.toLowerCase() == 'get') {
            cordovaHTTP.get(requestUrl, options.data, options.headers, success, error);
        }
        else if (options.method.toLowerCase() == 'post') {
            cordovaHTTP.post(requestUrl, options.data, options.headers, success, error);
        }
        else {
            throw 'Method unknown';
        }
    },

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
        try {
            $('body').waiting('done');
        }
        catch(ex) { };
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
            flash.error(consts.MESSAGE_SORRY_REQUEST);
        }
    },

    viewH: function() {
        return $(window).outerHeight()
    },

    viewW: function() {
        return $(window).outerWidth()
    },

    progress: function(percent, label) {
        if (isDef(percent) && !isNaN(percent) && $('.progress').length) {
            $('.progress').removeClass('hidden');
            percent = Math.round(percent);

            var progressBar = $('.progress .progress-bar');
            if (!progressBar.length) {
                progressBar = $('<div class="progress-bar progress-bar-success progress-bar-striped"></div>');
                progressBar
                    .attr('aria-valuemin', 0)
                    .attr('aria-valuemax', 100);

                $('.progress').append(progressBar);
            }

            progressBar.css('width', percent + '%').attr('aria-valuenow', percent).html(percent + '% ' + (isDef(label) ? label : ''));
        }
    },

    progressHide: function() {
        $('.progress').addClass('hidden');
    },

    navigateTo: function(pageName) {
        if (pageName != app.currentPage()) {
            app.currentPage(pageName);
            document.location = pageName;
        }
    },

    getJsonValue: function(value) {
        var result = null;
        var exception = null;
        if (isDef(value)) {
            try {
                result = value;
            }
            catch(ex) { exception = ex; }
        }
        else {
            // caller?
            throw 'Cannot resolve value ' + arguments.callee.caller;
        }

        if (exception != null) throw exception;
        return result;
    }
}