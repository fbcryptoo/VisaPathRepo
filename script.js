let visaInfo = {};

function loadVisaData() {
  Papa.parse('combined_passport_data_with_guidance.csv', {
    header: true,
    download: true,
    complete: function(results) {
      const data = results.data;
      data.forEach(row => {
        const key = `${row.Passport}-${row.Destination}`;
        visaInfo[key] = {
          status: row.Requirement,
          guidance: row.Guidance,
          link: row.ETA_Link
        };
      });

      const countries = [...new Set(data.flatMap(r => [r.Passport, r.Destination]))].sort();
      const nationalitySelect = document.getElementById('nationality');
      const destinationSelect = document.getElementById('destination');

      countries.forEach(c => {
        nationalitySelect.appendChild(new Option(c, c));
        destinationSelect.appendChild(new Option(c, c));
      });
    }
  });
}

function checkVisa() {
  const from = document.getElementById('nationality').value;
  const to = document.getElementById('destination').value;
  const key = `${from}-${to}`;
  const data = visaInfo[key];
  const div = document.getElementById('visa-result');
  if (data) {
    div.innerHTML = `<h3>${from} → ${to}</h3><p><strong>${data.status}</strong></p><p>${data.guidance || ''}</p>` +
      (data.link ? `<a href="${data.link}" class="link-btn" target="_blank">Apply here</a>` : '');
  } else {
    div.innerHTML = `<h3>${from} → ${to}</h3><p>⏳ Info coming soon for this pair.</p>`;
  }
  div.style.display = 'block';
}

loadVisaData();
