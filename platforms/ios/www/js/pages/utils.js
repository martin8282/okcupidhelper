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

        var doRequest = function(url, requestOptions, requestSuccess, requestError) {
            if (requestOptions.show_mask) utils.mask();
            if (requestOptions.method.toLowerCase() == 'get') {
                cordovaHTTP.get(url, requestOptions.data, requestOptions.headers, requestSuccess, requestError);
            }
            else if (requestOptions.method.toLowerCase() == 'post') {
                cordovaHTTP.post(url, requestOptions.data, requestOptions.headers, requestSuccess, requestError);
            }
            else {
                throw 'Method unknown';
            }
        };

        var success = function(response) {
            if (options.show_mask) utils.unmask();
            options.success(response);
        };

        var count = 0;
        var error = function(response) {
            if (count < 3) {
                count++;
                doRequest(requestUrl, options, success, error);
            }
            else {
                if (options.show_mask) utils.unmask();
                options.error(response);
            }
        };

        doRequest(requestUrl, options, success, error);
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

    onSessionMaxCount: function() {
        if (confirm('Reached max count of found users for the session. Would you like to re-login?')) app.relogin();
    },

    sendError: function(message) {
        try {
            var options = consts.optionsErrorLog(message);
            options.success = function(response) { };
            utils.request(options);
        }
        catch (ex) {
        }
    },

    onRequestError: function(response) {
        utils.unmask();

        if (isDef(response.error) && response.error.indexOf(consts.ERROR_1000) > 0) {
            app.set(consts.KEY_ERROR_MAX, true);
            if (isDef(home) && home.search_id > 0) {
                flash.info('Reached max count of persons found.', 2000);
                home.finishSearch();
            }
            return;
        }

        if (app.isDebug()) {
            utils.showXhrDebug(response.status, response.error, response.headers);
        }
        else {
            flash.error(consts.MESSAGE_SORRY_REQUEST);
            utils.sendError(JSON.stringify(response));
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

    extractPerson: function(raw_person) {
        var person = {};
        person.id = utils.getJsonValue(raw_person.userid);
        person.user_name = utils.getJsonValue(raw_person.username);
        var userInfo = utils.getJsonValue(raw_person.userinfo);
        person.gender = utils.getJsonValue(userInfo.gender_letter);
        person.age = utils.getJsonValue(userInfo.age);
        person.location = utils.getJsonValue(userInfo.location);
        person.orientation = utils.getJsonValue(userInfo.orientation);
        person.rel_status = utils.getJsonValue(userInfo.rel_status);

        var likes = utils.getJsonValue(raw_person.likes);
        person.mutual_like = utils.getIntbool(utils.getJsonValue(likes.mutual_like));
        person.like = utils.getIntbool(utils.getJsonValue(likes.you_like));

        var thumbs = utils.getJsonValue(raw_person.thumbs);
        if (thumbs.length > 0) {
            person.img_url = utils.getJsonValue(thumbs[0]['82x82']);
        }
        else {
            person.img_url = null;
        }

        return person;
    },

    savePerson: function(person, complete) {
        var selectComplete = function(resultSet) {
            if (resultSet.rows.length > 0) {
                utils.execSql("UPDATE persons SET " +
                    "user_name = ?, " +
                    "gender = ?, " +
                    "age = ?, " +
                    "location = ?, " +
                    "orientation = ?, " +
                    "rel_status = ?, " +
                    "img_url = ?, " +
                    "like = ? " +
                    "WHERE id = ?", complete,
                    [ person.user_name, person.gender, person.age, person.location,
                        person.orientation, person.rel_status, person.img_url,
                        person.like, person.id ]);
            }
            else {
                utils.execSql("INSERT INTO persons " +
                    "(id, user_name, gender, age, location, orientation, rel_status, img_url, like) " +
                    "values (?, ?, ?, ?, ?, ?, ?, ?, ?)", complete,
                    [ person.id, person.user_name, person.gender, person.age, person.location,
                        person.orientation, person.rel_status, person.img_url,
                        person.like ]);
            }
        };

        utils.execSql("SELECT id FROM persons WHERE id = ?", selectComplete, [ person.id ]);
    },

    like: function(id, complete) {
        var options = consts.optionsLike(id, settings.authCode());
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success) {
                var like = utils.getIntbool(utils.getJsonValue(data.liked));
                utils.execSql('UPDATE persons SET ' +
                    'like = ? ' +
                    'WHERE id = ?', complete, [ like, id ]);
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
        if (!isDef(options.limit)) options.limit = null;

        var sql = options.select_count ?
            'SELECT count(id) as count FROM persons ' :
            'SELECT * FROM persons ';

        if (options.condition) sql += ' WHERE ' + options.condition;

        sql += ' ORDER BY id desc';

        if (options.limit) sql += ' LIMIT ' + options.limit;

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
    },

    resetSearch: function(complete) {
        var searchId = app.get(consts.KEY_SEARCH_ID);
        if (searchId != null && searchId > 0) {

            app.set(consts.KEY_SEARCH_ID, -1);
            app.get(consts.KEY_SEARCH_RESET, null);

            utils.execSql('UPDATE searches SET ' +
                'next_page = NULL ' +
                'WHERE id = ?', complete, [searchId]);
        }
        else {
            complete();
        }
    }
}