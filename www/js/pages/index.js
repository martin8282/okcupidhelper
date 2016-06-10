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
                flash.error(data.status_str);
            }
            else {
                var keys = [ consts.KEY_ACCESS_TOKEN, consts.KEY_DISPLAY_NAME, consts.KEY_USER_ID ];
                for (var idx = 0; idx < keys.length; idx++) {
                    var key = keys[idx];
                    if (!isDef(data[key])) throw 'Cannot find ' + key + ' in response';
                    app.set(key, data[key]);
                }
<<<<<<< HEAD
                navigator.geolocation.getCurrentPosition(index.onCoords, function(error) {
                    alert(error.message);
                    utils.navigateTo(consts.PAGE_GEO)
                });
=======
                navigator.geolocation.getCurrentPosition(index.onCoords, function(error) { utils.navigateTo(consts.PAGE_GEO) });
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
            }
        }

        utils.request(options);
    },

    onCoords: function(position) {
<<<<<<< HEAD
        app.set(consts.KEY_LATITUDE, position.coords.latitude);
        app.set(consts.KEY_LONGITUDE, position.coords.longitude);
        utils.navigateTo(consts.PAGE_HOME);
=======
        if (position.coords.altitude > 0 && position.coords.longitude > 0) {
            app.set(consts.KEY_LATITUDE, position.coords.latitude);
            app.set(consts.KEY_LONGITUDE, position.coords.longitude);
            utils.navigateTo(consts.PAGE_HOME);
        }
        else {
            utils.navigateTo(consts.PAGE_GEO);
        }
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
    }
}