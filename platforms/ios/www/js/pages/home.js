var home = {
    persons_count: 0,
    search_id: -1,

    init: function() {
        $('#btnSearch').click(home.startSearch);
        $('#btnSettings').click(function() { utils.navigateTo(consts.PAGE_SETTINGS); });
        $('#lbLocation').html(settings.locationName());

        $('#btnLike').click(function() { home.likeAll(0) }).prop('disabled', true);
        $('#btnSeeAll').click(function() { utils.navigateTo(consts.PAGE_RESULTS); }).prop('disabled', true);
    },

    animateButton: function() {
        $('#btnSearch').addClass('pushed');
        setTimeout(function() { $('#btnSearch').removeClass('pushed'); }, 100);
    },

    startSearch: function() {
        home.animateButton();
        home.persons_count = 0;
        utils.mask();

        var complete = function(resultSet) {
            home.search_id = resultSet.insertId;
            home.search(null);
        };

        utils.execSql('INSERT INTO searches (id, location, location_name, search_date) VALUES (NULL, ?, ?, ?);', complete,
            [ settings.locationId(), settings.locationName(), Date.now() ]
        );
    },

    search: function(nextPage) {
        if (nextPage != null) query.after = nextPage;
        query.locid = settings.locationId();
        query.minimum_age = settings.ageFrom();
        query.maximum_age = settings.ageTo();
        query.radius = settings.distance();
        query.gender_tags = settings.findWho();

        var options = consts.optionsSearch(JSON.stringify(query));

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

            home.processResults(data);
        };

        options.show_mask = false;
        utils.request(options);
    },

    processResults: function(data) {
        var maxCount = settings.number();
        var records = utils.getJsonValue(data.data);
        var index = -1;

        var nextData = function() {
            var nextPage = utils.getJsonValue(data.paging.cursors.after);
            if (nextPage == null) {
                home.finalizeResults();
            }
            else {
                home.search(nextPage);
            }
        };

        var nextPerson = function() {
            index++;

            if (home.persons_count >= maxCount) {
                home.finalizeResults();
                return;
            }
            home.persons_count++;

            utils.progress(home.persons_count / maxCount * 100, 'Searching...');

            if (index < records.length) {
                var raw_person = records[index];
                var person = {};
                person.user_id = utils.getJsonValue(raw_person.userid);
                person.user_name = utils.getJsonValue(raw_person.username);

                var userInfo = utils.getJsonValue(raw_person.userinfo);
                person.gender = utils.getJsonValue(userInfo.gender_letter);
                person.age = utils.getJsonValue(userInfo.age);
                person.location = utils.getJsonValue(userInfo.location);
                person.orientation = utils.getJsonValue(userInfo.orientation);
                person.like = false;

                var thumbs = utils.getJsonValue(raw_person.thumbs);
                if (thumbs.length > 0) {
                    person.img_url = utils.getJsonValue(thumbs[0]['225x225']);
                }
                else {
                    person.img_url = null;
                }

                home.savePerson(person, nextPerson);
            }
            else {
                nextData();
            }
        };

        nextPerson();
    },

    finalizeResults: function() {
        $('#btnSeeAll').removeAttr('disabled');
        $('#btnLike').removeAttr('disabled').html('Like ' + home.persons_count + ' users');

        utils.progressHide();
        utils.unmask();

        flash.info('Found ' + home.persons_count + ' users', 2000);
    },

    savePerson: function(person, complete) {
        var onLoadComplete = function(resultSet) {
            if (resultSet.rows.length > 0) {
                utils.execSql("UPDATE persons SET " +
                    "user_name = ?, " +
                    "gender = ?, " +
                    "age = ?, " +
                    "location = ?, " +
                    "orientation = ?, " +
                    "img_url = ? " +
                    "WHERE user_id = ?", complete,
                    [ person.user_name, person.gender, person.age, person.location, person.orientation, person.img_url, person.user_id ]);
            }
            else {
                utils.execSql("INSERT INTO persons " +
                    "(id, user_id, user_name, gender, age, location, orientation, img_url, like) " +
                    "values (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", complete,
                    [ person.user_id, person.user_name, person.gender, person.age, person.location, person.orientation, person.img_url, false ]);
            }
        };
        utils.execSql("SELECT id FROM persons WHERE user_id = ?", onLoadComplete, [ person.user_id ]);
    },

    likeAll: function(cursor) {
        if (cursor == 0) utils.mask();
        if (cursor >= home.persons.length) {
            utils.progressHide();
            utils.unmask();
            return;
        }

        var userId = home.persons[cursor].userId;
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