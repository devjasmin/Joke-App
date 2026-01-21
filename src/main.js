import "./style.css";

const newJokeBtn = document.querySelector(".newjoke");
const saveJokeBtn = document.querySelector(".savejoke");
const deleteJokeBtn = document.querySelector(".deleteJoke");
const deleteAllJokeBtn = document.querySelector(".deleteAllJoke");

let currentJoke = null;

newJokeBtn.addEventListener("click", loadjoke);
saveJokeBtn.addEventListener("click", savejoke);
deleteJokeBtn.addEventListener("click", deletejoke);
deleteAllJokeBtn.addEventListener("click", deleteAllJokeBtn);

const jokeElement = document.getElementById("joke");
function loadjoke() {
  fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
      "User-Agent": "Joke-App (https://devjasmin.github.io/joke-app)",
    },
  })
    .then((response) => response.json())
    .then((jokeData) => {
      currentJoke = { id: jokeData.id, text: jokeData.joke };
      document.getElementById("joke").textContent = currentJoke.text;
      console.log("Joke ID:", joke.id); // 👈 HIER IST DIE ID
      console.log("Joke Text:", joke.text); // HIER IST DEIN TEXT
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
    console.log(joke.id);

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", () => deletejoke(joke.id));

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

document.addEventListener("DOMContentLoaded", () => {
  loadjoke();
  renderJokes();
});
