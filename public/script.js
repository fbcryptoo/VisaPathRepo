const passportSelect = document.getElementById('passport');
const destinationSelect = document.getElementById('destination');
const checkBtn = document.getElementById('checkBtn');
const resultBox = document.getElementById('result');

// Load CSV and populate dropdowns
fetch('combined_passport_data_with_guidance (2) (1).csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.split('\n').slice(1);
    const passports = new Set();
    const destinations = new Set();

    rows.forEach(row => {
      const cols = row.split(',');
      passports.add(cols[0]?.trim());
      destinations.add(cols[1]?.trim());
    });

    [...passports].sort().forEach(country => {
      const opt = document.createElement('option');
      opt.value = country;
      opt.textContent = country;
      passportSelect.appendChild(opt);
    });

    [...destinations].sort().forEach(country => {
      const opt = document.createElement('option');
      opt.value = country;
      opt.textContent = country;
      destinationSelect.appendChild(opt);
    });
  });

checkBtn.addEventListener('click', () => {
  const passport = passportSelect.value;
  const destination = destinationSelect.value;

  fetch('combined_passport_data_with_guidance (2) (1).csv')
    .then(res => res.text())
    .then(data => {
      const rows = data.split('\n').slice(1);
      const match = rows.find(row => {
        const [p, d] = row.split(',');
        return p.trim() === passport && d.trim() === destination;
      });

      if (match) {
        const cols = match.split(',');
        const requirement = cols[2]?.trim();
        const link = cols[3]?.trim();
        const guidance = cols[4]?.trim();

        let message = `<strong>You need a visa to travel to ${destination}</strong><br>${guidance || ''}`;

        if (/e-visa|ESTA|eTA/i.test(requirement)) {
          message = `<strong>You need to apply for an ${requirement.toUpperCase()}</strong><br>`;
        }

        if (link && link !== 'NaN') {
          message += `<br><a href="${link}" target="_blank" style="color: #d97706; text-decoration: underline;">Apply here</a>`;
        }

        resultBox.innerHTML = message;
        resultBox.classList.remove('hidden');
      } else {
        resultBox.innerHTML = `We couldn't find visa data for this route.`;
        resultBox.classList.remove('hidden');
      }
    });
});
