function get(url) {
    return new Promise(function (req, res) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.onload = function () {
            if (httpRequest.status === 200) {
                // Return response text if promise is sucessful
                req(httpRequest.response);
            } else {
                // Return status text if promise fails
                res(Error(httpRequest.statusText));
            }
        };

        // Handle network errors
        httpRequest.onerror = function () {
            res(Error('Network Error'));
        };

        httpRequest.send();
    });
}

function successHandler(data) {
    const dataObj = JSON.parse(data);
    // const weatherDiv
    const div = `
        <h2>
        <img
            src="https://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
            <span>${tempToC(dataObj.main.temp)}&deg;</span> |
            ${dataObj.weather[0].description}
        </p>
    `;
    return div;
}

function failHandler(status) {
    console.log(status);
}

function tempToC(kelvin) {
    return (kelvin - 273.15).toFixed(0);
}

addEventListener('DOMContentLoaded', function () {
    // apiKey from OpenWeather
    const apiKey = 'f55738c0a1c34ff30d362068829d7fe3';
    // Empty apiKey to test server error
    // const apiKey = '';

    const weatherDiv = document.querySelector('#weather');

    const locations = [
        'toronto,ca',
        'ottawa,ca',
        'vancouver,ca',
        'new+york,us'
    ];

    const urls = locations.map(function (location) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
    });

    // Using async/wait
    (async function () {
        try {
            var responses = [];
            responses.push(await get(urls[0]));
            responses.push(await get(urls[1]));
            responses.push(await get(urls[2]));
            responses.push(await get(urls[3]));
            var literals = responses.map(function (response) {
                return successHandler(response);
            });
            weatherDiv.innerHTML = `<h1></h1>${literals.join('')}`;
        } catch (status) {
            failHandler(status);
        } finally {
            weatherDiv.classList.remove('hidden');
        }
    })();
});