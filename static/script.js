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
            var fetchVaccineCoverage = fetch(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=1&fullData=false`);
            return Promise.all([fetchVaccineCoverage, data]);  // Return both fetch promises
        }
    })
    .then(([vaccineResponse, covidData]) => vaccineResponse.json().then(vaccineData => ({ vaccineData, covidData })))
    .then(({ vaccineData, covidData }) => {
        var resultDiv = document.getElementById("healthDataResult");
        if (vaccineData.error) {
            resultDiv.innerHTML += `<p>${vaccineData.error}</p>`;
        } else {
            resultDiv.innerHTML += `<p>Pessoas Vacinadas: ${vaccineData.timeline[Object.keys(vaccineData.timeline)[0]]}</p>`;

            // Send data to server
            fetch('/save-health-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pais: country,
                    populacao: covidData.population,
                    casos: covidData.cases,
                    mortes: covidData.deaths,
                    pessoas_vacinadas: vaccineData.timeline[Object.keys(vaccineData.timeline)[0]]
                })
            })
            .then(response => response.json())
            .then(result => console.log('Data saved:', result))
            .catch(error => console.error('Error saving data:', error));
        }
    })
    .catch(error => console.error('Error fetching data:', error));
}
