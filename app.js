let map;
let places = [];
let markers = [];

ymaps.ready(init);

function init() {

    map = new ymaps.Map("map", {
        center: [45.3, 34.2],
        zoom: 8,
        controls: ["zoomControl"]
    });

    fetch("data/places.json")
        .then(response => response.json())
        .then(data => {

            places = data;

            loadMarkers();

            if (places.length > 0) {
                document.getElementById("updateInfo").innerHTML =
                    "Последнее обновление: " + (places[0].updated || "нет данных");
            }

        })
        .catch(err => {
            console.error(err);
            alert("Не удалось загрузить places.json");
        });

    const searchInput = document.getElementById("search");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const text = this.value.toLowerCase().trim();

            const results = document.getElementById("searchResults");
            results.innerHTML = "";

            if (text.length < 2) return;

            places
                .filter(place =>
                    (place.name || "").toLowerCase().includes(text) ||
                    (place.region || "").toLowerCase().includes(text)
                )
                .forEach(place => {

                    const item = document.createElement("div");
                    item.className = "searchItem";

                    item.innerHTML = `
                        <b>${place.name}</b><br>
                        ${place.region}
                    `;

                    item.onclick = () => {

                        map.setCenter([place.lat, place.lng], 12);

                        updateInfo(place);

                        results.innerHTML = "";

                        searchInput.value = place.name;

                    };

                    results.appendChild(item);

                });

        });

    }

}

function loadMarkers() {

    markers = [];

    map.geoObjects.removeAll();

    places.forEach(place => {

        const marker = new ymaps.Placemark(
            [place.lat, place.lng],
            {
                balloonContent: `
                    <b>${place.name}</b><br>
                    ${place.region}<br>
                    ${place.status}
                `
            },
            {
                preset: getColor(place.statusCode)
            }
        );

        marker.events.add("click", () => {
            updateInfo(place);
        });

        map.geoObjects.add(marker);

        markers.push({
            marker: marker,
            status: place.statusCode
        });

    });

}

function updateInfo(place) {

    document.getElementById("placeName").textContent = place.name;

    document.getElementById("placeStatus").innerHTML =
        "Статус: <b class='" + place.statusCode + "'>" +
        place.status +
        "</b>";

    document.getElementById("placeRegion").textContent =
        "Район: " + place.region;

    document.getElementById("placeUpdated").textContent =
        "Обновлено: " + place.updated;

    document.getElementById("placeNote").textContent =
        "ℹ " + place.note;

}

function getColor(status) {

    switch (status) {

        case "red":
            return "islands#redDotIcon";

        case "yellow":
            return "islands#yellowDotIcon";

        default:
            return "islands#greenDotIcon";

    }

}

function filterPlaces(type) {

    markers.forEach(item => {

        item.marker.options.set(
            "visible",
            type === "all" || item.status === type
        );

    });

}

setInterval(() => {

    fetch("data/places.json?" + Date.now())

        .then(response => response.json())

        .then(data => {

            places = data;

            loadMarkers();

        })

        .catch(console.error);

}, 30000);
