var results = {
    persons: null,

    init: function() {
        $('#btnBack').click(utils.navigateBack);
        results.persons = JSON.parse(app.get(consts.KEY_RESULTS));
        results.drawResults();
    },

    drawResults: function() {
        utils.mask('Loading results...');
        var divResults = $('#divResults');

        for (var index = 0; index < results.persons.length; index++) {
            var person = results.persons[index];

            var divPerson = $('<div class="col-lg-3 col-md-4 col-xs-6 thumb"></div>');
            var aPerson = $('<a class="thumbnail unlike" href="#"></a>').click(results.markLike).data('index', index);
            var imgPerson = $('<img class="img-responsive" />').attr('src', person.img_url);

            aPerson.append(imgPerson);
            divPerson.append(aPerson);
            divResults.append(divPerson);
        }

        setTimeout(utils.unmask, 2000);
    },

    markLike: function() {
        var index = $(this).data('index');
        var person = results.persons[index];
    }
};