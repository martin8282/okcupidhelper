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
                index.loadProfile();
            }
        };

        utils.request(options);
    },

    loadProfile: function() {
        var options = consts.optionsProfile();
        options.success = function(response) {
            settings.initSettings(utils.parseJSON(response.data), index.loadProfileComplete);
        };
        utils.request(options);
    },

    loadProfileComplete: function() {
        var onGeoError = function(error) {
            if (settings.locationId() != null) {
                utils.navigateTo(consts.PAGE_HOME);
            }
            else {
                utils.navigateTo(consts.PAGE_GEO)
            }
        };
        //navigator.geolocation.getCurrentPosition(index.onCoords, onGeoError);
        if (settings.locationId() != null) {
            utils.navigateTo(consts.PAGE_HOME);
        }
        else {
            navigator.geolocation.getCurrentPosition(index.onCoords, onGeoError);
        }
    },

    onCoords: function(position) {
        var options = consts.optionsGeocode(position.coords.latitude, position.coords.longitude);
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null || data.results == null || data.results.length == 0) {
                utils.navigateTo(consts.PAGE_GEO);
                return;
            }
            var address = utils.getJsonValue(data.results[0].address_components);
            var location = null;
            var postal_code = null;
            var country = null;
            var country_short = null;
            for (var idx = 0; idx < address.length; idx++) {
                var component = address[idx];
                if (location == null && $.inArray('locality', component.types) >= 0) {
                    location = component.long_name;
                }
                if (postal_code == null && $.inArray('postal_code', component.types) >= 0) {
                    postal_code = component.long_name;
                }
                if (country == null && $.inArray('country', component.types) >= 0) {
                    country = component.long_name;
                    country_short = component.short_name;
                }
            }

            geo.doRequest(
                country_short == consts.COUNTRY_USA_CODE ? null : country,
                country_short == consts.COUNTRY_USA_CODE ? postal_code : location,
                function(message, records) {
                    if (records.length == 0) {
                        utils.navigateTo(consts.PAGE_GEO);
                    }
                    else if (records.length >= 1) {
                        settings.locationId(records[0][consts.SETTING_LOCATION]);
                        settings.locationName(
                            utils.getJsonValue(records[0][consts.SETTING_COUNTRY]),
                            utils.getJsonValue(records[0][consts.SETTING_CITY])
                        );
                        utils.navigateTo(consts.PAGE_HOME);
                    }
                });
        };

        utils.request(options);
    }
}