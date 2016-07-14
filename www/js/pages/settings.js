var settings = {
    init: function() {
        // location
        $('#lbLocation').html('Location: ' + settings.locationName());

        // distance
        $('#sldDistance').on('change', settings.changeDistance).val(settings.distance()).slider('refresh');
        settings.changeDistance();

        // number of matches
        $('#sldNumber').on('change', settings.changeNumber).val(settings.number()).slider('refresh');

        // age to
        $('#sldAgeTo').on('change', settings.changeAgeTo).val(settings.ageTo()).slider('refresh');

        // age from
        $('#sldAgeFrom').on('change', settings.changeAgeFrom).val(settings.ageFrom()).slider('refresh');

        // find who
        var findWho = settings.findWho();
        var isWomen = findWho == consts.GENDER_WOMEN || findWho == consts.GENDER_ALL;
        var isMen = findWho == consts.GENDER_MEN || findWho == consts.GENDER_ALL;
        $('#cbWomen').on('change', settings.changeFindWho).prop('checked', isWomen).checkboxradio('refresh');
        $('#cbMen').on('change', settings.changeFindWho).prop('checked', isMen).checkboxradio('refresh');

        $('#btnLocation').click(function() { utils.navigateTo(consts.PAGE_GEO); });
        $('#btnBack').click(settings.exit);
    },

    exit: function() {
        if (settings.findWho() < 0) {
            flash.error('Please, check who you want to find', 3000);
            return;
        }
        settings.saveSettings(function() { utils.navigateTo(consts.PAGE_HOME); });
    },

    getSettingsKeys: function() {
        var result = [ settings.locationId(consts),
            settings.distance(consts),
            settings.number(consts),
            settings.ageFrom(consts),
            settings.ageTo(consts),
            settings.findWho(consts) ];
        result = result.concat(settings.locationName(consts, consts));
        return result;
    },

    saveSettings: function(complete) {
        var keys = settings.getSettingsKeys();
        var index = -1;
        var nextSetting = function(resultSet) {
            index++;
            if (index < keys.length) {
                settings.saveSetting(keys[index], app.get(keys[index]), nextSetting);
            }
            else {
                complete();
            }
        };
        nextSetting();
    },

    saveSetting: function(key, value, complete) {
        var onLoadComplete = function(resultSet) {
            if (resultSet.rows.length > 0) {
                utils.execSql("UPDATE settings SET value = ? WHERE key = ?", complete, [ value, key ]);
            }
            else {
                utils.execSql("INSERT INTO settings (key, value) values (?, ?)", complete, [ key, value ]);
            }
        };
        utils.execSql("SELECT value FROM settings WHERE key = ?", onLoadComplete, [ key ]);
    },

    initSettings: function(profile, complete) {
        settings.authCode(utils.getJsonValue(profile.authcode));
        settings.userId(utils.getJsonValue(profile.userid));
        settings.userGender(utils.getJsonValue(profile.gender_str));

        var keys = settings.getSettingsKeys();

        var completeSettings = function() {
            if (settings.distance() == null) settings.distance(utils.getJsonValue(profile.searchprefs.radius));
            if (settings.number() == null) settings.distance(20);
            if (settings.ageFrom() == null) settings.ageFrom(utils.getJsonValue(profile.searchprefs.MATCH_FILTER_AGE));
            if (settings.ageTo() == null) settings.ageTo(utils.getJsonValue(profile.searchprefs.MATCH_FILTER_AGE_val2));
            if (settings.findWho() == null) settings.findWho(settings.userGender() == 'M' ? consts.GENDER_WOMEN : consts.GENDER_MEN);
            complete();
        };

        var index = -1;
        var nextSetting = function(value) {
            if (index >= 0 && isDef(value) && value != null) {
                app.set(keys[index], value);
            }
            index++;
            if (index < keys.length) {
                settings.loadSetting(keys[index], nextSetting);
            }
            else completeSettings();
        };
        nextSetting();
    },

    loadSetting: function(key, complete) {
        var onComplete = function(resultSet) {
            var value = resultSet.rows.length > 0 ? resultSet.rows.item(0).value : null;
            complete(value);
        };
        utils.execSql("SELECT value FROM settings WHERE key = ?", onComplete, [ key ]);
    },

    changeDistance: function() {
        var distance = $('#sldDistance').val()
        settings.distance(distance);
        $('#lbDistance').html('Distance: ' + distance + ' miles');
        utils.resetSearch();
    },

    changeNumber: function() {
        settings.number($('#sldNumber').val());
        utils.resetSearch();
    },

    changeAgeFrom: function() {
        settings.ageFrom($('#sldAgeFrom').val());
        utils.resetSearch();
    },

    changeAgeTo: function() {
        settings.ageTo($('#sldAgeTo').val());
        utils.resetSearch();
    },

    changeFindWho: function() {
        var findWho = -1;
        var isWomen = $('#cbWomen').prop('checked');
        var isMen = $('#cbMen').prop('checked');

        if (isWomen && isMen) { findWho = consts.GENDER_ALL }
        else if (isWomen) { findWho = consts.GENDER_WOMEN }
        else if (isMen) { findWho = consts.GENDER_MEN }

        settings.findWho(findWho);
        utils.resetSearch();
    },

    // settings properties
    authCode: function(authCode) {
        if (isDef(authCode)) {
            if (authCode == consts) return consts.SETTING_ACCESS_TOKEN;
            app.set(consts.SETTING_ACCESS_TOKEN, authCode);
        }
        return app.get(consts.SETTING_ACCESS_TOKEN);
    },

    userId: function(userId) {
        if (isDef(userId)) {
            if (userId == consts) return consts.SETTING_USER_ID;
            app.set(consts.SETTING_USER_ID, userId);
        }
        return app.get(consts.SETTING_USER_ID);
    },

    userGender: function(gender) {
        if (isDef(gender)) {
            if (gender == consts) return consts.SETTING_GENDER;
            app.set(consts.SETTING_GENDER, gender);
        }
        return app.get(consts.SETTING_GENDER);
    },

    locationId: function(locationId) {
        if (isDef(locationId)) {
            if (locationId == consts) return consts.SETTING_LOCATION;
            app.set(consts.SETTING_LOCATION, locationId);
        }
        return app.get(consts.SETTING_LOCATION);
    },

    locationName: function(country, city) {
        if (isDef(country) && isDef(city)) {
            if (country == consts) return [ consts.SETTING_COUNTRY, consts.SETTING_CITY ];
            app.set(consts.SETTING_COUNTRY, country);
            app.set(consts.SETTING_CITY, city);
            utils.resetSearch();
        }
        return app.get(consts.SETTING_CITY) + ', ' + app.get(consts.SETTING_COUNTRY);
    },

    distance: function(distance) {
        if (isDef(distance)) {
            if (distance == consts) return consts.SETTING_DISTANCE;
            app.set(consts.SETTING_DISTANCE, distance);
        }
        return utils.intOrNull(app.get(consts.SETTING_DISTANCE));
    },

    number: function(number) {
        if (isDef(number)) {
            if (number == consts) return consts.SETTING_NUMBER;
            app.set(consts.SETTING_NUMBER, number);
        }
        return utils.intOrNull(app.get(consts.SETTING_NUMBER));
    },

    ageFrom: function(ageFrom) {
        if (isDef(ageFrom)) {
            if (ageFrom == consts) return consts.SETTING_AGE_FROM;
            app.set(consts.SETTING_AGE_FROM, ageFrom);
        }
        return utils.intOrNull(app.get(consts.SETTING_AGE_FROM));
    },

    ageTo: function(ageTo) {
        if (isDef(ageTo)) {
            if (ageTo == consts) return consts.SETTING_AGE_TO;
            app.set(consts.SETTING_AGE_TO, ageTo);
        }
        return utils.intOrNull(app.get(consts.SETTING_AGE_TO));
    },

    findWho: function(findWho) {
        if (isDef(findWho)) {
            if (findWho == consts) return consts.SETTING_FIND_WHO;
            app.set(consts.SETTING_FIND_WHO, findWho);
        }
        return utils.intOrNull(app.get(consts.SETTING_FIND_WHO));
    }
};