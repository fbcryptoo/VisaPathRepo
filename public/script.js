Papa.parse("combined_passport_data_with_guidance.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        populateDropdowns(data);
        setupVisaChecker(data);
    }
});

function populateDropdowns(data) {
    const nationalitySelect = document.getElementById("nationality");
    const destinationSelect = document.getElementById("destination");
    const nationalities = [...new Set(data.map(item => item.Nationality))].sort();
    const destinations = [...new Set(data.map(item => item.Destination))].sort();

    nationalities.forEach(nationality => {
        const option = document.createElement("option");
        option.value = nationality;
        option.textContent = nationality;
        nationalitySelect.appendChild(option);
    });

    destinations.forEach(destination => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationSelect.appendChild(option);
    });
}

function setupVisaChecker(data) {
    const checkButton = document.getElementById("check-visa");
    const resultDiv = document.getElementById("result");

    checkButton.addEventListener("click", () => {
        const nationality = document.getElementById("nationality").value;
        const destination = document.getDest;
        if (!nationality || !destination) {
            resultDiv.innerHTML = "Yo, pick your nationality and destination first!";
            resultDiv.classList.add("show");
            return;
        }

        resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hang tight, checking...';
        resultDiv.classList.add("show");

        setTimeout(() => {
            const visaInfo = data.find(item => 
                item.Nationality === nationality && item.Destination === destination
            );

            if (visaInfo) {
                let message = visaInfo.VisaRequirement === "Visa-free" 
                    ? `You’re good to go to ${destination} visa-free for ${visaInfo.AllowedStay || "N/A"}!` 
                    : `You’ll need a ${visaInfo.VisaRequirement} for ${destination}.`;
                if (visaInfo.SpecialNotes) message += ` <strong>Heads up:</strong> ${visaInfo.SpecialNotes}`;
                message += ` <a href="${visaInfo.ApplicationLink || `https://www.google.com/search?q=visa+${destination}`}" target="_blank">Get it here</a>`;
                resultDiv.innerHTML = message;
            } else {
                resultDiv.innerHTML = "No info for this trip, fam. Try again.";
            }
        }, 1000);
    });
}
