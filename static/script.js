function getHealthData() {
    var country = document.getElementById("countryName").value;
    fetch(`https://disease.sh/v3/covid-19/countries/${country}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        var resultDiv = document.getElementById("healthDataResult");
        if (data.message) {
            resultDiv.innerHTML = `<p>${data.message}</p>`;
        } else {
            resultDiv.innerHTML = `<p>População do País: ${data.population}</p>`;
            resultDiv.innerHTML += `<p>Casos de COVID-19: ${data.cases}</p>`;
            resultDiv.innerHTML += `<p>Mortes de COVID-19: ${data.deaths}</p>`;
            return fetch(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=1&fullData=false`);
        }
    })
    .then(response => response.json())
    .then(data => {
        var resultDiv = document.getElementById("healthDataResult");
        if (data.error) {
            resultDiv.innerHTML += `<p>${data.error}</p>`;
        } else {
            resultDiv.innerHTML += `<p>Pessoas Vacinadas: ${data.timeline[Object.keys(data.timeline)[0]]}</p>`;
        }
    })
}