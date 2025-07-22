let visaData = [];

async function loadVisaData() {
  try {
    const response = await fetch("combined_passport_data_with_guidance.csv");
    const text = await response.text();
    const rows = text.split("\n").slice(1); // Skip header row
    visaData = rows.map(row => {
      const [passport, destination, requirement, guidance] = row.split(",");
      return {
        passport: passport?.trim(),
        destination: destination?.trim(),
        requirement: requirement?.trim().toLowerCase(),
        guidance: guidance?.trim()
      };
    });
    populateDropdowns();
  } catch (error) {
    console.error("Error loading visa data:", error);
  }
}

function populateDropdowns() {
  const nationalitySelect = document.getElementById("nationality");
  const destinationSelect = document.getElementById("destination");

  const nationalities = [...new Set(visaData.map(e => e.passport))].sort();
  const destinations = [...new Set(visaData.map(e => e.destination))].sort();

  nationalitySelect.innerHTML = nationalities.map(n => `<option value="${n}">${n}</option>`).join("");
  destinationSelect.innerHTML = destinations.map(d => `<option value="${d}">${d}</option>`).join("");
}

function checkVisa() {
  const from = document.getElementById("nationality").value;
  const to = document.getElementById("destination").value;
  const resultDiv = document.getElementById("result");

  if (!from || !to) {
    resultDiv.innerHTML = "<p>Please select both a nationality and a destination.</p>";
    return;
  }

  const entry = visaData.find(e => e.passport === from && e.destination === to);

  if (!entry) {
    resultDiv.innerHTML = `<h3>${from} → ${to}</h3><p>Sorry, we don't have visa info for this route yet.</p>`;
    return;
  }

  const { requirement, guidance } = entry;

  // Determine visa type description
  let readableType = "a visa";
  if (requirement.includes("visa-free")) readableType = "no visa";
  else if (requirement.includes("esta")) readableType = "an ESTA";
  else if (requirement.includes("eta")) readableType = "an eTA";
  else if (requirement.includes("e-visa")) readableType = "an eVisa";

  // Extract link from guidance (first URL only)
  const linkMatch = guidance.match(/https?:\/\/[^\s,]+/);
  const link = linkMatch ? linkMatch[0] : null;

  let message = `<h3>${from} → ${to}</h3>`;

  if (readableType === "no visa") {
    message += `<p><strong>No visa is required</strong> for travel from ${from} to ${to}.</p>`;
  } else {
    message += `<p>You need to apply for <strong>${readableType}</strong> to travel from ${from} to ${to}.</p>`;
    if (link) {
      message += `<p><a href="${link}" target="_blank" rel="noopener noreferrer">Apply here</a></p>`;
    }
  }

  resultDiv.innerHTML = message;
}

window.onload = loadVisaData;
