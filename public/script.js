document.addEventListener("DOMContentLoaded", () => {
    const nationalitySelect = document.getElementById("nationality");
    const destinationSelect = document.getElementById("destination");
    const resultDiv = document.getElementById("result");
    const checkBtn = document.getElementById("checkBtn");

    let visaData = [];

    fetch("combined_passport_data_with_guidance.csv")
        .then(response => response.text())
        .then(text => {
            visaData = text.split("\n").slice(1).map(line => {
                const [origin, destination, type, notes, link] = line.split(",");
                return { origin, destination, type, notes, link };
            });

            const countries = [...new Set(visaData.map(row => row.origin))].sort();
            countries.forEach(c => {
                const option1 = new Option(c, c);
                const option2 = new Option(c, c);
                nationalitySelect.add(option1.cloneNode(true));
                destinationSelect.add(option2.cloneNode(true));
            });

            nationalitySelect.selectedIndex = 0;
            destinationSelect.selectedIndex = 0;
        });

    checkBtn.addEventListener("click", () => {
        const from = nationalitySelect.value;
        const to = destinationSelect.value;

        const match = visaData.find(row => row.origin === from && row.destination === to);

        if (!match) {
            resultDiv.innerHTML = "<strong>No data found for this route.</strong>";
            return;
        }

        let message = `<strong>${from} → ${to}</strong><br/>`;
        if (match.type.toLowerCase().includes("visa required")) {
            message += `You need a visa to travel to ${to}.<br/>`;
        } else if (match.type.toLowerCase().includes("e-visa")) {
            message += `You can apply for an e-Visa to visit ${to}.<br/>`;
        } else if (match.type.toLowerCase().includes("eta")) {
            message += `You need to apply for an ETA to visit ${to}.<br/>`;
        } else if (match.type.toLowerCase().includes("esta")) {
            message += `You need to apply for an ESTA to visit ${to}.<br/>`;
        } else if (match.type.toLowerCase().includes("visa-free")) {
            message += `You do not need a visa to travel to ${to}.<br/>`;
        } else {
            message += `${match.type}<br/>`;
        }

        if (match.notes && match.notes !== "null") {
            message += match.notes + "<br/>";
        }

        if (match.link && match.link.startsWith("http")) {
            message += `<a href='${match.link}' target='_blank'>Apply here</a>`;
        }

        resultDiv.innerHTML = message;
    });
});
