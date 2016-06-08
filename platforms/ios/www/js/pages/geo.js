var geo = {
    init: function() {
        $('#btnGeoContinue').click(function() {
            var map = $('#divGeoScreen').find('.cell').locationpicker('map');
            app.set(consts.KEY_LATITUDE, map.location.latitude);
            app.set(consts.KEY_LONGITUDE, map.location.longitude);
            utils.navigateTo(consts.PAGE_HOME);
        });

        geo.showGeopicker()
    },

    showGeopicker: function() {
        // mask

        var geo = $('#divGeoScreen');
        geo.find('.cell').locationpicker({
            radius: 10,
            inputBinding: {
                locationNameInput: $('#tbLocation'),
                radiusInput: $('#tbRadius')
            },
            enableAutocomplete: true,
            oninitialized: function(component) {
                // unmask
            }
        });

        geo.removeClass('hidden');
    }
}