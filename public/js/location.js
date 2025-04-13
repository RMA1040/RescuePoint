document.getElementById("locationButton").addEventListener("click", function(event) {
    event.preventDefault(); // Voorkom dat het formulier direct wordt verzonden
    
    // Functie om locatie op te halen
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Sla de locatie op in verborgen velden
                document.getElementById("latitude").value = latitude;
                document.getElementById("longitude").value = longitude;

                // Verzenden van het formulier
                document.getElementById("locationForm").submit(); // Dit verstuurt het formulier
            }, function(error) {
                alert("Error while fetching location: " + error.message);
            });
        } else {
            alert("Geolocation is not supported on this browser.");
        }
    }

    getLocation(); // Roep de functie aan om de locatie op te halen
});
