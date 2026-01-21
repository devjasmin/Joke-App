import "./style.css";

let currentJoke = null;

function loadjoke() {
  const jokeElement = document.getElementById("joke");

  fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
      "User-Agent": "Witze-App (https://devjasmin.github.io/witze-app)",
    },
  })
    .then((response) => response.json())
    .then((jokeData) => {
      currentJoke = { id: jokeData.id, text: jokeData.joke };
      document.getElementById("joke").textContent = currentJoke.text;
      // console.log("Joke ID:", joke.id); // 👈 HIER IST DIE ID
      // console.log("Joke Text:", joke.text); // HIER IST DEIN TEXT
    })
    .catch((error) => {
      jokeElement.textContent = "Witz konnte nicht geladen werden.";
      console.error("Fehler beim Laden des Jokes:", error);
    });
}

function savejoke() {
  if (!currentJoke) return; //Sicherstellen, dass ein Witz geladen ist

  //DOM: Witz anzeigen
  const witze = document.getElementById("witzliste");
  const p = document.createElement("p");
  p.classList.add("saved-joke");
  p.textContent = currentJoke.text;
  witze.appendChild(p);

  // LocalStorage - Witz speichern
  const savedJokes = JSON.parse(localStorage.getItem("jokes") || "[]");
  savedJokes.push(currentJoke);
  localStorage.setItem("jokes", JSON.stringify(savedJokes));
}

// Witz aus LocalStorage laden
function loadSaveJokes() {
  const savedJokes = JSON.parse(localStorage.getItem("jokes") || "[]");
  const witze = document.getElementById("witzliste");

  savedJokes.forEach((joke) => {
    const p = document.createElement("p");
    p.classList.add("saved-joke");
    p.textContent = joke.text;
    witze.appendChild(p);
  });
}

// Lädt Witze beim Start
document.addEventListener("DOMContentLoaded", loadSaveJokes);

function renderJokes() {
  const savedJokes = JSON.parse(localStorage.getItem("jokes") || "[]");
  const witze = document.getElementById("witzliste");

  witze.innerHTML = ""; // Clear existing jokes

  savedJokes.forEach((joke) => {
    const p = document.createElement("p");
    p.classList.add("saved-joke");
    p.textContent = joke.text;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => deletejoke(joke.id);

    p.appendChild(btn);
    witze.appendChild(p);
  });
}

function deletejoke(id) {
  const Jokedelete = JSON.parse(localStorage.getItem("jokes") || "[]");
  const updatedJokes = Jokedelete.filter((joke) => joke.id !== id);
  localStorage.setItem("jokes", JSON.stringify(updatedJokes));
  renderJokes();
}

function clearJokes() {
  localStorage.removeItem("jokes");
  document.getElementById("witzliste").innerHTML = "";
}
clearJokes();
