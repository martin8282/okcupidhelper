function isDef(object) {
    return typeof(object) != 'undefined';
}

var utils = {
    db: null,
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
        $(window).scrollTop(0);
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

    navigateBack: function() {
        var prevPage = app.get(consts.KEY_PREVIOUS_PAGE);
        if (prevPage != null && app.currentPage() != prevPage) {
            app.currentPage(prevPage);
            document.location = prevPage;
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
            throw 'Cannot resolve value ' + arguments.callee.caller;
        }

        if (exception != null) throw exception;
        return result;
    },

    execSql: function(sql, complete, params) {
        var execute = function(sql, complete) {
            if (!isDef(complete)) complete = function(results) {};
            if (!isDef(params)) params = [];
            utils.db.executeSql(sql, params, complete, function(error) { app.onError(error.message) });
        };

        if (utils.db == null) {
            utils.db = window.sqlitePlugin.openDatabase({ name: 'okc.db', location: 'default' },
                function () { execute(sql, complete); },
                function (error) { app.onError(error.message); });
        }
        else {
            execute(sql, complete);
        }
    },

    execSqlBatch: function(sqlArr, complete) {
        var execute = function(sqlArr, complete) {
            if (!isDef(complete)) complete = function(results) {};
            utils.db.sqlBatch(sqlArr, complete, function(error) { app.onError(error.message) });
        };

        if (utils.db == null) {
            utils.db = window.sqlitePlugin.openDatabase({ name: 'okc.db', location: 'default' },
                function () { execute(sqlArr, complete); },
                function (error) { app.onError(error.message); });
        }
        else {
            execute(sqlArr, complete);
        }
    },

    intOrNull: function(value) {
        var result = parseInt(value);
        if (isNaN(result)) result = null;
        return result;
    },

    getIntbool: function(value) {
        var result = 0;
        var error = null;
        if (value != null) {
            if (typeof value == 'number') {
                if (value == 1) result = 1;
                else if (value == 0) result = 0;
                else error = 'Unexpected bool value (int)' + value;
            }
            else if (typeof value == 'boolean') {
                result = value ? 1 : 0;
            }
            else if (typeof value == 'string') {
                if (value == '1' || value == 'true') result = 1;
                if (value == '0' || value == 'false') result = 0;
                else error = 'Unexpected bool value (string)' + value;
            }
            else error = 'Unexpected bool value ' + value;
        }
        if (error) throw (error + ' ' + arguments.callee.caller);
        return result;
    },

    json: function(object) {
        alert(JSON.stringify(object));
    },

    like: function(id, complete) {
        var options = consts.optionsLike(id, settings.authCode());
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success) {
                var like = utils.getIntbool(utils.getJsonValue(data.liked));
                var mutual_like = utils.getIntbool(utils.getJsonValue(data.mutual_like));
                utils.execSql('UPDATE persons SET ' +
                    'like = ?, ' +
                    'mutual_like = ? ' +
                    'WHERE id = ?', complete, [ like, mutual_like, id ]);
            }
            else {
                complete();
            }
        };

        options.show_mask = false;
        utils.request(options);
    },

    getPersons: function(complete, options) {
        if (!isDef(options)) options = {};
        if (!isDef(options.select_count)) options.select_count = false;
        if (!isDef(options.condition)) options.condition = null;

        var sql = options.select_count ?
            'SELECT count(id) as count FROM persons ' :
            'SELECT * FROM persons ';

        if (options.condition) sql += ' WHERE ' + options.condition;
        sql += ' ORDER BY like, age';

        utils.execSql(sql, complete);
    },

    getPersonsForSearch: function(searchId, complete, options) {
        if (!isDef(options)) options = {};
        if (!isDef(options.select_count)) options.select_count = false;
        if (!isDef(options.condition)) options.condition = null;

        var id = parseInt(searchId);
        if (isNaN(id)) {
            if (options.select_count) {
                complete(null);
                return;
            }
            else {
                throw 'Undefined searchId ' + searchId + ' ' + arguments.callee.caller;
            }
        }

        var sql = (options.select_count ? 'SELECT count(persons.id) as count FROM persons ' : 'SELECT persons.* FROM persons ') +
            'JOIN search_persons ON search_persons.person_id = persons.id ' +
            'WHERE search_persons.search_id = ?';

        if (options.condition) sql += ' AND ' + options.condition;
        sql += ' ORDER BY persons.like, persons.age';

        utils.execSql(sql, complete, [ id ]);
    }
}