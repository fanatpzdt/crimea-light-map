// Создание карты
const map = L.map('map').setView(
    [45.3, 34.2],
    8
);


// Карта OpenStreetMap
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }
).addTo(map);



let places = [];


// Загружаем данные
fetch("data/places.json")
    .then(response => response.json())
    .then(data => {

        places = data;

        data.forEach(place => {

            let marker = L.marker([
                place.lat,
                place.lng
            ])
            .addTo(map);


            marker.bindPopup(`
                <b>${place.name}</b><br>
                Район: ${place.region}<br>
                Статус:
                <span class="${place.statusClass}">
                ${place.status}
                </span>
            `);


            marker.on("click", function(){

                document.getElementById("info").innerHTML = `
                <h2>${place.name}</h2>

                <p>
                Район: ${place.region}
                </p>

                <p>
                Свет:
                <span class="${place.statusClass}">
                ${place.status}
                </span>
                </p>
                `;
            });

        });

    });




// Поиск
document
.getElementById("search")
.addEventListener(
"input",
function(){

    let text = this.value.toLowerCase();


    let found = places.find(place =>
        place.name.toLowerCase()
        .includes(text)
    );


    if(found){

        map.setView(
            [
                found.lat,
                found.lng
            ],
            12
        );

    }

});
