const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document. querySelector(".temperature"),
    feelslike = document.querySelector(".feelsLike"), 
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    Hvalue = document.getElementById("Hvalue"),
    Wvalue = document.getElementById( "Wvalue"),
    SRvalue = document.getElementById("SRvalue"),
    SSvalue = document.getElementById("SSvalue"),
    Cvalue = document.getElementById( "Cvalue"),
    UVvalue = document.getElementById( "UVvalue"),
    Pvalue = document.getElementById("Pvalue"),
    Forecast = document.querySelector(".Forecast");


WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=1416075e79f56a7aa4fb72a50ed30d75&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=1416075e79f56a7aa4fb72a50ed30d75&exclude=minutely&units=metric&`;
 

userLocation.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        findUserLocation();
    }
});


function findUserLocation()
{
    Forecast.innerHTML="";
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
        if(data.cod!='' && data.cod!= 200){
            alert(data.message);
            return;
        }
        console.log(data);

        city.innerHTML = data.name + ", " + data.sys.country;

        weatherIcon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`

        end(data.coord.lat, data.coord.lon);

    });
}

function end(lat, lon){
    fetch(
        WEATHER_DATA_ENDPOINT+`lon=${lon}&lat=${lat}`
    )

    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        temperature.innerHTML=TempConverter(data.current.temp);
        feelslike.innerHTML= "Feels Like " +TempConverter(data.current.feels_like);
        description.innerHTML=`<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
        data.current.weather[0].description;

        const options={
            weekday:"long",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
            hour12: true,
        }

        date.innerHTML= getLongFormatDateTime(data.current.dt, data.timezone_offset, options);

        Hvalue.innerHTML=Math.round(data.current.humidity)+"<span>%</span>";
        Wvalue.innerHTML=Math.round(data.current.wind_speed)+"<span>m/s</span>";

        const options1 = {
            hour:"numeric",
            minute:"numeric",
            hour12: true,
        }
        SRvalue.innerHTML=getLongFormatDateTime(data.current.sunrise,data.timezone_offset, options1);
        SSvalue.innerHTML=getLongFormatDateTime(data.current.sunset,data.timezone_offset, options1);

        Cvalue.innerHTML=data.current.clouds+"<span>%</span>";
        UVvalue.innerHTML=data.current.uvi;
        Pvalue.innerHTML=Math.round(data.current.pressure)+"<span> hPa</span>";
        
        data.daily.forEach((weather) => {
            let div=document.createElement("div");

            const options={
                weekday:"long",
                month:"long",
                day:"numeric",
            }
            
            let daily = getLongFormatDateTime(weather.dt,0,options).split(" at ");
            div.innerHTML=daily[0];
            div.innerHTML+=`<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="img"/>`;
            div.innerHTML+=`<p class="forecast-desc">${weather.weather[0].description}`;
            div.innerHTML+=`<span><span>${TempConverter(weather.temp.min)}</span>&nbsp;&nbsp;<span>${TempConverter(weather.temp.max)}</span></span>`;
            Forecast.append(div);
        });
    });
};

function formatUnixTime(dtValue, offSet, options={})
{
    const date = new Date((dtValue+offSet)*1000);
    return date.toLocaleTimeString([], {timeZone: "UTC", ...options});
}

function getLongFormatDateTime(dtValue, offSet, options)
{
    return formatUnixTime(dtValue, offSet, options)
}

function TempConverter(temp){
    let tempValue = Math.round(temp);
    let message = "";
    if(converter.value=="°C"){
        message=tempValue+"<span>"+"\xB0C</span>";
    }
    else{
        let ctof=(tempValue*9) / 5 + 32;
        message=ctof+"<span>"+"\xB0F</span>";
    }

    return message;
}



function GetUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(lat, lon);
                end(lat, lon);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please enter a city name.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}



function applyDarkModeToDynamicElements() {
    const isDMode = document.body.classList.contains("dark-mode"); // Check if dark mode is active

    // Apply or remove dark mode class to forecast and highlight cards
    document.querySelectorAll(".Forecast div, .highlight div, .forecast-desc").forEach(tile => {
        tile.classList.toggle("dark-mode", isDMode);
    });
}

let toggleDarkModeBtn = document.getElementById('toggle');

let isDarkMode = false;

toggleDarkModeBtn.addEventListener('click', function() {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".weather-input").classList.toggle("dark-mode");
    document.querySelector(".weather-output").classList.toggle("dark-mode");
    document.querySelector(".toggle").classList.toggle("dark-mode");
    isDarkMode = !isDarkMode; 

    const inputs = document.querySelectorAll(".input-group input");
    inputs.forEach(input => input.classList.toggle("dark-mode"));
    
    applyDarkModeToDynamicElements();

    document.getElementById('sun-icon').style.display = isDarkMode ? 'none' : 'block';
    document.getElementById('moon-icon').style.display = isDarkMode ? 'block' : 'none';
});

function setDarkModeBasedOnTime() {
    const currentHour = new Date().getHours(); // Get the current hour (0-23)
    
    // Define the start and end hour for dark mode
    const startHour = 18; // 7 PM
    const endHour = 6;    // 6 AM

    // Check if current time is within the dark mode range
    if (currentHour >= startHour || currentHour < endHour) {
        // If time-based dark mode should be enabled
        document.body.classList.add("dark-mode");
        document.querySelector(".weather-input").classList.add("dark-mode");
        document.querySelector(".weather-output").classList.add("dark-mode");
        document.querySelector(".toggle").classList.add("dark-mode");

        const inputs = document.querySelectorAll(".input-group input");
        inputs.forEach(input => input.classList.add("dark-mode"));
        
        applyDarkModeToDynamicElements();

        // Set the correct icon visibility
        document.getElementById('sun-icon').style.display = 'none';
        document.getElementById('moon-icon').style.display = 'block';
        isDarkMode = true;
    }
}

window.onload = () => {
    setDarkModeBasedOnTime();
    GetUserLocation();
};
