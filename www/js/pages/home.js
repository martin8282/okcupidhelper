var home = {
    init: function() {
        var options = consts.optionsSearch(JSON.stringify(query));
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;
            alert(data.total_matches);
        }

        utils.request(options);
    }
}