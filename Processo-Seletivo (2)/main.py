from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

rest_api = "https://restcountries.com/v3.1/name/"
covid_api = "https://disease.sh/v3/covid-19/countries/"
vaccine_api = "https://disease.sh/v3/covid-19/vaccine/coverage/countries/"
morte_api="https://disease.sh/v3/covid-19/historical/all"
noticia_api="https://newsapi.org/v2/everything?q=COVID-19&apiKey=8d5c096f74b440db886fc179e3de06af"


@app.route("/")
def index():
   api_noticia = requests.get(noticia_api)
  
   if api_noticia.status_code == 200:
    noticia_data = api_noticia.json()
     
    articles = noticia_data['articles'][:7]
     
    return render_template('index.html',articles=articles)
  

@app.route("/dados_saude", methods=["POST"])
def get_health_data():
    pais = request.form.get("country_name")

    if not pais:
        return jsonify({"error": "Nome do país não fornecido"})

    rest_link = f"{rest_api}{pais}"
    api_rest = requests.get(rest_link)

    covid_link = f"{covid_api}{pais}"
    api_covid = requests.get(covid_link)

    vaccine_link = f"{vaccine_api}{pais}?lastdays=1&fullData=false"
    api_vaccine = requests.get(vaccine_link)

    morte_link = f"{morte_api}{pais}"
    api_morte = requests.get(morte_link)
  
    if api_rest.status_code == 200:
        population_rest = api_rest.json()
        population = population_rest[0]["population"]
        return jsonify({"populacao": population})
        
    if api_covid.status_code == 200:
        casos_covid = api_covid.json()
        casos = casos_covid["cases"]
        return jsonify({"casos": casos})

    if api_vaccine.status_code == 200:
        vaccine_data = api_vaccine.json()
        pessoas_vacinadas = vaccine_data["timeline"][str(list(vaccine_data["timeline"].keys())[0])]
        return jsonify({"pessoas_vacinadas": pessoas_vacinadas})
      
    if api_morte.status_code == 200:
      casos_morte = api_morte.json()
      deaths = casos_morte["deaths"]
      return jsonify({"mortes": deaths})
      
    else:
        return jsonify({"error": "Erro ao obter dados"})

if __name__ == "__main__":
    app.run(host='0.0.0.0')
