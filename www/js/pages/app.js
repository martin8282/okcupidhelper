var app = {
    init: function () {
        window.onerror = app.onError;
        document.addEventListener('deviceready', app.onPageStart, false);
    },

    onAppStart: function() {
        var db = window.sqlitePlugin.openDatabase({ name: 'okc.db', location: 'default' },
            function() {
                db.executeSql("CREATE TABLE IF NOT EXISTS settings (key VARCHAR(255) primary key, value TEXT);" +
                    "CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "user_id VARCHAR(255))," +
                    "user_name VARCHAR(255)," +
                    "gender VARCHAR(1)," +
                    "age INTEGER," +
                    "location VARCHAR(255)," +
                    "orientation VARCHAR(255)," +
                    "like TINYINT");
            },
            function(error) {
                app.onError(error);
            }
        );
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
        if (app.isDebug()) {
            flash.error(message);
        }
        else {
            flash.error(consts.MESSAGE_SORRY);
            flash.error(consts.SORRY_MESSAGE);
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
