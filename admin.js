let places = [];


fetch("data/places.json")

.then(response => response.json())

.then(data => {


places = data;


let select =
document.getElementById("placeSelect");


places.forEach((place,index)=>{


let option =
document.createElement("option");


option.value=index;

option.textContent =
place.name;


select.appendChild(option);


});


});




function saveStatus(){


let index =
document.getElementById("placeSelect").value;


let status =
document.getElementById("statusSelect").value;


let note =
document.getElementById("noteInput").value;



document.getElementById("result").innerHTML =

"Изменено: "
+
places[index].name
+
"<br>Статус: "
+
status
+
"<br>Комментарий: "
+
note
+
"<br><br>Сохранение подключим следующим этапом";


}
