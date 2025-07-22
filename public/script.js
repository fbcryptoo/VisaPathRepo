async function fetchVisaData() {
  const response = await fetch("https://raw.githubusercontent.com/fbcryptoo/VisaPathRepo/main/public/combined_passport_data_with_guidance.csv");
  const csvText = await response.text();
  const rows = csvText.trim().split('\n').slice(1); // skip header

  const data = rows.map(row => {
    const columns = row.split(',');
    const passport = columns[0]?.trim();
    const destination = columns[1]?.trim();
    const requirement = columns[2]?.trim();
    const guidance = columns.slice(3).join(',').trim(); // capture guidance with potential commas

    return {
      passport,
      destination,
      requirement,
      guidance
    };
  });

  return data;
}

async function populateDropdowns() {
  const data = await fetchVisaData();
  const passports = [...new Set(data.map(entry => entry.passport))].sort();
  const destinations = [...new Set(data.map(entry => entry.destination))].sort();

  const passportSelect = document.getElementById("passport");
  const destinationSelect = document.getElementById("destination");

  passports.forEach(passport => {
    const option = document.createElement("option");
    option.value = passport;
    option.text = passport;
    passportSelect.appendChild(option);
  });

  destinations.forEach(destination => {
    const option = document.createElement("option");
    option.value = destination;
    option.text = destination;
    destinationSelect.appendChild(option);
  });
}

async function checkVisaRequirement() {
  const passport = document.getElementById("passport").value;
  const destination = document.getElementById("destination").value;
  const resultDiv = document.getElementById("result");

  if (!passport || !destination) {
    resultDiv.innerHTML = "<p>Please select both nationality and destination.</p>";
    return;
  }

  const visaData = await fetchVisaData();

  const result = visaData.find(entry =>
    entry.passport === passport && entry.destination === destination
  );

  if (result) {
    resultDiv.innerHTML = `
      <h3>Visa Requirement: ${result.requirement}</h3>
      <p>${result.guidance}</p>
    `;
  } else {
    resultDiv.innerHTML = "<p>No visa information available for this route.</p>";
  }
}

window.onload = populateDropdowns;
