var geo = {
    timeout: null,
    previousLocation: '',

    init: function() {
        geo.initCountries();
        $('#btnBack').click(utils.navigateBack);
    },

    initCountries: function() {
        var selectedCountry = null;
        var locationName = settings.locationName();
        if (locationName && locationName.indexOf(', ') > 2) {
            selectedCountry = locationName.substr(locationName.indexOf(', ') + 2);
        }

        $.each(countries, function(index, data) {
            var option = $('<option></option>').val(data.value).html(data.name);
            if (selectedCountry && selectedCountry == data.name) option.prop('selected', true);
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
        if (location != geo.previousLocation || location.length < 3) {
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
        var location = $('#tbLocation').val();

        flash.closeAll();
        geo.doRequest(country, location, function(message, records) {
            if (records.length == 0) {
                flash.error(utils.getJsonValue(message));
            }
            else if (records.length == 1) {
                flash.info(utils.getJsonValue(message));
                settings.locationId(records[0][consts.SETTING_LOCATION]);
                settings.locationName(
                    utils.getJsonValue(records[0][consts.SETTING_COUNTRY]),
                    utils.getJsonValue(records[0][consts.SETTING_CITY])
                );
                setTimeout(function() { geo.goNext(); }, 1000);
            }
            else {
                // show multiple results
            }
        });
    },

    doRequest: function(country, location, complete) {
        var options = consts.optionsLocation(country, location);
        options.success = function(response) {
            var data = utils.parseJSON(response.data);
            if (data == null) return;
            complete(data.message, utils.getJsonValue(data.results))
        };

        utils.request(options);
    },

    goNext: function() {
        if (app.previousPage() == consts.PAGE_SETTINGS) {
            utils.navigateBack();
        }
        else {
            utils.navigateTo(consts.PAGE_HOME);
        }
    }
};