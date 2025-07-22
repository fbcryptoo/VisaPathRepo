let visaData = [];

async function loadVisaData() {
  try {
    const response = await fetch("combined_passport_data_with_guidance.csv");
    const text = await response.text();
    const rows = text.split("\n").slice(1); // skip header
    visaData = rows.map(row => {
      const [passport, destination, requirement, guidance] = row.split(",");
      return {
        passport: passport.trim(),
        destination: destination.trim(),
        requirement: requirement.trim(),
        guidance: guidance?.trim() || ""
      };
    });
    populateDropdowns();
  } catch (error) {
    console.error("Error loading visa data:", error);
  }
}

function populateDropdowns() {
  const nationalities = [...new Set(visaData.map(entry => entry.passport))].sort();
  const destinations = [...new Set(visaData.map(entry => entry.destination))].sort();

  const nationalitySelect = document.getElementById("nationality");
  const destinationSelect = document.getElementById("destination");

  nationalitySelect.innerHTML = nationalities.map(n => `<option value="${n}">${n}</option>`).join("");
  destinationSelect.innerHTML = destinations.map(d => `<option value="${d}">${d}</option>`).join("");
}

function checkVisa() {
  const from = document.getElementById("nationality").value;
  const to = document.getElementById("destination").value;
  const div = document.getElementById("result");

  if (!from || !to) {
    div.innerHTML = "<p>Please select both nationality and destination.</p>";
    return;
  }

  const result = visaData.find(entry => entry.passport === from && entry.destination === to);

  if (result) {
    const type = result.requirement.toLowerCase();
    const linkMatch = result.guidance.match(/https?:\/\/[^\s,]+/);
    const link = linkMatch ? linkMatch[0] : null;

    let readableType;
    if (type.includes("visa-free")) {
      readableType = "no visa";
    } else if (type.includes("eta")) {
      readableType = "an eTA";
    } else if (type.includes("esta")) {
      readableType = "an ESTA";
    } else if (type.includes("e-visa")) {
      readableType = "an eVisa";
    } else if (type.includes("required")) {
      readableType = "a visa";
    } else {
      readableType = `a ${type}`;
    }

    let message = `<h3>${from} → ${to}</h3>`;

    if (readableType === "no visa") {
      message += `<p>No visa is required for travel from <strong>${from}</strong> to <strong>${to}</strong>.</p>`;
    } else {
      message += `<p>You need to apply for <strong>${readableType}</strong> to travel from <strong>${from}</strong> to <strong>${to}</strong>.</p>`;
      if (link) {
        message += `<p>Apply here: <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>`;
      }
    }

    div.innerHTML = message;
  } else {
    div.innerHTML = `<h3>${from} → ${to}</h3><p>⏳ We're working on visa info for this route.</p>`;
  }
}

window.onload = loadVisaData;
