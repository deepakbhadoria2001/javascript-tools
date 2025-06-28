const features = [
  {
    name: "Random Password Generator",
    path: "passwordGenerator/password.html"
  },
  {
    name: "Another Feature",
    path: "another-feature/feature.html"
  }
  
];

const container = document.getElementById("buttonContainer");

features.forEach(feature => {
  const button = document.createElement("button");
  button.textContent = feature.name;
  button.onclick = () => {
    location.href = feature.path;
  };
  container.appendChild(button);
});
