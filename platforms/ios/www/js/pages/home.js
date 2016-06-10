var home = {
    persons: null,

    init: function() {
        query.locid = app.get(consts.KEY_LOCATION);
        $('#btnSearch').click(function() { home.search(null) });
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

        var nextPage = utils.getJsonValue(data.paging.cursors.after);
        if (nextPage == null) {
            home.finalizeResults();
        }
        else {
            home.search(nextPage);
        }
    },

    finalizeResults: function() {
        alert(home.persons.length)
        app.set(consts.KEY_RESULTS, home.persons);

        $('#btnSeeAll').removeAttr('disabled');
        $('#btnLike').removeAttr('disabled');
        utils.unmask();
    }
}