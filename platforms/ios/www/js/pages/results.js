var results = {
    updated: {},
    count: 0,

    init: function() {
        utils.mask();
        $('#btnBack').click(results.exit);
        $('#btnLike').click(results.likeSelected);

        utils.getPersonsForSearch(app.get(consts.KEY_SEARCH_ID), function(resultSet) {
            results.drawResults(resultSet.rows, resultSet.rows.length);
        });
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
            var img = $('<img />"').attr('src', person.img_url);
            td.append(img);
            tr.append(td);

            td = $('<td><span class="person>"><b>' + person.user_name + ' (' + person.age + ')</b><br />' + person.rel_status +'</span></td>');
            tr.append(td);

            td = $('<td><span class="heart ' + (person.like == 1 ? 'like' : 'unlike') + '"></span></td>');
            tr.append(td);

            tr.data('id', person.id).click(results.markLike);
            tblResult.append(tr);
        }
        setTimeout(utils.unmask, 1000);
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
            results.updated = {};

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
                    utils.like(id, function() { results.count += 1; nextPerson(); });
                }
                else {
                    nextPerson();
                }
            }
            else {
                complete();
            }
        };
        $(window).scrollTop(0);
        utils.mask();
        results.count = 0;
        nextPerson();
    }
};