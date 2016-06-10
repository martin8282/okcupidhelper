var geo = {
    timeout: null,
    previousLocation: '',

    init: function() {
        geo.initCountries();
        /*
         $('#btnGeoContinue').click(function() {
         var map = $('#divGeoScreen').find('.cell').locationpicker('map');
         app.set(consts.KEY_LATITUDE, map.location.latitude);
         app.set(consts.KEY_LONGITUDE, map.location.longitude);
         utils.navigateTo(consts.PAGE_HOME);
         });

         geo.showGeopicker();
        */
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
<<<<<<< HEAD
        $('#lbLocation').html($('#ddlCountry').val() == consts.COUNTRY_USA ? consts.MESSAGE_ENTER_ZIP : consts.MESSAGE_ENTER_CITY);
=======
        $('#lbLocation').html($('#ddlCountry').val() == consts.COUNTRY_USA ? 'Enter Your Zip code' : 'Enter Your City');
>>>>>>> 5dce02829113854c51dc68a07f7b79b816515240
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

            if (data.results.length == 0) {
                flash.error(data.message);
            }
            else if (data.results.length == 1) {
                flash.info(data.message);
                app.set(consts.KEY_LOCATION, data.results[0][consts.KEY_LOCATION]);
                setTimeout(function() { utils.navigateTo(consts.PAGE_HOME); }, 1000);
            }
            else {
                // show multiple results
            }
        }

        utils.request(options);
    }

    /*
    ,showGeopicker: function() {
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
    }*/
};