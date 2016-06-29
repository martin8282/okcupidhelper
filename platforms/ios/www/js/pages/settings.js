var settings = {
    init: function() {
        $('#btnLocation').click(function() { utils.navigateTo(consts.PAGE_GEO); })
        $('#btnBack').click(function() {
            if (settings.findWho().length == 0) {
                flash.error('Please, check who you want to find', 3000);
                return;
            }
            utils.navigateTo(consts.PAGE_HOME);
        });

        settings.initControls();
    },

    initSettings: function(profile) {
        settings.profile(profile);
        settings.authCode(utils.getJsonValue(profile.authcode));
        settings.userId(utils.getJsonValue(profile.userid));
        settings.userGender(utils.getJsonValue(profile.gender_str));
        settings.distance(utils.getJsonValue(profile.searchprefs.radius));
        settings.number(20);
        settings.ageFrom(utils.getJsonValue(profile.searchprefs.MATCH_FILTER_AGE));
        settings.ageTo(utils.getJsonValue(profile.searchprefs.MATCH_FILTER_AGE_val2));
        settings.findWho(settings.userGender() == 'M' ? [ consts.GENDER_WOMEN ] : [ consts.GENDER_MEN ]);
        app.set(consts.SETTING_PROFILE, JSON.stringify(profile));
    },

    initControls: function() {
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
        $('#cbWomen').on('change', settings.changeFindWho)
            .prop('checked', $.inArray(consts.GENDER_WOMEN, findWho) >= 0).checkboxradio('refresh');

        $('#cbMen').on('change', settings.changeFindWho)
            .prop('checked', $.inArray(consts.GENDER_MEN, findWho) >= 0).checkboxradio('refresh');
    },

    changeDistance: function() {
        var distance = $('#sldDistance').val()
        settings.distance(distance);
        $('#lbDistance').html('Distance: ' + distance + ' miles');
    },

    changeNumber: function() {
        settings.number($('#sldNumber').val());
    },

    changeAgeFrom: function() {
        settings.ageFrom($('#sldAgeFrom').val());
    },

    changeAgeTo: function() {
        settings.ageTo($('#sldAgeTo').val());
    },

    changeFindWho: function() {
        var findWho = [];
        if ($('#cbWomen').prop('checked')) findWho.push(consts.GENDER_WOMEN);
        if ($('#cbMen').prop('checked')) findWho.push(consts.GENDER_MEN);
        settings.findWho(findWho);
    },

    // settings properties
    profile: function(profile) {
        if (isDef(profile)) {
            app.set(consts.SETTING_PROFILE, JSON.stringify(profile));
        }
        return JSON.parse(app.get(consts.SETTING_PROFILE));
    },

    authCode: function(authCode) {
        if (isDef(authCode)) {
            app.set(consts.SETTING_ACCESS_TOKEN, authCode);
        }
        return app.get(consts.SETTING_ACCESS_TOKEN);
    },

    userId: function(userId) {
        if (isDef(userId)) {
            app.set(consts.SETTING_USER_ID, userId);
        }
        return app.get(consts.SETTING_USER_ID);
    },

    userGender: function(gender) {
        if (isDef(gender)) {
            app.set(consts.SETTING_GENDER, gender);
        }
        return app.get(consts.SETTING_GENDER);
    },

    locationId: function(locationId) {
        if (isDef(locationId)) {
            app.set(consts.SETTING_LOCATION, locationId);
        }
        return app.get(consts.SETTING_LOCATION);
    },

    locationName: function(country, city) {
        if (isDef(country) && isDef(city)) {
            app.set(consts.SETTING_COUNTRY, country);
            app.set(consts.SETTING_CITY, city);
        }
        return app.get(consts.SETTING_CITY) + ', ' + app.get(consts.SETTING_COUNTRY);
    },

    distance: function(distance) {
        if (isDef(distance)) {
            app.set(consts.SETTING_DISTANCE, parseInt(distance));
        }
        return parseInt(app.get(consts.SETTING_DISTANCE));
    },

    number: function(number) {
        if (isDef(number)) {
            app.set(consts.SETTING_NUMBER, parseInt(number));
        }
        return parseInt(app.get(consts.SETTING_NUMBER));
    },

    ageFrom: function(ageFrom) {
        if (isDef(ageFrom)) {
            app.set(consts.SETTING_AGE_FROM, parseInt(ageFrom));
        }
        return parseInt(app.get(consts.SETTING_AGE_FROM));
    },

    ageTo: function(ageTo) {
        if (isDef(ageTo)) {
            app.set(consts.SETTING_AGE_TO, parseInt(ageTo));
        }
        return parseInt(app.get(consts.SETTING_AGE_TO));
    },

    findWho: function(findWho) {
        if (isDef(findWho)) {
            app.set(consts.SETTING_FIND_WHO, JSON.stringify(findWho));
        }
        return JSON.parse(app.get(consts.SETTING_FIND_WHO));
    }
};