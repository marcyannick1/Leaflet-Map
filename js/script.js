$(document).ready(function(){
    $("form").submit(function(e){
        e.preventDefault();
        var settings_input1 = {
            url: "https://api-adresse.data.gouv.fr/search/?q=" + $('.input-search').val() + "&type=housenumber&autocomplete=1",
            type: "GET",
            timeout: 0,
        };
        var settings_input2 = {
            url: "https://api-adresse.data.gouv.fr/search/?q=" + $('.input-search2').val() + "&type=housenumber&autocomplete=1",
            type: "GET",
            timeout: 0,
        };

        const dataJson = (data) => {
            const postData = {
                numero : `${data.properties.housenumber}`,
                rue : `${data.properties.street}`,
                ville : `${data.properties.city}`,
                codePostal : `${data.properties.postcode}`,
                latitude : `${data.geometry.coordinates[1]}`,
                longitude : `${data.geometry.coordinates[0]}`
            }
            return JSON.stringify(postData)
        }

        const LeafletMap = (data) => {
            if($(".leaflet-conatiner")){
                $(".leaflet-container").remove()  

                $("form").after('<div id="map" class="leaflet-container"></div>');
            }

            const setViewArray = data[0].geometry.coordinates

            var map = L.map("map").setView([setViewArray[1], setViewArray[0]], 5);

            data.forEach((element) =>{
                const marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]]).addTo(map)
                marker.bindPopup(element.properties.label)
            })
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
        };

        $.ajax(settings_input1).done(function (response) {
            var dataArray = []

            dataArray.push(response.features[0])
            $.ajax({
                type: 'POST',
                url: 'post.php',
                data: {locationData1: dataJson(response.features[0])} 
             });

            $.ajax(settings_input2).done(function (response) {
                dataArray.push(response.features[0])
                $.ajax({
                    type: 'POST',
                    url: 'post.php',
                    data: {locationData2: dataJson(response.features[0])}
                 });

                LeafletMap(dataArray)
            });
        });
    })
})