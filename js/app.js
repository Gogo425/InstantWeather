const TypeCarte = {
    TMin: "T° Min",
    TMax: "T° Max",
    Ensoleillement: "Ensoleillement",
    ProbaPluie: "Proba pluie"
}
const selectionVilles = document.getElementById("selection")
var zoneCodePostal = document.getElementById("zoneCodePostal");
var str = ""
var verifCaractere
let villeChoisie

const token = "7098b091691f53b4ba9f102d5c8a5018c423a36c5eb9e5d061bcfc050d3b0e8b"
let codeInsee
let resultatmeteoLatitude = document.getElementById("resultatmeteoLatitude")
let resultatmeteoLontitude = document.getElementById("resultatmeteoLontitude")
let tempMax = document.getElementById("tempMax")
let tempMin = document.getElementById("tempMin")
let probaPluie = document.getElementById("probaPluie")
let nbHensoleillement = document.getElementById("nbHensoleillement")
let afficheCartes = document.getElementById("listeCarte")
let titreVille = document.getElementById("titreVille")


let choixJour = document.getElementById("choixJour")
let afficheJour = document.getElementById("afficheJour")
let changeLatitude = document.getElementById("changeLatitude")
let changeLongitude = document.getElementById("changeLongitude")
let changeCumulPluie = document.getElementById("changeCumulPluie")
let changeVentMoyen = document.getElementById("changeVentMoyen")
let changeDirectionVent = document.getElementById("changeDirectionVent")
let bouttonValide = document.getElementById("bouttonValide")
bouttonValide.addEventListener("click", changeOption);
let bouttonAnnule = document.getElementById("bouttonAnnule")
bouttonAnnule.addEventListener("click", afficheParamere);
let bouttonParamétre = document.getElementById("bouttonParamétre")
bouttonParamétre.addEventListener("click", chargeParametre);
let copieChoixJour = afficheJour.textContent

function actualisetextJour(){
    afficheJour.innerText = copieChoixJour
    afficheJour.innerText = afficheJour.textContent + choixJour.value
}

function changeOption(){
    window.localStorage.setItem("ValeurLatitude",changeLatitude.checked ) 
    window.localStorage.setItem("ValeurLongitude",changeLongitude.checked )
    window.localStorage.setItem("ValeurCumulPluie",changeCumulPluie.checked )
    window.localStorage.setItem("ValeuVentMoyen",changeVentMoyen.checked )
    window.localStorage.setItem("ValeurDirectionVent",changeDirectionVent.checked )
    window.localStorage.setItem("ValeurJour",choixJour.value )
    chargeVariableLocal()
}

function chargeParametre(){
    if (window.localStorage.getItem("ValeurLatitude") == null){
        window.localStorage.setItem("ValeurLatitude",false )
        latitude = false
    }
    if (window.localStorage.getItem("ValeurLongitude") == null){
        window.localStorage.setItem("ValeurLongitude",false )
        longitude = false
    }
    if (window.localStorage.getItem("ValeurCumulPluie") == null){
        window.localStorage.setItem("ValeurCumulPluie",false )
        cumulPlui = false
    }
    if (window.localStorage.getItem("ValeuVentMoyen") == null){
        window.localStorage.setItem("ValeuVentMoyen",false )
        moyVent = false
    }
    if (window.localStorage.getItem("ValeurDirectionVent") == null){
        window.localStorage.setItem("ValeurDirectionVent",false )
        directionVent = false
    }
    if (window.localStorage.getItem("ValeurJour") == null){
        window.localStorage.setItem("ValeurJour",1)
        nbjour = 1;
    }
    changeLatitude.checked = validee(window.localStorage.getItem("ValeurLatitude"))
    changeLongitude.checked = validee(window.localStorage.getItem("ValeurLongitude"))
    changeCumulPluie.checked = validee(window.localStorage.getItem("ValeurCumulPluie"))
    changeVentMoyen.checked = validee(window.localStorage.getItem("ValeuVentMoyen"))
    changeDirectionVent.checked = validee(window.localStorage.getItem("ValeurDirectionVent"))
    choixJour.value = window.localStorage.getItem("ValeurJour")
    chargeVariableLocal()
}

function chargeVariableLocal(){
    latitude = validee(window.localStorage.getItem("ValeurLatitude"))
    longitude = validee(window.localStorage.getItem("ValeurLongitude"))
    cumulPlui = validee(window.localStorage.getItem("ValeurCumulPluie"))
    moyVent = validee(window.localStorage.getItem("ValeuVentMoyen"))
    directionVent = validee(window.localStorage.getItem("ValeurDirectionVent"))
    nbjour =  window.localStorage.getItem("ValeurJour")
}

function afficheParamere(){
    alert("a faire")
}

function validee(valeur){
    if (valeur == "true"){
        return true
    }
    return false
}


function creationCarte(TypeCarte, valeur){
    const template = document.getElementById("templateCarte")
    let clone = document.importNode(template.content, true)

    let span = clone.querySelector('span')


    let h2 = clone.querySelectorAll("h2")
    let h3 = clone.querySelectorAll("h3")
    

    switch (TypeCarte) {
        case "Ensoleillement":
            span.classList.add("fa-regular", "fa-sun")
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " h" 
            break;
        
            
        case "T° Min":
            span.classList.add("fa-solid", "fa-temperature-low")
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " °C"
            break;
        
        case "T° Max":
            span.classList.add("fa-solid", "fa-temperature-high")
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " °C"
            break;
    
        case "Proba pluie":
            span.classList.add("fa-solid", "fa-cloud-rain")
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " %"
            break;
    }

    let divCarte = document.querySelector("#listeCarte")
    divCarte.appendChild(clone)

}


zoneCodePostal.addEventListener("input", recherche);

function recherche(valeur){
    verifCaractere = valeur.target.value
    if (verifChiffre(verifCaractere.charCodeAt(verifCaractere.length -1)) == false){
        var suprime =  zoneCodePostal.value.replace(/[^0-9\.]/g,'');
        zoneCodePostal.value =  suprime.replace(/\./g,'');
    }
    else {
        str = verifCaractere
        if (str.length == 5){
            afficheVille()
        }
    }

}

function verifChiffre(chiffre){
    if (chiffre >= 48 && chiffre <= 57){
        return true
    }
    return false
}

function afficheVille(){
    fetch('https://geo.api.gouv.fr/communes?codePostal='+ parseInt(str))
    .then(reponse => {
    if(!reponse.ok){
        throw new Error("Network response was not ok");
    }
        return reponse.json();
    })
    .then(data => {
        console.log(data)
        selectionVilles.innerHTML = ""
        if(data.length <= 0){   
            alert("Attention le code postale n'existe pas")
        }

        data.forEach((commune) => {
            if(commune.nom.includes("'")){
                selectionVilles.innerHTML += "<button class='villeChoisie' value= " + commune.nom + " >" + commune.nom + "</button>";
            } else {
                selectionVilles.innerHTML += "<button class='villeChoisie' value= '" + commune.nom + "' >" + commune.nom + "</button>";
            }
        })

        villeChoisie = document.querySelectorAll(".villeChoisie");

        villeChoisie.forEach((bouton) => {
            console.log(bouton)
            bouton.addEventListener('click', () => {
                const valeur = bouton.value; // Décoder la valeur pour obtenir le vrai nom
                selectionVilles.innerHTML = "";
                afficheCartes.innerHTML = "";
                titreVille.innerText = "";
                getInsee(valeur); // Appeler la fonction avec le nom décodé
            });
        });

    });
}

function getInsee(nomVille){
    console.log(nomVille)
    fetch("https://api.meteo-concept.com/api/location/cities?token=" + token + "&search=" + nomVille)
    .then(reponse => {
    if(!reponse.ok){
        throw new Error("Network response was not ok");
    }
        return reponse.json();
    })
    .then(data => {
        titreVille.innerText = nomVille
        afficheMeteo()
    })
    .catch(error => {
        titreVille.innerText = ""
        alert("Attention insee bug")
    });
}

function afficheMeteo(){
    fetch("https://api.meteo-concept.com/api/forecast/daily?token=" + token + "&insee=" + parseInt(codeInsee))
    .then(reponse => {
    if(!reponse.ok){
        throw new Error("Network response was not ok");
    }
        return reponse.json();
    })
    .then(data => {
        creationCarte(TypeCarte.Ensoleillement,data.forecast[0].sun_hours)
        creationCarte(TypeCarte.TMax,data.forecast[0].tmax)
        creationCarte(TypeCarte.TMin,data.forecast[0].tmin)
        creationCarte(TypeCarte.ProbaPluie,data.forecast[0].probarain)
        // resultatmeteoLatitude.innerText = resultatmeteoLatitude.textContent + ' ' + data.forecast[0].latitude;
        // resultatmeteoLontitude.innerText = resultatmeteoLontitude.textContent + ' ' + data.forecast[0].longitude;
        // tempMax.innerText = tempMax.textContent + ' ' + data.forecast[0].tmax;
        // tempMin.innerText = tempMin.textContent + ' ' + data.forecast[0].tmin;
        // probaPluie.innerText = probaPluie.textContent + ' ' + data.forecast[0].probarain +"%";
        // nbHensoleillement.innerText = nbHensoleillement.textContent + ' ' + data.forecast[0].sun_hours + "h";

    })
    .catch(error => {
        alert("Attention meteo bug")
    });
}

function enleverEspace(str){
    return str.replace(/\s/g, "")
}
