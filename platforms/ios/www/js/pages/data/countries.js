var countries = [
  { value: consts.COUNTRY_USA, name: consts.COUNTRY_USA },
  { value: 'United Kingdom', name: 'United Kingdom'}, 
  { value: 'Canada', name: 'Canada'}, 
  { value: 'Australia', name: 'Australia'}, 
  { value: 'Singapore', name: 'Singapore'}, 
  { value: 'Ireland', name: 'Ireland'}, 
  { value: 'New Zealand', name: 'New Zealand'}, 
  { value: 'Philippines', name: 'Philippines'}, 
  { value: 'Sweden', name: 'Sweden'}, 
  { value: 'Finland', name: 'Finland'}, 
  { value: 'Afghanistan', name: 'Afghanistan'}, 
  { value: 'Albania', name: 'Albania'}, 
  { value: 'Algeria', name: 'Algeria'}, 
  { value: 'Andorra', name: 'Andorra'}, 
  { value: 'Angola', name: 'Angola'}, 
  { value: 'Anguilla', name: 'Anguilla'}, 
  { value: 'Antigua and Barbuda', name: 'Antigua and Barbuda'}, 
  { value: 'Argentina', name: 'Argentina'}, 
  { value: 'Armenia', name: 'Armenia'}, 
  { value: 'Aruba', name: 'Aruba'}, 
  { value: 'Ashmore and Cartier Islands', name: 'Ashmore and Cartier Islands'}, 
  { value: 'Austria', name: 'Austria'}, 
  { value: 'Azerbaijan', name: 'Azerbaijan'}, 
  { value: 'Bahamas', name: 'Bahamas'}, 
  { value: 'Bahrain', name: 'Bahrain'}, 
  { value: 'Bangladesh', name: 'Bangladesh'}, 
  { value: 'Barbados', name: 'Barbados'}, 
  { value: 'Belarus', name: 'Belarus'}, 
  { value: 'Belgium', name: 'Belgium'}, 
  { value: 'Belize', name: 'Belize'}, 
  { value: 'Benin', name: 'Benin'}, 
  { value: 'Bermuda', name: 'Bermuda'}, 
  { value: 'Bhutan', name: 'Bhutan'}, 
  { value: 'Bolivia', name: 'Bolivia'}, 
  { value: 'Bosnia and Herzegovina', name: 'Bosnia and Herzegovina'}, 
  { value: 'Botswana', name: 'Botswana'}, 
  { value: 'Brazil', name: 'Brazil'}, 
  { value: 'British Virgin Islands', name: 'British Virgin Islands'}, 
  { value: 'Brunei', name: 'Brunei'}, 
  { value: 'Bulgaria', name: 'Bulgaria'}, 
  { value: 'Burkina Faso', name: 'Burkina Faso'}, 
  { value: 'Burma', name: 'Burma'}, 
  { value: 'Burundi', name: 'Burundi'}, 
  { value: 'Cambodia', name: 'Cambodia'}, 
  { value: 'Cameroon', name: 'Cameroon'}, 
  { value: 'Cape Verde', name: 'Cape Verde'}, 
  { value: 'Cayman Islands', name: 'Cayman Islands'}, 
  { value: 'Central African Republic', name: 'Central African Republic'}, 
  { value: 'Chad', name: 'Chad'}, 
  { value: 'Chile', name: 'Chile'}, 
  { value: 'China', name: 'China'}, 
  { value: 'Christmas Island', name: 'Christmas Island'}, 
  { value: 'Colombia', name: 'Colombia'}, 
  { value: 'Comoros', name: 'Comoros'}, 
  { value: 'Congo', name: 'Congo'}, 
  { value: 'Cook Islands', name: 'Cook Islands'}, 
  { value: 'Coral Sea Islands', name: 'Coral Sea Islands'}, 
  { value: 'Costa Rica', name: 'Costa Rica'}, 
  { value: "Cote d'Ivoire", name: "Cote d'Ivoire"}, 
  { value: 'Croatia', name: 'Croatia'}, 
  { value: 'Cuba', name: 'Cuba'}, 
  { value: 'Cyprus', name: 'Cyprus'}, 
  { value: 'Czech Republic', name: 'Czech Republic'}, 
  { value: 'Democratic Republic of the Congo', name: 'Democratic Republic of the Congo'}, 
  { value: 'Denmark', name: 'Denmark'}, 
  { value: 'Djibouti', name: 'Djibouti'}, 
  { value: 'Dominica', name: 'Dominica'}, 
  { value: 'Dominican Republic', name: 'Dominican Republic'}, 
  { value: 'East Timor', name: 'East Timor'}, 
  { value: 'Ecuador', name: 'Ecuador'}, 
  { value: 'Egypt', name: 'Egypt'}, 
  { value: 'El Salvador', name: 'El Salvador'}, 
  { value: 'Equatorial Guinea', name: 'Equatorial Guinea'}, 
  { value: 'Eritrea', name: 'Eritrea'}, 
  { value: 'Estonia', name: 'Estonia'}, 
  { value: 'Ethiopia', name: 'Ethiopia'}, 
  { value: 'Europa Island', name: 'Europa Island'}, 
  { value: 'Falkland Islands', name: 'Falkland Islands'}, 
  { value: 'Faroe Islands', name: 'Faroe Islands'}, 
  { value: 'Fiji', name: 'Fiji'}, 
  { value: 'France', name: 'France'}, 
  { value: 'French Guiana', name: 'French Guiana'}, 
  { value: 'French Polynesia', name: 'French Polynesia'}, 
  { value: 'French Southern and Antarctic Lands', name: 'French Southern and Antarctic Lands'}, 
  { value: 'Gabon', name: 'Gabon'}, 
  { value: 'Gambia', name: 'Gambia'}, 
  { value: 'Gaza Strip', name: 'Gaza Strip'}, 
  { value: 'Georgia', name: 'Georgia'}, 
  { value: 'Germany', name: 'Germany'}, 
  { value: 'Ghana', name: 'Ghana'}, 
  { value: 'Gibraltar', name: 'Gibraltar'}, 
  { value: 'Glorioso Islands', name: 'Glorioso Islands'}, 
  { value: 'Greece', name: 'Greece'}, 
  { value: 'Greenland', name: 'Greenland'}, 
  { value: 'Grenada', name: 'Grenada'}, 
  { value: 'Guadeloupe', name: 'Guadeloupe'}, 
  { value: 'Guatemala', name: 'Guatemala'}, 
  { value: 'Guernsey', name: 'Guernsey'}, 
  { value: 'Guinea', name: 'Guinea'}, 
  { value: 'Guinea-Bissau', name: 'Guinea-Bissau'}, 
  { value: 'Guyana', name: 'Guyana'}, 
  { value: 'Haiti', name: 'Haiti'}, 
  { value: 'Heard Island and McDonald Islands', name: 'Heard Island and McDonald Islands'}, 
  { value: 'Honduras', name: 'Honduras'}, 
  { value: 'Hong Kong', name: 'Hong Kong'}, 
  { value: 'Hungary', name: 'Hungary'}, 
  { value: 'Iceland', name: 'Iceland'}, 
  { value: 'India', name: 'India'}, 
  { value: 'Indonesia', name: 'Indonesia'}, 
  { value: 'Iran', name: 'Iran'}, 
  { value: 'Iraq', name: 'Iraq'}, 
  { value: 'Isle of Man', name: 'Isle of Man'}, 
  { value: 'Israel', name: 'Israel'}, 
  { value: 'Italy', name: 'Italy'}, 
  { value: 'Jamaica', name: 'Jamaica'}, 
  { value: 'Jan Mayen', name: 'Jan Mayen'}, 
  { value: 'Japan', name: 'Japan'}, 
  { value: 'Jersey', name: 'Jersey'}, 
  { value: 'Jordan', name: 'Jordan'}, 
  { value: 'Juan de Nova Island', name: 'Juan de Nova Island'}, 
  { value: 'Kazakhstan', name: 'Kazakhstan'}, 
  { value: 'Kenya', name: 'Kenya'}, 
  { value: 'Kiribati', name: 'Kiribati'}, 
  { value: 'Kuwait', name: 'Kuwait'}, 
  { value: 'Kyrgyzstan', name: 'Kyrgyzstan'}, 
  { value: 'Laos', name: 'Laos'}, 
  { value: 'Latvia', name: 'Latvia'}, 
  { value: 'Lebanon', name: 'Lebanon'}, 
  { value: 'Lesotho', name: 'Lesotho'}, 
  { value: 'Liberia', name: 'Liberia'}, 
  { value: 'Libya', name: 'Libya'}, 
  { value: 'Liechtenstein', name: 'Liechtenstein'}, 
  { value: 'Lithuania', name: 'Lithuania'}, 
  { value: 'Luxembourg', name: 'Luxembourg'}, 
  { value: 'Macau', name: 'Macau'}, 
  { value: 'Macedonia', name: 'Macedonia'}, 
  { value: 'Madagascar', name: 'Madagascar'}, 
  { value: 'Malawi', name: 'Malawi'}, 
  { value: 'Malaysia', name: 'Malaysia'}, 
  { value: 'Maldives', name: 'Maldives'}, 
  { value: 'Mali', name: 'Mali'}, 
  { value: 'Malta', name: 'Malta'}, 
  { value: 'Marshall Islands', name: 'Marshall Islands'}, 
  { value: 'Martinique', name: 'Martinique'}, 
  { value: 'Mauritania', name: 'Mauritania'}, 
  { value: 'Mauritius', name: 'Mauritius'}, 
  { value: 'Mayotte', name: 'Mayotte'}, 
  { value: 'Mexico', name: 'Mexico'}, 
  { value: 'Micronesia Federal States', name: 'Micronesia Federal States'}, 
  { value: 'Moldova', name: 'Moldova'}, 
  { value: 'Monaco', name: 'Monaco'}, 
  { value: 'Mongolia', name: 'Mongolia'}, 
  { value: 'Montenegro', name: 'Montenegro'}, 
  { value: 'Montserrat', name: 'Montserrat'}, 
  { value: 'Morocco', name: 'Morocco'}, 
  { value: 'Mozambique', name: 'Mozambique'}, 
  { value: 'Namibia', name: 'Namibia'}, 
  { value: 'Nauru', name: 'Nauru'}, 
  { value: 'Nepal', name: 'Nepal'}, 
  { value: 'Netherlands', name: 'Netherlands'}, 
  { value: 'Netherlands Antilles', name: 'Netherlands Antilles'}, 
  { value: 'New Caledonia', name: 'New Caledonia'}, 
  { value: 'Nicaragua', name: 'Nicaragua'}, 
  { value: 'Niger', name: 'Niger'}, 
  { value: 'Nigeria', name: 'Nigeria'}, 
  { value: 'Niue', name: 'Niue'}, 
  { value: "No Man's Land", name: "No Man's Land"}, 
  { value: 'Norfolk Island', name: 'Norfolk Island'}, 
  { value: 'North Korea', name: 'North Korea'}, 
  { value: 'Norway', name: 'Norway'}, 
  { value: 'Oceans', name: 'Oceans'}, 
  { value: 'Oman', name: 'Oman'}, 
  { value: 'Pakistan', name: 'Pakistan'}, 
  { value: 'Palau', name: 'Palau'}, 
  { value: 'Panama', name: 'Panama'}, 
  { value: 'Papua New Guinea', name: 'Papua New Guinea'}, 
  { value: 'Paraguay', name: 'Paraguay'}, 
  { value: 'Peru', name: 'Peru'}, 
  { value: 'Pitcairn Islands', name: 'Pitcairn Islands'}, 
  { value: 'Poland', name: 'Poland'}, 
  { value: 'Portugal', name: 'Portugal'}, 
  { value: 'Qatar', name: 'Qatar'}, 
  { value: 'Reunion', name: 'Reunion'}, 
  { value: 'Romania', name: 'Romania'}, 
  { value: 'Russia', name: 'Russia'}, 
  { value: 'Rwanda', name: 'Rwanda'}, 
  { value: 'Saint Helena', name: 'Saint Helena'}, 
  { value: 'Saint Kitts and Nevis', name: 'Saint Kitts and Nevis'}, 
  { value: 'Saint Lucia', name: 'Saint Lucia'}, 
  { value: 'Saint Pierre and Miquelon', name: 'Saint Pierre and Miquelon'}, 
  { value: 'Saint Vincent and the Grenadines', name: 'Saint Vincent and the Grenadines'}, 
  { value: 'Samoa', name: 'Samoa'}, 
  { value: 'San Marino', name: 'San Marino'}, 
  { value: 'Sao Tome and Principe', name: 'Sao Tome and Principe'}, 
  { value: 'Saudi Arabia', name: 'Saudi Arabia'}, 
  { value: 'Senegal', name: 'Senegal'}, 
  { value: 'Serbia', name: 'Serbia'}, 
  { value: 'Seychelles', name: 'Seychelles'}, 
  { value: 'Sierra Leone', name: 'Sierra Leone'}, 
  { value: 'Slovakia', name: 'Slovakia'}, 
  { value: 'Slovenia', name: 'Slovenia'}, 
  { value: 'Solomon Islands', name: 'Solomon Islands'}, 
  { value: 'Somalia', name: 'Somalia'}, 
  { value: 'South Africa', name: 'South Africa'}, 
  { value: 'South Georgia and the South Sandwich Islands', name: 'South Georgia and the South Sandwich Islands'}, 
  { value: 'South Korea', name: 'South Korea'}, 
  { value: 'Spain', name: 'Spain'}, 
  { value: 'Spratly Islands', name: 'Spratly Islands'}, 
  { value: 'Sri Lanka', name: 'Sri Lanka'}, 
  { value: 'Sudan', name: 'Sudan'}, 
  { value: 'Suriname', name: 'Suriname'}, 
  { value: 'Svalbard', name: 'Svalbard'}, 
  { value: 'Swaziland', name: 'Swaziland'}, 
  { value: 'Switzerland', name: 'Switzerland'}, 
  { value: 'Syria', name: 'Syria'}, 
  { value: 'Taiwan', name: 'Taiwan'}, 
  { value: 'Tajikistan', name: 'Tajikistan'}, 
  { value: 'Tanzania', name: 'Tanzania'}, 
  { value: 'Thailand', name: 'Thailand'}, 
  { value: 'Togo', name: 'Togo'}, 
  { value: 'Tokelau', name: 'Tokelau'}, 
  { value: 'Tonga', name: 'Tonga'}, 
  { value: 'Trinidad and Tobago', name: 'Trinidad and Tobago'}, 
  { value: 'Tunisia', name: 'Tunisia'}, 
  { value: 'Turkey', name: 'Turkey'}, 
  { value: 'Turkmenistan', name: 'Turkmenistan'}, 
  { value: 'Turks and Caicos Islands', name: 'Turks and Caicos Islands'}, 
  { value: 'Tuvalu', name: 'Tuvalu'}, 
  { value: 'Uganda', name: 'Uganda'}, 
  { value: 'Ukraine', name: 'Ukraine'}, 
  { value: 'United Arab Emirates', name: 'United Arab Emirates'}, 
  { value: 'Uruguay', name: 'Uruguay'}, 
  { value: 'Uzbekistan', name: 'Uzbekistan'}, 
  { value: 'Vanuatu', name: 'Vanuatu'}, 
  { value: 'Venezuela', name: 'Venezuela'}, 
  { value: 'Vietnam', name: 'Vietnam'}, 
  { value: 'Wallis and Futuna', name: 'Wallis and Futuna'}, 
  { value: 'West Bank', name: 'West Bank'}, 
  { value: 'Western Sahara', name: 'Western Sahara'}, 
  { value: 'Yemen', name: 'Yemen'}, 
  { value: 'Zambia', name: 'Zambia'}, 
  { value: 'Zimbabwe', name: 'Zimbabwe'}
];