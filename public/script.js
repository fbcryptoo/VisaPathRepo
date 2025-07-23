// Load Papa Parse and parse the CSV file
Papa.parse("combined_passport_data_with_guidance.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        populateDropdowns(data);
        setupVisaChecker(data);
    },
    error: function(error) {
        console.error("Error loading CSV:", error);
        document.getElementById("result").innerHTML = "Error loading visa data. Please try again later.";
    }
});

// Populate nationality and destination dropdowns
function populateDropdowns(data) {
    const nationalitySelect = document.getElementById("nationality");
    const destinationSelect = document.getElementById("destination");
    
    // Extract unique nationalities and destinations
    const nationalities = [...new Set(data.map(item => item.Nationality))].sort();
    const destinations = [...new Set(data.map(item => item.Destination))].sort();
    
    // Populate nationality dropdown
    nationalities.forEach(nationality => {
        const option = document.createElement("option");
        option.value = nationality;
        option.textContent = nationality;
        nationalitySelect.appendChild(option);
    });
    
    // Populate destination dropdown
    destinations.forEach(destination => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationSelect.appendChild(option);
    });
}

// Set up the visa checker functionality
function setupVisaChecker(data) {
    const checkButton = document.getElementById("check-visa");
    const resultDiv = document.getElementById("result");
    
    checkButton.addEventListener("click", () => {
        const nationality = document.getElementById("nationality").value;
        const destination = document.getElementById("destination").value;
        
        if (!nationality || !destination) {
            resultDiv.innerHTML = "Please select both nationality and destination.";
            resultDiv.classList.add("show");
            return;
        }
        
        // Find matching visa data
        const visaInfo = data.find(item => 
            item.Nationality === nationality && item.Destination === destination
        );
        
        if (visaInfo) {
            let message = "";
            if (visaInfo.VisaRequirement === "Visa-free") {
                message = `You can enter ${destination} visa-free for up to ${visaInfo.AllowedStay || "N/A"}.`;
            } else if (visaInfo.VisaRequirement === "eTA") {
                message = `You need to apply for an eTA to enter ${destination}.`;
            } else if (visaInfo.VisaRequirement === "ESTA") {
                message = `You need to apply for an ESTA to enter ${destination}.`;
            } else if (visaInfo.VisaRequirement === "eVisa") {
                message = `You need to apply for an e-Visa to enter ${destination}.`;
            } else {
                message = `You need to apply for a consular visa to enter ${destination}.`;
            }
            
            // Add special notes if available
            if (visaInfo.SpecialNotes) {
                message += ` <strong>Special Notes:</strong> ${visaInfo.SpecialNotes}`;
            }
            
            // Add link to official application if available
            if (visaInfo.ApplicationLink) {
                message += ` <a href="${visaInfo.ApplicationLink}" target="_blank">Apply here</a>`;
            } else {
                message += ` <a href="https://www.google.com/search?q=${encodeURIComponent(`visa application ${destination}`)}" target="_blank">Get more information</a>`;
            }
            
            resultDiv.innerHTML = message;
            resultDiv.classList.add("show");
        } else {
            resultDiv.innerHTML = "No visa information available for this combination.";
            resultDiv.classList.add("show");
        }
    });
}
