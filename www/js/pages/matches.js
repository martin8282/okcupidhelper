var matches = {
    init: function() {
        $('#btnBack').click(matches.exit);
        $('#aAll').click(matches.showAll);
        $('#aMatches').click(matches.showMatches);
        matches.showMatches();
    },

    exit: function() {
        utils.navigateBack();
    },

    showAll: function() {
        utils.getPersons(function(resultSet) {
            matches.drawResults(resultSet.rows, resultSet.rows.length);
        }, { condition: 'like = 1' });
    },

    showMatches: function() {
        var options = consts.optionsMutualLike(settings.authCode());

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

            matches.drawResultsMatches(data);
        };

        utils.request(options);
    },

    drawResultsMatches: function(data) {
        var tblResult = $('#tblResults');
        tblResult.empty();

        var records = utils.getJsonValue(data.data);
        var index = -1;

        if (records.length == 0) {
            flash.info(data.title, 3000);
            return;
        }

        var nextPerson = function() {
            index++;

            if (index < records.length) {
                var raw_person = utils.getJsonValue(records[index].user);
                var person = utils.extractPerson(raw_person);

                utils.savePerson(person, function() {
                    matches.drawRow(tblResult, person);
                    nextPerson();
                });
            }
        };
        nextPerson();
    },

    drawResults: function(rows, length) {
        var tblResult = $('#tblResults');
        tblResult.empty();

        if (length == 0) {
            flash.info('No users were liked so far', 3000);
            return;
        }

        utils.mask();

        for (var index = 0; index < length; index++) {
            var person = rows.item(index);
            matches.drawRow(tblResult, person)
        }

        setTimeout(utils.unmask, 500);
    },

    drawRow: function(tblResult, person) {
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
};