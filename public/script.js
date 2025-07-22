async function fetchVisaData() {
  const response = await fetch("combined_passport_data_with_guidance.csv");
  const csvText = await response.text();
  const rows = csvText.trim().split('\n');
  const headers = rows[0].split(',');

  return rows.slice(1).map(row => {
    const cols = row.split(',');
    return {
      passport: cols[0].trim(),
      destination: cols[1].trim(),
      requirement: cols[2].trim(),
      guidance: cols.slice(3).join(',').trim()
    };
  });
}

async function populateDropdowns() {
  const data = await fetchVisaData();
  const passports = [...new Set(data.map(d => d.passport))].sort();
  const destinations = [...new Set(data.map(d => d.destination))].sort();

  const natSel = document.getElementById("nationality");
  const destSel = document.getElementById("destination");

  passports.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.text = p;
    natSel.appendChild(opt);
  });

  destinations.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.text = d;
    destSel.appendChild(opt);
  });

  window.visaData = data;
}

function checkVisa() {
  const from = document.getElementById("nationality").value;
  const to = document.getElementById("destination").value;
  const div = document.getElementById("result");

  if (!from || !to) {
    div.innerHTML = "<p>Please select both nationality and destination.</p>";
    return;
  }

  const result = window.visaData.find(e => e.passport === from && e.destination === to);
  if (result) {
    div.innerHTML = `
      <h3>${from} → ${to}</h3>
      <p><strong>${result.requirement}</strong></p>
      <p>${result.guidance}</p>
    `;
  } else {
    div.innerHTML = `<h3>${from} → ${to}</h3><p>⏳ Info coming soon for this route.</p>`;
  }
}

window.onload = populateDropdowns;
