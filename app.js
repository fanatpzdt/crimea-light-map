let map;
let places = [];


ymaps.ready(init);


function init() {

    map = new ymaps.Map("map", {

        center: [
            45.3,
            34.2
        ],

        zoom: 8,

        controls: [
            'zoomControl'
        ]

    });


    fetch("data/places.json")

    .then(response => response.json())

    .then(data => {

        places = data;


        data.forEach(place => {


            let marker = new ymaps.Placemark(

                [
                    place.lat,
                    place.lng
                ],

                {

                    balloonContent:

                    `
                    <b>${place.name}</b>
                    <br>
                    Район: ${place.region}
                    <br>
                    Статус:
                    ${place.status}
                    `

                },

                {

                    preset:
                    getColor(place.status)

                }

            );


            map.geoObjects.add(marker);


        });


    });


}



function getColor(status) {


    if(status.includes("Нет"))

        return "islands#redDotIcon";


    if(status.includes("Огранич"))

        return "islands#yellowDotIcon";


    return "islands#greenDotIcon";


}




document
.getElementById("search")
.addEventListener(

"input",

function(){


let text =
this.value.toLowerCase();



let found =
places.find(place =>

place.name
.toLowerCase()
.includes(text)

);



if(found){


map.setCenter(

[
found.lat,
found.lng
],

12

);


}


}

);
