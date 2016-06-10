var home = {
    init: function() {
        query.locid = app.get(consts.KEY_LOCATION);
<<<<<<< HEAD
        $('#btnSearch').click(home.startSearch);
    },

    animateButton: function() {
        $('#btnSearch').addClass('pushed');
        setTimeout(function() { $('#btnSearch').removeClass('pushed'); }, 100);
    },

    startSearch: function() {
        home.animateButton();
=======

>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
        var options = consts.optionsSearch(JSON.stringify(query));
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

<<<<<<< HEAD
            $('#btnSeeAll').removeAttr('disabled');
        }

        options.leave_mask = true;
        utils.request(options);
    },

    processResults: function(data) {
        var persons = [];
        $.each(data.data, function(index, raw_person) {
            var person = {};

        });
=======
            flash.info('Found ' + data.total_matches + ' records');
        }

        utils.request(options);
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
    }
}