var matches = {
    init: function() {
        $('#btnBack').click(matches.exit);
        $('#aAll').click(matches.showAll);
        $('#aMatches').click(matches.showMatches);
        $('#btnRefresh').click(matches.refreshMatches)
        matches.showAll();
    },

    exit: function() {
        utils.navigateBack();
    },

    showAll: function() {
        $('#btnRefresh').hide();
        utils.getPersons(function(resultSet) {
            matches.drawResults(resultSet.rows, resultSet.rows.length, false);
        }, { condition: 'like = 1' });
    },

    showMatches: function() {
        $('#btnRefresh').show();
        utils.getPersons(function(resultSet) {
            matches.drawResults(resultSet.rows, resultSet.rows.length, true);
        }, { condition: 'mutual_like = 1' });
    },

    refreshMatches: function() {

    },

    drawResults: function(rows, length, mutual) {
        var tblResult = $('#tblResults');
        tblResult.empty();

        if (length == 0) {
            var message = mutual ?
                "You don't have any mutual likes yet" :
                'No users were liked so far';
            flash.info(message, 3000);
            return;
        }

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

            tr.data('id', person.id);
            tblResult.append(tr);
        }
    }
};