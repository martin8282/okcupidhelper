var app = {
    init: function () {
        window.onerror = app.onError;
        document.addEventListener('deviceready', app.onPageStart, false);
    },

    relogin: function() {
        var logoutOptions = consts.optionsLogout();
        logoutOptions.error = function(response) { utils.navigateTo(consts.PAGE_INDEX) };
        logoutOptions.success = function(response) {
            /*var loginOptions = consts.optionsLogin(app.get(consts.SETTING_LOGIN), app.get(consts.SETTING_PASSWORD));
            loginOptions.error = function(response) { utils.navigateTo(consts.PAGE_INDEX) };
            loginOptions.success = function(response) {
                var data = utils.parseJSON(response.data);
                if (data == null || data.status != 0) {
                    utils.navigateTo(consts.PAGE_INDEX);
                }
                else {
                    var profileOptions = consts.optionsProfile();
                    profileOptions.error = function(response) { utils.navigateTo(consts.PAGE_INDEX) };
                    profileOptions.success = function(response) {
                        settings.initSettings(utils.parseJSON(response.data), function() {
                            app.set(consts.KEY_ERROR_MAX, false);
                            location.reload();
                        });
                    };
                    utils.request(profileOptions);
                }
            };
            utils.request(loginOptions);
            */

            app.set(consts.KEY_ERROR_MAX, false);
            utils.navigateTo(consts.PAGE_INDEX);
        };
        utils.request(logoutOptions);
    },

    onAppStart: function() {
        var sql = [];

        if (app.isDebug()) {
            sql.push("DROP TABLE IF EXISTS persons;");
            sql.push("DROP TABLE IF EXISTS searches;");
            sql.push("DROP TABLE IF EXISTS search_persons;");
        }

        sql.push("CREATE TABLE IF NOT EXISTS settings (key VARCHAR(255) PRIMARY KEY, value TEXT NULL)");
        sql.push("CREATE TABLE IF NOT EXISTS persons (id VARCHAR(255) PRIMARY KEY," +
            "user_name VARCHAR(255)," +
            "gender VARCHAR(1)," +
            "age INTEGER NULL," +
            "location VARCHAR(255) NULL," +
            "orientation VARCHAR(255) NULL," +
            "rel_status VARCHAR(255) NULL," +
            "img_url VARCHAR(1024) NULL," +
            "like TINYINT NULL)");

        sql.push("CREATE TABLE IF NOT EXISTS searches (id INT PRIMARY KEY, " +
            "location VARCHAR(255), " +
            "location_name VARCHAR(255), " +
            "total_count INT NULL, " +
            "found_count INT NULL, " +
            "next_page VARCHAR(255) NULL," +
            "auth_token VARCHAR(255) NULL)");
        sql.push("CREATE INDEX IF NOT EXISTS searches_auth_token ON searches (auth_token)");

        sql.push("CREATE TABLE IF NOT EXISTS search_persons (search_id INT, person_id INT)");
        sql.push("CREATE INDEX IF NOT EXISTS search_persons_search_id ON search_persons (search_id)");
        sql.push("CREATE INDEX IF NOT EXISTS search_persons_person_id ON search_persons (person_id)");

        utils.execSqlBatch(sql);
    },

    onPageStart: function() {
        if (!app.currentPage()) {
            app.currentPage(consts.PAGE_INDEX);
            app.onAppStart();
        }
        var pageObjectName = app.currentPage();
        var pageObject = eval(pageObjectName.substr(0, pageObjectName.length - 5));
        pageObject.init();
    },

    onError: function(message, url, line, col, error) {
        utils.unmask();
        if (app.isDebug()) {
            flash.error(message);
        }
        else {
            flash.error(consts.MESSAGE_SORRY);
        }
    },

    isDebug: function() {
        return true;
    },

    currentPage: function(pageName) {
        if (isDef(pageName)) {
            app.set(consts.KEY_PREVIOUS_PAGE, app.get(consts.KEY_CURRENT_PAGE));
            app.set(consts.KEY_CURRENT_PAGE, pageName);
            return pageName;
        }
        else {
            return app.get(consts.KEY_CURRENT_PAGE);
        }
    },

    previousPage: function() {
        return app.get(consts.KEY_PREVIOUS_PAGE);
    },

    get: function(key) {
        return window.sessionStorage.getItem(key);
    },

    set: function(key, value) {
        return window.sessionStorage.setItem(key, value);
    }
};

app.init();
