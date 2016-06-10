var index = {
    init: function() {
        $('#btnLogin').click(index.doLogin);
        if (app.isDebug()) {
            $('#tbLogin').val('bubonski');
            $('#tbPassword').val('Merg1980');
        }
    },

    doLogin: function() {
        flash.closeAll();

        var login = $('#tbLogin').val();
        if (login == '') {
            flash.error('Enter Okcupid login', 2000);
            $('#tbLogin').focus();
            return;
        }

        var password = $('#tbPassword').val();
        if (password == '') {
            flash.error('Enter Okcupid password', 2000);
            $('#tbPassword').focus();
            return;
        }

        var options = consts.optionsLogin(login, password);
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;
            if (data.status != 0) {
                flash.error(utils.getJsonValue(data.status_str));
            }
            else {
                var keys = [ consts.KEY_ACCESS_TOKEN, consts.KEY_DISPLAY_NAME, consts.KEY_USER_ID ];
                for (var idx in keys) {
                    var key = keys[idx];
                    app.set(key, utils.getJsonValue(data[key]));
                }
                navigator.geolocation.getCurrentPosition(index.onCoords, function(error) { utils.navigateTo(consts.PAGE_GEO) });
            }
        }

        utils.request(options);
    },

    onCoords: function(position) {
        app.set(consts.KEY_LATITUDE, utils.getJsonValue(position.coords.latitude));
        app.set(consts.KEY_LONGITUDE, utils.getJsonValue(position.coords.longitude));
        utils.navigateTo(consts.PAGE_HOME);
    }
}