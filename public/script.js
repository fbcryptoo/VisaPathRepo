let countries = [];
let visaData = {};

fetch("combined_passport_data_with_guidance.csv")
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const from = values[0].trim();
      const to = values[1].trim();
      const requirement = values[2].trim();
      const link = values[3] ? values[3].trim() : "";

      if (!countries.includes(from)) countries.push(from);
      if (!countries.includes(to)) countries.push(to);

      if (!visaData[from]) visaData[from] = {};
      visaData[from][to] = { requirement, link };
    }

    countries.sort();
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
    countries.forEach((country) => {
      fromSelect.innerHTML += `<option value="${country}">${country}</option>`;
      toSelect.innerHTML += `<option value="${country}">${country}</option>`;
    });
  });

function checkVisa() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const resultDiv = document.getElementById("result");

  if (visaData[from] && visaData[from][to]) {
    const { requirement, link } = visaData[from][to];
    let message = "";

    if (requirement.toLowerCase().includes("visa")) {
      message += `You need a ${requirement.toLowerCase()} to travel to ${to}.`;
    } else {
      message += `You do not need a visa to travel to ${to}.`;
    }

    if (link) {
      message += ` <a href="${link}" target="_blank" rel="noopener">Apply or learn more here</a>.`;
    }

    resultDiv.innerHTML = message;
  } else {
    resultDiv.innerHTML = "Visa information not found.";
  }
}
