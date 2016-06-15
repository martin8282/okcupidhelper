var home = {
    persons: null,

    init: function() {
        query.locid = app.get(consts.KEY_LOCATION);
        $('#btnSearch').click(function() { home.search(null) });
        $('#btnLike').click(function() { home.likeAll(0) });
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
        var records = utils.getJsonValue(data.data);
        utils.progress(home.persons.length / consts.SEARCH_COUNT * 100, 'Searching...');

        for (var index in records) {
            var raw_person = records[index];

            if (home.persons.length >= consts.SEARCH_COUNT) {
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

        utils.progress(home.persons.length / consts.SEARCH_COUNT * 100, 'Searching...');

        var nextPage = utils.getJsonValue(data.paging.cursors.after);
        if (nextPage == null) {
            home.finalizeResults();
        }
        else {
            home.search(nextPage);
        }
    },

    finalizeResults: function() {
        //app.set(consts.KEY_RESULTS, JSON.stringify(home.persons));

        $('#btnSeeAll').removeAttr('disabled');
        $('#btnLike').removeAttr('disabled').html('Like ' + home.persons.length + ' users');

        utils.progressHide();
        utils.unmask();

        flash.info('Found ' + home.persons.length + ' users', 2000);
    },

    likeAll: function(cursor) {
        if (cursor == 0) utils.mask();
        if (cursor >= home.persons.length) {
            utils.progressHide();
            utils.unmask();
            return;
        }

        var userId = home.persons[cursor].userid;
        var options = consts.optionsLike(userId);

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success == 'true') {
            }
            utils.progress(cursor / home.persons.length * 100, 'Like...');
            home.likeAll(cursor + 1);
        };

        options.show_mask = false;

        utils.request(options);
    }
}