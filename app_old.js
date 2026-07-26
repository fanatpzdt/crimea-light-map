alert("app.js загрузился");

let map;
let places = [];
let markers = [];


ymaps.ready(init);



function init() {


    map = new ymaps.Map("map", {

        center: [
            45.3,
            34.2
        ],

        zoom: 8,

        controls: [
            "zoomControl"
        ]

    });



    fetch("data/places.json")

    .then(response => response.json())

    .then(data => {


        places = data;

if (places.length > 0) {

    let lastUpdate = places[0].updated || "нет данных";

    document.getElementById("updateInfo").innerHTML =
    "Последнее обновление: " + lastUpdate;

}

        fetch("data/status.json")

.then(response => response.json())

.then(status => {


document.getElementById("updateInfo").innerHTML =

"Последнее обновление: "
+
status.lastUpdate
+
"<br>"
+
status.message;


});
        
        data.forEach(place => {


            let marker =
            new ymaps.Placemark(

                [
                    place.lat,
                    place.lng
                ],

                {


                    balloonContent:

                    `

                    <div class="card">

                    <h3>
                    ${place.name}
                    </h3>


                    <p>
                    Район:
                    ${place.region}
                    </p>


                    <p>
                    Статус:
                    <b class="${place.statusCode}">
                    ${place.status}
                    </b>
                    </p>


                    <p>
                    Обновлено:
                    ${place.updated}
                    </p>


                    <p>
                    ℹ ${place.note}
                    </p>


                    </div>

                    `

                },


                {

                    preset:
                    getColor(place.statusCode)

                }


            );


            map.geoObjects.add(marker);
marker.events.add('click', function () {

    document.getElementById("placeName").innerHTML =
    place.name;


    document.getElementById("placeStatus").innerHTML =
    "Статус: <b class='" 
    + place.statusCode +
    "'>"
    + place.status +
    "</b>";


    document.getElementById("placeRegion").innerHTML =
    "Район: " + place.region;


    document.getElementById("placeUpdated").innerHTML =
    "Обновлено: " + place.updated;


    document.getElementById("placeNote").innerHTML =
    "ℹ " + place.note;

});
            
            markers.push({
    marker: marker,
    status: place.statusCode


        });


    });


}




function getColor(status){


    if(status === "red")
        return "islands#redDotIcon";


    if(status === "yellow")
        return "islands#yellowDotIcon";


    return "islands#greenDotIcon";


}




const searchInput =
document.getElementById("search");


const searchResults =
document.getElementById("searchResults");



if (searchInput) {

searchInput.addEventListener(
"input",
function(){

let text =
this.value.toLowerCase().trim();


searchResults.innerHTML = "";


if(text.length < 2){

    return;

}



let results =
places.filter(place =>

(place.name || "").toLowerCase().includes(text)
||
(place.region || "").toLowerCase().includes(text)
||
(place.type || "").toLowerCase().includes(text)

);



results.forEach(place => {


let item =
document.createElement("div");


item.className =
"searchItem";



item.innerHTML = `

<b>${place.name}</b>

<br>

${place.region}

<br>

<span class="${place.statusCode}">
${place.status}
</span>

`;



item.onclick = function(){


map.setCenter(

[
place.lat,
place.lng
],

12

);



document.getElementById("placeName").innerHTML =
place.name;



document.getElementById("placeStatus").innerHTML =
"Статус: <b class='" 
+ place.statusCode +
"'>" 
+ place.status +
"</b>";



document.getElementById("placeRegion").innerHTML =
"Район: " + place.region;



document.getElementById("placeUpdated").innerHTML =
"Обновлено: " + place.updated;



document.getElementById("placeNote").innerHTML =
"ℹ " + place.note;



searchResults.innerHTML = "";

searchInput.value = place.name;


};



searchResults.appendChild(item);



});


});
    
}
    
function filterPlaces(type){


markers.forEach(item => {


    if(type === "all"){

        item.marker.options.set(
            "visible",
            true
        );

    }

    else {

        item.marker.options.set(
            "visible",
            item.status === type
        );

    }


});


}
