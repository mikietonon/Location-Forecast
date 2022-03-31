const API_KEY = config.SECRET_API_KEY;
const LOCATION_API_URL = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + API_KEY + "&q=";
const WEATHER_URL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";

//Function gets location ID through Accuweather API
async function getLocation() {
    if (document.getElementById("location").value == "") return; //Guard statement checks to make sure location is given

    let city = document.getElementById("location").value;
    console.log(city);

    const LOCATION_URL = LOCATION_API_URL + city;

    //Making an API call (request)
    //and getting the response back
    const LOCATION_RESPONSE = await fetch(LOCATION_URL);

    //Parsing it to JSON format
    const LOCATION_DATA = await LOCATION_RESPONSE.json();
    //console.log(LOCATION_DATA[0]);

    //Retrieving data from JSON
    const LOCATION_INFO = LOCATION_DATA[0];
    let locationKey = LOCATION_INFO.Key;

    //console.log(locationKey);
    getTemperature(locationKey);
}

async function getTemperature(locationKey) {
    //Creating URL with location key to get weather info
    const WEATHER_API_URL = WEATHER_URL + locationKey + "?apikey=" + API_KEY;

    //Making an API call (request)
    //and getting the response back
    const WEATHER_RESPONSE = await fetch(WEATHER_API_URL);

    //Parsing it to JSON format
    const WEATHER_DATA = await WEATHER_RESPONSE.json();

    //Retrieving data from JSON
    const WEATHER_INFO = WEATHER_DATA;

    //Getting header info and setting it
    let header = WEATHER_INFO.Headline.Text;
    document.getElementById("header").innerHTML = header + ".";

    let day = [];

    for (let i = 0; i <= 4; i++){
        day[i] = new weather(WEATHER_INFO.DailyForecasts[i].Date, 
            WEATHER_INFO.DailyForecasts[i].Temperature.Maximum.Value, 
            WEATHER_INFO.DailyForecasts[i].Temperature.Minimum.Value, 
            WEATHER_INFO.DailyForecasts[i].Day.IconPhrase,
            WEATHER_INFO.DailyForecasts[i].Day.PrecipitationType,
            WEATHER_INFO.DailyForecasts[i].Day.PrecipitationIntensity,
            WEATHER_INFO.DailyForecasts[i].Day.HasPrecipitation,
            WEATHER_INFO.DailyForecasts[i].Night.IconPhrase,
            WEATHER_INFO.DailyForecasts[i].Night.PrecipitationType,
            WEATHER_INFO.DailyForecasts[i].Night.PrecipitationIntensity,
            WEATHER_INFO.DailyForecasts[i].Night.HasPrecipitation);

            let dPrecip = day[i].dIntensity() + " " + day[i].dType();
            let nPrecip = day[i].nIntensity() + " " + day[i].nType();

            document.getElementById("date-text-"+i).innerHTML = getDate(day[i].date());
            document.getElementById("weather-type-day-"+i).innerHTML = day[i].dIcon();
            document.getElementById("weather-type-night-"+i).innerHTML = day[i].nIcon();
            document.getElementById("high-text-"+i).innerHTML = " " + toCelcius(day[i].high());
            document.getElementById("low-text-"+i).innerHTML = " " + toCelcius(day[i].low());

            if (day[i].dHasPrecip() === true) {
                document.getElementById('precipitation-day-'+i).innerHTML = dPrecip;
            } else {
                document.getElementById('weather-precip-day-'+i).style.display = 'none';
            }

            if (day[i].nHasPrecip() === true) {
                document.getElementById('precipitation-night-'+i).innerHTML = nPrecip;
            } else {
                document.getElementById('weather-precip-night-'+i).style.display = 'none';
            }
    }

    //Showing tiles with info
    showTiles();
}

//Converts JSON date info into a simpler format
function getDate(date){
    let myDate = new Date(date);

    return myDate.toDateString();
}

//Converts fahrenheit to celcius
function toCelcius(temp){ return finalTemp = Math.round((temp - 32) * 5/9); }

//Getter and setter for each weather panel
class weather {
    constructor(date, high, low, dIcon, dType, dIntensity, dHasPrecip, nIcon, nType, nIntensity, nHasPrecip) {
        this.date = date;
        this.high = high;
        this.low = low;
        this.dIcon = dIcon;
        this.dType = dType;
        this.dIntensity = dIntensity;
        this.dHasPrecip = dHasPrecip;
        this.nIcon = nIcon;
        this.nType = nType;
        this.nIntensity = nIntensity;
        this.nHasPrecip = nHasPrecip;

        this.date = function (str) {
            if (str !== undefined)
                date = str;
            return date;
        };

        this.high = function (str) {
            if (str !== undefined)
                high = str;
            return high;
        };

        this.low = function (str) {
            if (str !== undefined)
                low = str;
            return low;
        };

        this.dIcon = function (str) {
            if (str !== undefined)
                dIcon = str;
            return dIcon;
        };

        this.dType = function (str) {
            if (str !== undefined)
                dType = str;
            return dType;
        };

        this.dIntensity = function (str) {
            if (str !== undefined)
                dIntensity = str;
            return dIntensity;
        };

        this.dHasPrecip = function (str) {
            if (str !== undefined)
                dHasPrecip = str;
            return dHasPrecip;
        };

        this.nIcon = function (str) {
            if (str !== undefined)
                nIcon = str;
            return nIcon;
        };

        this.nType = function (str) {
            if (str !== undefined)
                nType = str;
            return nType;
        };

        this.nIntensity = function (str) {
            if (str !== undefined)
                nIntensity = str;
            return nIntensity;
        };

        this.nHasPrecip = function (str) {
            if (str !== undefined)
                nHasPrecip = str;
            return nHasPrecip;
        };
    }
}

//Displays tiles where temp info is
function showTiles() {
    document.getElementById('one').style.display = 'block';
    document.getElementById('two').style.display = 'block';
    document.getElementById('three').style.display = 'block';
    document.getElementById('four').style.display = 'block';
    document.getElementById('five').style.display = 'block';
}

//Click event for enter button
document.getElementById("enter").addEventListener("click", getLocation);

//Setting ENTER key to react same as "Enter" button
document.getElementById("location")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("enter").click();
    }
});

//showTiles();