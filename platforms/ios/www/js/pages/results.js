var results = {
    updated: {},
    count: 0,

    init: function() {
        utils.mask();
        $('#btnBack').click(results.exit);
        $('#btnLike').click(results.likeSelected);
        $('a.like').click(results.selectAll).prop('disabled', true);

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
        if (length > 0) $('a.like').prop('disabled', false);
        setTimeout(utils.unmask, 1000);
    },

    markLike: function() {
        var id = $(this).data('id');
        var span = $(this).find('span.heart');
        var wasLike = span.hasClass('like');
        if (wasLike) {
            span.removeClass('like').addClass('unlike');
        }
        else {
            span.removeClass('unlike').addClass('like');
        }
        results.updated[id] = !wasLike;
        return false;
    },

    selectAll: function() {
        var wasLike = $(this).hasClass('like-all');
        if (wasLike) {
            $(this).removeClass('like-all').addClass('unlike-all').html('Like All');
        }
        else {
            $(this).removeClass('unlike-all').addClass('like-all').html('Unlike All');
        }

        utils.mask();
        results.updated = {};
        $('#tblResults').find('tr').each(function(index) {
            var id = $(this).data('id');
            var span = $(this).find('span.heart');
            if (wasLike) {
                span.removeClass('like').addClass('unlike');
            }
            else {
                span.removeClass('unlike').addClass('like');
            }
            results.updated[id] = !wasLike;
        });
        utils.unmask();
    },

    likeSelected: function() {
        var complete = function() {
            utils.unmask();
            utils.progressHide();
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
                if (ids.length > 10) utils.progress((index + 1) / ids.length * 100, 'Like...');

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
        utils.mask();
        results.count = 0;
        nextPerson();
    }
};