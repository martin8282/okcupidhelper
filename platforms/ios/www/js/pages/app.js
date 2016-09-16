var app = {
    init: function () {
        window.onerror = app.onError;
        document.addEventListener('deviceready', app.onPageStart, false);
    },

    relogin: function() {
        var logoutOptions = consts.optionsLogout();
        logoutOptions.error = function(response) { utils.navigateTo(consts.PAGE_INDEX) };
        logoutOptions.success = function(response) {
            var loginOptions = consts.optionsLogin(app.get(consts.SETTING_LOGIN), app.get(consts.SETTING_PASSWORD));
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

            app.set(consts.KEY_ERROR_MAX, false);
        };
        utils.request(logoutOptions);
    },

    // initializeStore: function() {
    //
    //     // Let's set a pretty high verbosity level, so that we see a lot of stuff
    //     // in the console (reassuring us that something is happening).
    //     store.verbosity = store.INFO;
    //
    //     // We register a dummy product. It's ok, it shouldn't
    //     // prevent the store "ready" event from firing.
    //     store.register({
    //         id:    "com.okcupid.okcupidhelper.1",
    //         alias: "unlimited search",
    //         type:  store.NON_CONSUMABLE
    //     });
    //
    //     // When every goes as expected, it's time to celebrate!
    //     // The "ready" event should be welcomed with music and fireworks,
    //     // go ask your boss about it! (just in case)
    //     store.ready(function() {
    //         console.log("\\o/ STORE READY \\o/");
    //         var p = store.get("com.okcupid.okcupidhelper.1");
    //         flash.error(p, 4000);
    //     });
    //
    //     // After we've done our setup, we tell the store to do
    //     // it's first refresh. Nothing will happen if we do not call store.refresh()
    //     store.refresh();
    // },

    onAppStart: function() {
        var sql = [];

        if (app.isDebug()) {
            sql.push("DROP TABLE IF EXISTS persons;");
            sql.push("DROP TABLE IF EXISTS searches;");
            sql.push("DROP TABLE IF EXISTS search_persons;");
            sql.push("DROP TABLE IF EXISTS pay_identifier;");
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
        sql.push("CREATE TABLE IF NOT EXISTS pay_identifier (number_of_uses INT, pay_indent INT, first_insert INT, UNIQUE(first_insert))");
        sql.push("INSERT OR IGNORE INTO pay_identifier(number_of_uses, pay_indent, first_insert) VALUES(4, 0, 0)");


        utils.execSqlBatch(sql);
    },

    onPageStart: function() {
        if (!app.currentPage()) {
            app.currentPage(consts.PAGE_INDEX);
            app.onAppStart();
        }
        var pageObjectName = app.currentPage();
        var pageObject = eval(pageObjectName.substr(0, pageObjectName.length - 5));
       // app.initializeStore();
        pageObject.init();
    },

    onError: function(message, url, line, col, error) {
        utils.unmask();
        if (app.isDebug()) {
            flash.error(message);
        }
        else {
            utils.sendError(message);
        }
    },

    isDebug: function() {
        return false;
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
