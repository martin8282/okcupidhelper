var home = {
    persons_count: 0,
    search_id: -1,

    init: function() {
        $('#btnSearch').click(home.startSearch);
        $('#btnSettings').click(function() { utils.navigateTo(consts.PAGE_SETTINGS); });
        $('#lbLocation').html(settings.locationName());
        $('#btnLike').click(home.likeAll);
        $('#btnSeeAll').click(function() { utils.navigateTo(consts.PAGE_RESULTS); });

        home.initLikeButtons();
    },

    animateButton: function() {
        $('#btnSearch').addClass('pushed');
        setTimeout(function() { $('#btnSearch').removeClass('pushed'); }, 100);
    },

    initLikeButtons: function(complete) {
        var allCount = 0;
        var newCount = 0;

        var selectNewComplete = function(resultSet) {
            newCount = resultSet != null ? resultSet.rows.item(0).count : 0;
            $('#btnLike').prop('disabled', newCount == 0)
                .html(newCount > 0 ? ('Like ' + newCount + ' users') : 'Like them all');

            if (isDef(complete)) complete(allCount, newCount);
        };

        var selectAllComplete = function(resultSet) {
            allCount = resultSet != null ? resultSet.rows.item(0).count : 0;
            $('#btnSeeAll').prop('disabled', allCount == 0);

            utils.getPersonsForSearch(app.get(consts.KEY_SEARCH_ID), selectNewComplete,
                { select_count: true, condition: 'persons.like = 0' });
        };

        utils.getPersonsForSearch(app.get(consts.KEY_SEARCH_ID), selectAllComplete, { select_count: true });
    },

    startSearch: function() {
        home.animateButton();
        home.persons_count = 0;
        home.search_id = Date.now();

        utils.mask();

        var insertComplete = function(resultSet) {
            home.search(app.get(consts.KEY_SEARCH_PAGE));
        };

        utils.execSql('INSERT INTO searches (id, location, location_name) VALUES (?, ?, ?)',
            insertComplete, [ home.search_id, settings.locationId(), settings.locationName() ]
        );
    },

    finishSearch: function(nextPage) {
        var initComplete = function(allCount, newCount) {
            utils.progressHide();
            utils.unmask();

            flash.info('Found ' + allCount + ' users (' + newCount + ' new)' , 2000);
        };

        app.set(consts.KEY_SEARCH_PAGE, nextPage)
        app.set(consts.KEY_SEARCH_ID, home.search_id);

        home.initLikeButtons(initComplete);
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
                person.rel_status = utils.getJsonValue(userInfo.rel_status);

                var likes = utils.getJsonValue(raw_person.likes);
                person.mutual_like = utils.getIntbool(utils.getJsonValue(likes.mutual_like));
                person.like = utils.getIntbool(utils.getJsonValue(likes.you_like));

                var thumbs = utils.getJsonValue(raw_person.thumbs);
                if (thumbs.length > 0) {
                    person.img_url = utils.getJsonValue(thumbs[0]['82x82']);
                }
                else {
                    person.img_url = null;
                }

                home.savePerson(person, function() { home.persons_count++; nextPerson() });
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
                    "rel_status = ?, " +
                    "img_url = ?, " +
                    "like = ?, " +
                    "mutual_like = ? " +
                    "WHERE id = ?", insertComplete,
                    [ person.user_name, person.gender, person.age, person.location,
                        person.orientation, person.rel_status, person.img_url,
                        person.like, person.mutual_like,
                        person.id ]);
            }
            else {
                utils.execSql("INSERT INTO persons " +
                    "(id, user_name, gender, age, location, orientation, rel_status, img_url, like, mutual_like) " +
                    "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", insertComplete,
                    [ person.id, person.user_name, person.gender, person.age, person.location,
                        person.orientation, person.rel_status, person.img_url,
                        person.like, person.mutual_like ]);
            }
        };

        utils.execSql("SELECT id FROM persons WHERE id = ?", selectComplete, [ person.id ]);
    },

    likeAll: function() {
        var likeComplete = function() {
            utils.progressHide();
            utils.unmask();
        };

        var selectComplete = function(resultSet) {
            var index = -1;
            var rows = resultSet.rows;
            var nextPerson = function() {
                index++;

                utils.progress((index + 1) / rows.length * 100, 'Like...');
                if (index < rows.length) {
                    var person = rows.item(index);
                    if (person.like == 0) {
                        utils.like(rows.item(index).id, nextPerson);
                    }
                    else {
                        likeComplete();
                    }
                }
                else {
                    likeComplete();
                }
            };

            utils.mask();
            nextPerson();
        };

        utils.getPersonsForSearch(app.get(consts.KEY_SEARCH_ID), selectComplete);
    }
}