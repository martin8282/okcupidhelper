var home = {
    persons_count: 0, // Current click search count - expected to be < Settings count (400)
    total_count: 0, // Max count for current search - usually 1000
    found_count: 0, // Current search count - expected to be < total_count (1000)
    search_id: -1,
    next_page: null,

    init: function() {
        $('#btnSearch').unbind('click').click(home.startSearch);
        $('#btnSettings').click(function() { utils.navigateTo(consts.PAGE_SETTINGS); });
        $('#btnMatches').click(function() { utils.navigateTo(consts.PAGE_MATCHES); });
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
        if (app.get(consts.KEY_ERROR_MAX) == 'true') {
            utils.onSessionMaxCount();
            return;
        }
        utils.mask();

        var selectComplete = function(resultSet) {
            home.persons_count = 0;
            if (resultSet.rows.length > 0) {
                var record = resultSet.rows.item(0);
                home.search_id = record.id;
                home.next_page = record.next_page;
                home.total_count = record.total_count;
                home.found_count = record.found_count;
                home.search();
            }
            else {
                home.search_id = Date.now();
                home.next_page = null;
                home.total_count = 0;
                home.found_count = 0;
                utils.execSql('INSERT INTO searches (id, location, location_name, found_count, total_count, next_page, auth_token) ' +
                    'VALUES (?, ?, ?, 0, 0, NULL, ?)',
                    home.search,
                    [ home.search_id, settings.locationId(), settings.locationName(), settings.authCode() ]
                );
            }
        };

        utils.execSql('SELECT * FROM searches ' +
            'WHERE auth_token = ? AND next_page IS NOT NULL ' +
            'ORDER BY id DESC', selectComplete, [ settings.authCode() ] );
    },

    finishSearch: function() {
        var initComplete = function(allCount, newCount) {
            utils.progressHide();
            utils.unmask();

            flash.info('Found ' + allCount + ' users (' + newCount + ' new)' , 2000);
        };

        var updateComplete = function(resultSet) {
            app.set(consts.KEY_SEARCH_ID, home.search_id);
            home.initLikeButtons(initComplete);
        };

        utils.execSql('UPDATE searches SET ' +
            'found_count = ?, ' +
            'total_count = ?,' +
            'next_page = ? ' +
            'WHERE id = ?', updateComplete,
            [ home.found_count, home.total_count, home.next_page, home.search_id ]);
    },

    search: function() {
        if (home.next_page != null) query.after = home.next_page;

        query.locid = settings.locationId();
        query.minimum_age = settings.ageFrom();
        query.maximum_age = settings.ageTo();
        query.radius = settings.distance();
        query.gender_tags = settings.findWho();
        query.limit = consts.BATCH_COUNT;

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
        if (home.total_count == 0) home.total_count = utils.getJsonValue(data.total_matches);
        home.next_page = utils.getJsonValue(data.paging.cursors.after);

        var settingsCount = settings.number();
        var records = utils.getJsonValue(data.data);
        var index = -1;

        var nextPerson = function() {
            index++;

            var searchCompleted = home.found_count >= home.total_count;
            if (searchCompleted) home.next_page = null;

            if (searchCompleted || home.persons_count >= settingsCount) {
                home.finishSearch();
                return;
            }

            utils.progress(home.persons_count / settingsCount * 100, 'Searching...');
            if (index < records.length) {
                var person = utils.extractPerson(records[index]);
                home.save(person, nextPerson)
            }
            else {
                home.search();
            }
        };
        nextPerson();
    },

    save: function(person, complete) {
        var insertComplete = function(resultSet) {
            home.persons_count++;
            home.found_count++;
            complete();
        };

        var saveComplete = function() {
            utils.execSql("INSERT INTO search_persons (search_id, person_id) VALUES (?, ?)",
                insertComplete, [home.search_id, person.id]);
        };

        utils.savePerson(person, saveComplete);
    },

    likeAll: function() {
        var likeComplete = function() {
            utils.progressHide();
            utils.unmask();
            home.initLikeButtons();
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