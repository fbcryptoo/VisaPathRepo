let visaData = {};
const fromSelect = document.getElementById("fromCountry");
const toSelect = document.getElementById("toCountry");
const resultBox = document.getElementById("resultBox");

fetch("combined_passport_data_with_guidance.csv")
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.trim().split("\n").slice(1);
    const countries = new Set();
    rows.forEach(row => {
      const [passport, destination, requirement, guidance, link] = row.split(",");
      const key = `${passport}-${destination}`;
      visaData[key] = { requirement, guidance, link };
      countries.add(passport);
      countries.add(destination);
    });
    const sortedCountries = Array.from(countries).sort();
    sortedCountries.forEach(c => {
      fromSelect.innerHTML += `<option value="\${c}">\${c}</option>`;
      toSelect.innerHTML += `<option value="\${c}">\${c}</option>`;
    });
    fromSelect.selectedIndex = 0;
    toSelect.selectedIndex = 0;
  });

document.getElementById("checkBtn").onclick = () => {
  const from = fromSelect.value;
  const to = toSelect.value;
  const data = visaData[`${from}-${to}`];
  if (!data) {
    resultBox.innerHTML = `<p>No visa information available yet for this pair.</p>`;
    return;
  }

  let msg = "";
  if (/e-visa|eTA|ESTA/i.test(data.requirement)) {
    msg = `You need to apply for an <strong>${data.requirement}</strong>.`;
    if (data.link) {
      msg += ` <a href="\${data.link}" target="_blank">Apply here</a>.`;
    }
  } else if (/visa required/i.test(data.requirement)) {
    msg = `You need a visa to travel to <strong>\${to}</strong>.`;
    if (data.link) {
      msg += ` <a href="\${data.link}" target="_blank">Get more information here</a>.`;
    } else {
      msg += ` ${data.guidance}`;
    }
  } else {
    msg = `<strong>${data.requirement}</strong><br>${data.guidance}`;
  }
  resultBox.innerHTML = msg;
};
