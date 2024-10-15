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

function creationCarte(TypeCarte, valeur){
    const template = document.getElementById("templateCarte")
    let clone = document.importNode(template.content, true)

    let span = clone.querySelector('span')


    let h2 = clone.querySelectorAll("h2")
    let h3 = clone.querySelectorAll("h3")
    

    switch (TypeCarte) {
        case "Ensoleillement":
            // span.classList.add("fa-regular", "fa-sun")
            span.innerHTML = "<img class = " + "tailleImages" +  " src=" + "../Logos/soleil.PNG" + ">";
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " h" 
            break;
        
            
        case "T° Min":
            // span.classList.add("fa-solid", "fa-temperature-low")
            span.innerHTML = "<img class = " + "tailleImages" +  " src=" + "../Logos/froid.PNG" + ">";
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " °C"
            break;
        
        case "T° Max":
            // span.classList.add("fa-solid", "fa-temperature-high")
            span.innerHTML = "<img class = " + "tailleImages" +  " src=" + "../Logos/chaud.PNG" + ">";
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " °C"
            break;
    
        case "Proba pluie":
            // span.classList.add("fa-solid", "fa-cloud-rain")
            span.innerHTML = "<img class = " + "tailleImages" +  " src=" + "../Logos/pluie.PNG" + ">";
            h2[0].textContent = TypeCarte
            h3[0].textContent = valeur + " %"
            break;
    }

    let divCarte = document.querySelector("#listeCarte")
    divCarte.appendChild(clone)

}

console.log(str);
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
    console.log(str.length)
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
            bouton.addEventListener('click', () => {
                const valeur = bouton.value; // Décoder la valeur pour obtenir le vrai nom
                console.log(valeur);
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
        codeInsee = data.cities[0].insee
        console.log(codeInsee)
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
        console.log(data);
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
