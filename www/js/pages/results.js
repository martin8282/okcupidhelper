var results = {
    updated: {},
    count: 0,

    init: function() {
        utils.mask();
        $('#btnBack').click(results.exit);
        $('#btnLike').click(results.likeSelected);

        var selectComplete = function(resultSet) {
            results.drawResults(resultSet.rows, resultSet.rows.length);
        };

        var searchId = parseInt(app.get(consts.KEY_SEARCH_ID));

        utils.execSql('SELECT persons.* FROM persons ' +
            'JOIN search_persons ON search_persons.person_id = persons.id ' +
            'WHERE search_persons.search_id = ?', selectComplete, [ searchId ]);
    },

    exit: function() {
        utils.mask();
        utils.navigateBack();
    },

    drawResults: function(rows, length) {
        var tblResult = $('#tblResults');
        for (var index = 0; index < length; index++) {
            var person = rows.item(index);
            var tr = $('<tr></tr>');
            var td = $('<td></td>');
            var img = $('<img class="img-responsive" />"').attr('src', person.img_url);
            td.append(img);
            tr.append(td);

            td = $('<td><span class="person>">' + person.user_name + ' (' + person.age + ')</span></td>');
            tr.append(td);

            td = $('<td><span class="heart ' + (person.like == 1 ? 'like' : 'unlike') + '"></span></td>');
            tr.append(td);

            tr.data('id', person.id).click(results.markLike);
            tblResult.append(tr);
        }
        utils.unmask();
    },

    markLike: function() {
        var id = $(this).data('id');
        var span = $(this).find('span.heart');
        var wasLike = span.hasClass('like');
        if (wasLike) {
            span.removeClass('like');
            span.addClass('unlike');
        }
        else {
            span.removeClass('unlike');
            span.addClass('like');
        }
        results.updated[id] = !wasLike;
        return false;
    },

    likeSelected: function() {
        var complete = function() {
            utils.unmask();
            if (results.count) {
                flash.info('Completed! (' + results.count + ' users)' , 2000);
            }
            else {
                flash.info('No users selected', 2000);
            }
        };

        var index = -1;
        var ids = Object.keys(results.updated);
        var nextPerson = function() {
            index++;
            if (index < ids.length) {
                var id = ids[index];
                var like = results.updated[id];
                if (like) {
                    results.like(id, nextPerson);
                }
                else {
                    nextPerson();
                }
            }
            else {
                complete();
            }
        };

        //utils.mask();
        results.count = 0;
        nextPerson();
    },

    like: function(id, complete) {
        var options = consts.optionsLike(id);
        options.headers = { authorization: 'Bearer ' + settings.authCode() };

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success == 'true') {
                // write to history
            }
            results.count += 1;
            complete();
        };

        //options.show_mask = false;
        utils.request(options);
    }
};