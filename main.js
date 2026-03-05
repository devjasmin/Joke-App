import "./style.css";

const newJokeBtn = document.querySelector(".jokes-app__newjoke");
const saveJokeBtn = document.querySelector(".jokes-app__savejoke");
const deleteJokeBtn = document.querySelector(".jokes-app__deletejoke");
const deleteAllJokeBtn = document.querySelector(".jokes-app__clearAllJokes");
const darkModeToggle = document.getElementById("dm-toggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("darkmode");
});

let currentJoke = null;

newJokeBtn.addEventListener("click", loadjoke);
saveJokeBtn.addEventListener("click", savejoke);
deleteJokeBtn.addEventListener("click", deletejoke);
deleteAllJokeBtn.addEventListener("click", clearAllJokes);

const jokeElement = document.getElementById("joke");

function loadjoke() {
  fetch("https://v2.jokeapi.dev/joke/Any?lang=de", {
    headers: {
      Accept: "application/json",
      "User-Agent": "Joke-App (https://devjasmin.github.io/joke-app)",
    },
  })
    .then((response) => response.json())
    .then((jokeData) => {
      let jokeText = "";

      if (jokeData.type === "single") {
        jokeText = jokeData.joke?.trim();
      } else if (jokeData.type === "twopart") {
        jokeText = `${jokeData.setup} ${jokeData.delivery}`.trim();
      }

      if (!jokeText) {
        jokeElement.textContent =
          "Kein deutscher Witz gefunden. Bitte erneut versuchen.";
        return;
      }

      currentJoke = { id: jokeData.id, text: jokeText };
      document.getElementById("joke").textContent = currentJoke.text;
      console.log("Joke ID:", currentJoke.id); // 👈 HIER IST DIE ID
      console.log("Joke Text:", currentJoke.text); // HIER IST DEIN TEXT
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

  const alreadySaved = [...witze.children].some(
    (p) => p.textContent === currentJoke.text,
  );

  if (alreadySaved) {
    alert("Dieser Witz wurde bereits gespeichert.");
    return; // Witz nicht doppelt speichern
  }

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

function clearAllJokes() {
  localStorage.removeItem("jokes");
  document.getElementById("witzliste").innerHTML = " ";
}
