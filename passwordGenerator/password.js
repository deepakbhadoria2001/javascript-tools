function generatePassword() {
  const length = parseInt(document.getElementById("length").value);
  const includeUpper = document.getElementById("uppercase").checked;
  const includeLower = document.getElementById("lowercase").checked;
  const includeNumbers = document.getElementById("numbers").checked;
  const includeSymbols = document.getElementById("symbols").checked;

  let charset = "";
  if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+[]{}|;:<>,.?/";

  if (!charset) {
    alert("Select at least one character set");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  document.getElementById("password").textContent = password;
  document.getElementById("passwordSection").style.display = "block";
  document.getElementById("saveCheckbox").checked = false;
  document.getElementById("nickname").value = "";

  document.getElementById("saveCheckbox").onchange = function () {
    if (this.checked) {
      const nickname = document.getElementById("nickname").value.trim();
      if (!nickname) {
        alert("Please enter a nickname");
        this.checked = false;
        return;
      }

      const encrypted = btoa(password); // Base64 encoding
      const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
      saved.push({ nickname, password: encrypted });
      localStorage.setItem("savedPasswords", JSON.stringify(saved));

      renderSavedPasswords();
    }
  };
}

function renderSavedPasswords() {
  const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  const tbody = document.getElementById("savedBody");
  tbody.innerHTML = "";

  saved.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.nickname}</td>
      <td>${atob(entry.password)}</td>
      <td><button onclick="deletePassword(${index})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deletePassword(index) {
  const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedPasswords", JSON.stringify(saved));
  renderSavedPasswords();
}

function exportToCSV() {
  const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  if (!saved.length) return alert("No passwords to export.");

  const rows = [["Nickname", "Password"]];
  saved.forEach(entry => {
    rows.push([entry.nickname, atob(entry.password)]);
  });

  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "passwords.csv";
  a.click();
}

function exportToJSON() {
  const saved = JSON.parse(localStorage.getItem("savedPasswords") || "[]");
  if (!saved.length) return alert("No passwords to export.");

  const data = saved.map(e => ({
    nickname: e.nickname,
    password: atob(e.password)
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "passwords.json";
  a.click();
}

// Load saved passwords on page load
renderSavedPasswords();
