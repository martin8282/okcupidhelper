var results = {
    persons: null,
    count: 0,

    init: function() {
        $('#btnBack').click(function() { app.set(consts.KEY_RESULTS, JSON.stringify(results.persons)); utils.navigateBack(); } );
        $('#btnLike').click(function() { results.likeSelected(0) });
        results.persons = JSON.parse(app.get(consts.KEY_RESULTS));
        results.drawResults();
    },

    drawResults: function() {
        var divResults = $('#divResults');

        for (var index = 0; index < results.persons.length; index++) {
            var person = results.persons[index];

            var divPerson = $('<div class="col-lg-3 col-md-4 col-xs-6 thumb"></div>');
            var aPerson = $('<a class="thumbnail" href="#"></a>').click(results.markLike).data('index', index);
            var imgPerson = $('<img class="img-responsive" />"').attr('src', person.img_url);

            var divBottom = $('<div></div>');
            divBottom.append('<span class="age">Age: ' + person.age + '</span>');
            divBottom.append('<span class="heart ' + (person.like ? 'like' : 'unlike') + '"></span>');

            aPerson.append(imgPerson);
            aPerson.append(divBottom);
            divPerson.append(aPerson);
            divResults.append(divPerson);
        }
    },

    markLike: function() {
        var index = $(this).data('index');
        var person = results.persons[index];
        var span = $(this).find('span.heart');
        if (person.like) {
            span.removeClass('like');
            span.addClass('unlike');
        }
        else {
            span.removeClass('unlike');
            span.addClass('like');
        }
        person.like = !person.like;
        return false;
    },

    likeSelected: function(cursor) {
        if (cursor == 0) {
            $(window).scrollTop(0);
            results.count = 0;
            utils.mask();
        }
        if (cursor >= results.persons.length) {
            utils.unmask(0);
            if (results.count) {
                flash.info('Completed! (' + results.count + ' users)' , 2000);
            }
            else {
                flash.info('No users selected', 2000);
            }
            return;
        }

        if (!results.persons[cursor].like) {
            results.likeSelected(cursor + 1);
            return;
        }

        var userId = results.persons[cursor].userId;
        var options = consts.optionsLike(userId, settings.authCode());

        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data != null && data.success == 'true') {
                // write to history
            }
            results.count += 1;
            results.likeSelected(cursor + 1);
        };

        options.show_mask = false;

        utils.request(options);
    }
};