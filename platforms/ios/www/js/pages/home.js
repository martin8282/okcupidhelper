var home = {
    persons: null,

    init: function() {
        $('#btnSearch').click(function() { home.search(null) });
        $('#btnLike').click(function() { home.likeAll(0) });
        $('#btnSettings').click(function() { utils.navigateTo(consts.PAGE_SETTINGS); });
        $('#lbLocation').html(settings.locationName());
    },

    animateButton: function() {
        $('#btnSearch').addClass('pushed');
        setTimeout(function() { $('#btnSearch').removeClass('pushed'); }, 100);
    },

    search: function(nextPage) {
        home.animateButton();

        if (nextPage != null) {
            query.after = nextPage;
        }
        else {
            utils.mask();
            home.persons = [];
        }

        query.locid = settings.locationId();
        query.minimum_age = settings.ageFrom();
        query.maximum_age = settings.ageTo();
        query.radius = settings.distance();
        query.i_want = settings.findWho();

        var options = consts.optionsSearch(JSON.stringify(query));

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

            home.processResults(data);
        }
        options.show_mask = false;
        utils.request(options);
    },

    processResults: function(data) {
        var maxCount = settings.number();
        var records = utils.getJsonValue(data.data);
        utils.progress(home.persons.length / maxCount * 100, 'Searching...');

        for (var index in records) {
            var raw_person = records[index];

            if (home.persons.length >= maxCount) {
                home.finalizeResults();
                return;
            }

            var person = {};
            person.userid = utils.getJsonValue(raw_person.userid);
            person.username = utils.getJsonValue(raw_person.username);

            var userInfo = utils.getJsonValue(raw_person.userinfo);
            person.gender_letter = utils.getJsonValue(userInfo.gender_letter);
            person.gender = utils.getJsonValue(userInfo.gender);
            person.age = utils.getJsonValue(userInfo.age);
            person.rel_status = utils.getJsonValue(userInfo.rel_status);
            person.location = utils.getJsonValue(userInfo.location);
            person.orientation = utils.getJsonValue(userInfo.orientation);

            home.persons.push(person);
        }

        utils.progress(home.persons.length / maxCount * 100, 'Searching...');

        var nextPage = utils.getJsonValue(data.paging.cursors.after);
        if (nextPage == null) {
            home.finalizeResults();
        }
        else {
            home.search(nextPage);
        }
    },

    finalizeResults: function() {
        $('#btnSeeAll').removeAttr('disabled');
        $('#btnLike').removeAttr('disabled').html('Like ' + home.persons.length + ' users');

        utils.progressHide();
        utils.unmask();

        flash.info('Found ' + home.persons.length + ' users', 2000);

        // write to db
    },

    likeAll: function(cursor) {
        if (cursor == 0) utils.mask();
        if (cursor >= home.persons.length) {
            utils.progressHide();
            utils.unmask();
            return;
        }

        var userId = home.persons[cursor].userid;
        var options = consts.optionsLike(userId, settings.authCode());

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success == 'true') {
                // write to history
            }
            utils.progress(cursor / home.persons.length * 100, 'Like...');
            home.likeAll(cursor + 1);
        };

        options.show_mask = false;

        utils.request(options);
    }
}