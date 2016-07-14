var app = {
    init: function () {
        window.onerror = app.onError;
        document.addEventListener('deviceready', app.onPageStart, false);
    },

    onAppStart: function() {
        var sql = [];
        /*
        if (app.isDebug()) {
            sql.push("DROP TABLE IF EXISTS persons;");
            sql.push("DROP TABLE IF EXISTS searches;");
            sql.push("DROP TABLE IF EXISTS search_persons;");
        }*/
        sql.push("CREATE TABLE IF NOT EXISTS settings (key VARCHAR(255) PRIMARY KEY, value TEXT NULL)");
        sql.push("CREATE TABLE IF NOT EXISTS persons (id VARCHAR(255) PRIMARY KEY," +
            "user_name VARCHAR(255)," +
            "gender VARCHAR(1)," +
            "age INTEGER NULL," +
            "location VARCHAR(255) NULL," +
            "orientation VARCHAR(255) NULL," +
            "rel_status VARCHAR(255) NULL," +
            "img_url VARCHAR(1024) NULL," +
            "like TINYINT NULL," +
            "mutual_like TINYINT NULL)");

        sql.push("CREATE TABLE IF NOT EXISTS searches (id INT PRIMARY KEY, " +
            "location VARCHAR(255), " +
            "location_name VARCHAR(255))");

        sql.push("CREATE TABLE IF NOT EXISTS search_persons (search_id INT, person_id INT)");
        sql.push("CREATE INDEX IF NOT EXISTS search_persons_search_id ON search_persons (search_id)");

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
