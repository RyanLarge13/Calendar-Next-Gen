<img style="width: 50px; height: 50px;" src="./public/favicon.svg" alt="app icon" />

# Calendar Next Gen

## Version 1.0.0

<img src="https://img.shields.io/badge/Release-TBT-orange?style=for-the-badge&logo=react" alt="release date" /><br />
<img src="https://img.shields.io/badge/Web-Visit Site-violet?style=for-the-badge&logo=appveyor" alt="website" /><br />
<img src="https://img.shields.io/badge/License-MIT-indigo?style=for-the-badge&logo=opensourceinitiative" alt="website" /><br />

<p><b>CNG is a PWA installable cross platform web application built for the orginized. There is a ton of functionality, integration & fun in this app. Some of the things that can be done with this app includes...</b></p>

<ul>
<li>Adding events, reminders, todo-Lists, kanban boards, tasks & more</li>
<li>Sync with Google Calendar</li>
<li>Works online & offline!</li>
<li>Sign in with Google, Facebook, Github, Discord & more.</li>
</ul>

<p><b>Hourly notifications will persist when the tab on your browser is still open for the website. <i>No notification support for mobile devices.</i> You will be promted to accept notifications first. If accepted, it will display the current temperature of the hour in your area.</b></p>

<p><b>For an added touch to the website as any good weather site would include are three top news articles in the US that will redirect you to the article.</b></p>

## Table Of Contents

- <a href="#location">Location</a>
  - <a href="#weather-data">Weather Data</a>
  - <a href="#city-and-county">City And County</a>
- <a href="#notifications">Notifications</a>
  - <a href="#frequency">Frequency</a>
  - <a href="#location-data">Location Data</a>
  - <a href="#weather-data">Weather Data</a>
- <a href="#accuracy-and-features">Accuracy And Features</a>
  - <a href="#weather-data">Weather Data</a>
- <a href="#contributions">Contributions</a>
- <a href="#refrences">Refrences</a>

## Location

<img src="https://img.shields.io/badge/Permissons-Requested-green?style=flat&logo=appveyor" alt="permissons" /><br />
<img src="https://img.shields.io/badge/Saftey-10/10-green?style=flat&logo=appveyor" alt="website" /><br />
<img src="https://img.shields.io/badge/User Data Storage-Prohibited-green?style=flat&logo=databricks" alt="website" /><br />

### Weather Data

<p><b>All weather data is requested by your longitude and latitude coordinates via Javascripts built in Navigator API and sent through an <a href="https://open-meteo.com/en/docs">Open Meteo</a> query string. Open Meteo carries outstanding accuracy in their information from cities, town & counties all around the world providing you with reliable data.</b></p>

<p><i>THINGS TO CONSIDER</i></p>

<ul>
<li>Depending on your place in the world (if extremely rural), and no data for your exact coordinates exsists, Open Meteo will either provide you with weather data from the closest town to your coordinates with exsisting information, or weather data from the county your coordinates reside in.</li>
<li>Weather information is gathered from multiple data sources dependant to your country</li>
</ul>

### City And County

<p><b>Via <a href="https://openweathermap.org/api">Open Weather Map API</a>, reverse geocoding is used to fetch your city and county information via coordinates given from Javascripts Navigation API</b></p>

<p><i>THINGS TO CONSIDER</i></p>

<ul>
<li>Depending on your place in the world (if extremely rural), and no data for your exact coordinates exsists, Open Weather Map will either provide you with city & county information from the closest town to your coordinates, or city & county from the closest county your coordinates reside in.</li>
<li>In rare cases the city & county information returned might not match the weather information given from Open Meteo exactly.</li>
</ul>

**_!!!No location data is ever stored in ANY way to ANY databases, localstorage, cookies, or any other place!!!_**

## Notifications

<img src="https://img.shields.io/badge/Permissons-Requested-green?style=flat&logo=appveyor" alt="permissons" /><br />
<img src="https://img.shields.io/badge/Saftey-10/10-green?style=flat&logo=appveyor" alt="website" /><br />
<img src="https://img.shields.io/badge/Frequency-Every Hour-yellow?style=flat&logo=appveyor" alt="website" /><br />

### Frequency

<p><b>The frequency that notifications are sent to your browser starts when loading the wesite and every hour thereafter after the permissons & IF the permissions have been accepted. At any time you can turn off notification in the browser by going to the settings for this website on thr browser and turning them off.</b></p>

<p><i>THINGS TO CONSIDER</i></p>

<ul>
<li>The website will not request again for your notification permissions if they are denied. You will need to manually turn notifications back on from the browser agian if your mind changes.</li>
</ul>

### Location Data

<p><b>Your locaton is shown in the notification from the data recieved by reverse geoloation provided by Open Weather Map's API... <a href="#location">See Location Info</a></b></p>

### Weather Data

<p><b>The weather data shown in the notification each hour is the current hours current temperature provided to you by Open Meteo's API... <a href="#weather-data">See Weather Data</a></b></p>

<p><i>THINGS TO CONSIDER</i></p>

<ul>
<li>No icon is shown in the notification as of Version 1.</li>
<li>Top 3 US News Articles</li>
</ul>

<p><b>Hourly notifications will persist when the tab on your browser is still open for the website. <i>No notification support for mobile devices.</i> You will be promted to accept notifications first. If accepted, it will display the current temperature of the hour in your area.</b></p>

<p><b>For an added touch to the website as any good weather site would include are three top news articles in the US that will redirect you to the article.</b></p>

## Data Reliability

<img src="https://img.shields.io/badge/Accurancy-8/10-green?style=flat&logo=appveyor" alt="permissons" /><br />
<img src="https://img.shields.io/badge/UI-8/10-green?style=flat&logo=uikit" alt="website" /><br />

### Accuracy And Features

- Data
  - Open Meteo & Open Weather Map provide you with extremely accurate information.
  - Open Meteo gathers weather information from all around the world and multiple data providers based on your country for the most up to data information in your area.
    - Todays Forcast
      - Weather Icon
      - weather Name
      - High Low
      - Precipitation % (avarage for the 24 period)
      - windspeed
      - UV Index
      - Sunrise/Sunset
      - Current date
    - Hourly Forcast
      - Weather Icon
      - High Temp
      - Humidity
      - Windspeed
      - Apparent Temp
      - Time (hour)
    - Daily Forcast
      - Weather icon
      - Week Day
      - High/Low temp
      - Sunrise/Sunset
      - Precipitation Percentage
      - UV Index
  - Open Weather Maps large store of cities, towns, countries, states & counties garuntees you will be provided with percice location information based on your longitude and latitude.
    - If no state is present it will show your city/town and country
- UI
  - SVG Icons for 7 different weather states are provided.
    - Rain
    - Snow
    - Sun
    - Clouds
    - Storm
    - Drizzle
    - Fog
  - The application will automatically dedect wether or not it is day time or night time by cross refrencing the current hour and the hourly sunset/sunrise data given from Open Meteo API
  - Today's Forcast, Hourly Forcast & Weekly Forcast are split between three sections for ease of access and orginization

## Contributions

## Refrences
