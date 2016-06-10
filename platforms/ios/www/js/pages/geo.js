var geo = {
    timeout: null,
    previousLocation: '',

    init: function() {
        geo.initCountries();
    },

    initCountries: function() {
        $.each(countries, function(index, data) {
            var option = $('<option></option>').val(data.value).html(data.name);
            $('#ddlCountry').append(option);
        });

        $('#ddlCountry').on('change', geo.setLabel);
        $('#tbLocation').on('keyup', geo.onLocationChange).on('change', geo.onLocationChange);

        geo.setLabel();
    },

    setLabel: function() {
        $('#lbLocation').html($('#ddlCountry').val() == consts.COUNTRY_USA ? consts.MESSAGE_ENTER_ZIP : consts.MESSAGE_ENTER_CITY);
        $('#tbLocation').empty().focus();
    },

    onLocationChange: function() {
        if (geo.timeout == null) geo.setTimeout();
    },

    setTimeout: function() {
        geo.previousLocation = $('#tbLocation').val();
        geo.timeout = setTimeout(geo.onTimeoutLocation, 500);
   },

    onTimeoutLocation: function() {
        var location = $('#tbLocation').val();
        if (location != geo.previousLocation) {
            geo.setTimeout();
        }
        else {
            geo.requestLocation();
            geo.timeout = null;
        }
    },

    requestLocation: function() {
        var country = $('#ddlCountry').val();
        if (country == consts.COUNTRY_USA) country = null;

        var mask = $('#tbLocation').val();
        var options = consts.optionsLocation(country, mask);
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;

            var records = utils.getJsonValue(data.results);
            if (records.length == 0) {
                flash.error(utils.getJsonValue(data.message));
            }
            else if (records.length == 1) {
                flash.info(utils.getJsonValue(data.message));
                app.set(consts.KEY_LOCATION, utils.getJsonValue(records[0][consts.KEY_LOCATION]));
                setTimeout(function() { utils.navigateTo(consts.PAGE_HOME); }, 1000);
            }
            else {
                // show multiple results
            }
        }

        utils.request(options);
    }
};