var home = {
    init: function() {
        query.locid = app.get(consts.KEY_LOCATION);

        var options = consts.optionsSearch(JSON.stringify(query));
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

            flash.info('Found ' + data.total_matches + ' records');
        }

        utils.request(options);
    }
}