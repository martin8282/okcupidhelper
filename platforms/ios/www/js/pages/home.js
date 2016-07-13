var home = {
    persons_count: 0,
    search_id: -1,

    init: function() {
        var selectComplete = function(resultSet) {
            var hasResults = resultSet != null && resultSet.rows.length > 0;
            $('#btnSearch').click(home.startSearch);
            $('#btnSettings').click(function() { utils.navigateTo(consts.PAGE_SETTINGS); });
            $('#lbLocation').html(settings.locationName());

            $('#btnLike').click(function() { home.likeAll(0) }).prop('disabled', !hasResults);
            $('#btnSeeAll').click(function() { utils.navigateTo(consts.PAGE_RESULTS); }).prop('disabled', !hasResults);
        };

        var searchId = parseInt(app.get(consts.KEY_SEARCH_ID));
        if (searchId > 0) {
            utils.execSql('SELECT persons.* FROM persons ' +
                'JOIN search_persons ON search_persons.person_id = persons.id ' +
                'WHERE search_persons.search_id = ?', selectComplete, [searchId]);
        }
        else {
            selectComplete(null);
        }
    },

    animateButton: function() {
        $('#btnSearch').addClass('pushed');
        setTimeout(function() { $('#btnSearch').removeClass('pushed'); }, 100);
    },

    startSearch: function() {
        home.animateButton();
        home.persons_count = 0;
        utils.mask();
        var nextPage = null;

        var insertComplete = function(resultSet) {
            home.search(nextPage);
        };

        var selectComplete = function(resultSet) {
            if (resultSet.rows.length > 0) nextPage = resultSet.rows.item(0).after;

            home.search_id = Date.now();

            utils.execSql('INSERT INTO searches (id, location, location_name, after) VALUES (?, ?, ?, NULL)',
                insertComplete, [ home.search_id, settings.locationId(), settings.locationName() ]
            );
        };

        utils.execSql('SELECT after FROM searches ' +
            'WHERE location = ? AND id > ? ' +
            'ORDER BY id DESC LIMIT 1', selectComplete, [ settings.locationId(), Date.now() - 10 * 3600 * 1000 ]);
    },

    finishSearch: function(nextPage) {
        var updateComplete = function() {
            $('#btnSeeAll').removeAttr('disabled');
            $('#btnLike').removeAttr('disabled').html('Like ' + home.persons_count + ' users');

            utils.progressHide();
            utils.unmask();

            app.set(consts.KEY_SEARCH_ID, home.search_id);

            flash.info('Found ' + home.persons_count + ' users', 2000);
        };

        if (nextPage != null) {
            utils.execSql('UPDATE searches SET after = ? WHERE id = ?', updateComplete, [ nextPage, home.search_id ]);
        }
        else {
            updateComplete();
        }
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
        var nextPage = utils.getJsonValue(data.paging.cursors.after);

        var nextData = function() {
            if (nextPage == null) {
                home.finishSearch(nextPage);
            }
            else {
                home.search(nextPage);
            }
        };

        var nextPerson = function() {
            index++;

            if (home.persons_count >= maxCount) {
                home.finishSearch(nextPage);
                return;
            }
            home.persons_count++;

            utils.progress(home.persons_count / maxCount * 100, 'Searching...');

            if (index < records.length) {
                var raw_person = records[index];
                var person = {};
                person.id = utils.getJsonValue(raw_person.userid);
                person.user_name = utils.getJsonValue(raw_person.username);

                var userInfo = utils.getJsonValue(raw_person.userinfo);
                person.gender = utils.getJsonValue(userInfo.gender_letter);
                person.age = utils.getJsonValue(userInfo.age);
                person.location = utils.getJsonValue(userInfo.location);
                person.orientation = utils.getJsonValue(userInfo.orientation);
                person.like = false;

                var thumbs = utils.getJsonValue(raw_person.thumbs);
                if (thumbs.length > 0) {
                    person.img_url = utils.getJsonValue(thumbs[0]['82x82']);
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

    savePerson: function(person, complete) {
        var insertComplete = function(resultSet) {
            utils.execSql("INSERT INTO search_persons (search_id, person_id) VALUES (?, ?)",
                complete, [home.search_id, person.id]);
        };

        var selectComplete = function(resultSet) {
            if (resultSet.rows.length > 0) {
                utils.execSql("UPDATE persons SET " +
                    "user_name = ?, " +
                    "gender = ?, " +
                    "age = ?, " +
                    "location = ?, " +
                    "orientation = ?, " +
                    "img_url = ? " +
                    "WHERE id = ?", insertComplete,
                    [ person.user_name, person.gender, person.age, person.location, person.orientation, person.img_url, person.id ]);
            }
            else {
                utils.execSql("INSERT INTO persons " +
                    "(id, user_name, gender, age, location, orientation, img_url, like) " +
                    "values (?, ?, ?, ?, ?, ?, ?, ?)", insertComplete,
                    [ person.id, person.user_name, person.gender, person.age, person.location, person.orientation, person.img_url, 0 ]);
            }
        };

        utils.execSql("SELECT id FROM persons WHERE id = ?", selectComplete, [ person.id ]);
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

        options.headers = { authorization: 'Bearer ' + settings.authCode() }
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