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
            "zoomControl"
        ]

    });



    fetch("data/places.json")

    .then(response => response.json())

    .then(data => {


        places = data;


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
