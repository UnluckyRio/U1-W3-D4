document.addEventListener("DOMContentLoaded", () => {
  const setupContainer = document.getElementById("setup-container");
  const numCartelleInput = document.getElementById("numCartelle");
  const startGameBtn = document.getElementById("startGame");
  const gameContainer = document.getElementById("game-container");

  const tabellonePrincipaleDiv = document.getElementById(
    "tabellone-principale"
  );
  const estraiNumeroBtn = document.getElementById("estraiNumero");
  const cartelleGiocatoreContainer = document.getElementById(
    "cartelle-giocatore-container"
  );

  const numeriEstratti = new Set();
  let cartelleGenerali = [];

  // 1. Funzione per creare il tabellone principale (1-76)
  function creaTabellonePrincipale() {
    tabellonePrincipaleDiv.innerHTML = "";
    for (let i = 1; i <= 76; i++) {
      const cella = document.createElement("div");
      cella.classList.add("cella-tabellone");
      cella.id = `tabellone-cella-${i}`;
      cella.textContent = i;
      tabellonePrincipaleDiv.appendChild(cella);
    }
  }

  // genera una singola cartella del giocatore
  function generaCartellaGiocatore(idCartella) {
    const cartellaNumeri = new Set();
    while (cartellaNumeri.size < 24) {
      const numeroCasuale = Math.floor(Math.random() * 76) + 1;
      cartellaNumeri.add(numeroCasuale);
    }

    const cartellaDiv = document.createElement("div");
    cartellaDiv.classList.add("cartella-giocatore");
    cartellaDiv.innerHTML = `<h3>Cartella #${idCartella}</h3><div class="griglia-cartella"></div>`;

    const grigliaCartellaDiv = cartellaDiv.querySelector(".griglia-cartella");
    Array.from(cartellaNumeri)
      .sort((a, b) => a - b)
      .forEach((numero) => {
        const cella = document.createElement("div");
        cella.classList.add("cella-cartella");
        cella.id = `cartella-${idCartella}-cella-${numero}`;
        cella.textContent = numero;
        grigliaCartellaDiv.appendChild(cella);
      });

    cartelleGiocatoreContainer.appendChild(cartellaDiv);
    return Array.from(cartellaNumeri);
  }

  // inizio della partita
  startGameBtn.addEventListener("click", () => {
    const numCartelle = parseInt(numCartelleInput.value);
    if (isNaN(numCartelle) || numCartelle < 1 || numCartelle > 6) {
      alert("Per favore, inserisci un numero di cartelle valido (da 1 a 6).");
      return;
    }

    // Nascondi il setup e mostra il gioco
    setupContainer.style.display = "none";
    gameContainer.style.display = "block";

    creaTabellonePrincipale();
    cartelleGiocatoreContainer.innerHTML = "";
    cartelleGenerali = [];

    // Genera le cartelle del giocatore
    for (let i = 1; i <= numCartelle; i++) {
      const numeriDellaCartella = generaCartellaGiocatore(i);
      cartelleGenerali.push({ id: i, numeri: numeriDellaCartella });
    }
  });

  // estrazione di un numero
  estraiNumeroBtn.addEventListener("click", () => {
    if (numeriEstratti.size >= 76) {
      alert("Tutti i numeri sono stati estratti! La partita è finita.");
      estraiNumeroBtn.disabled = true;
      return;
    }

    let numeroCasuale;
    do {
      numeroCasuale = Math.floor(Math.random() * 76) + 1;
    } while (numeriEstratti.has(numeroCasuale));

    numeriEstratti.add(numeroCasuale);

    console.log(`Numero estratto: ${numeroCasuale}`);

    // 1. Evidenzia la cella sul tabellone principale
    const cellaTabellone = document.getElementById(
      `tabellone-cella-${numeroCasuale}`
    );
    if (cellaTabellone) {
      cellaTabellone.classList.add("estratta");
    }

    // 2. Evidenzia la cella su tutte le cartelle del giocatore
    cartelleGenerali.forEach((cartella) => {
      if (cartella.numeri.includes(numeroCasuale)) {
        const cellaCartella = document.getElementById(
          `cartella-${cartella.id}-cella-${numeroCasuale}`
        );
        if (cellaCartella) {
          cellaCartella.classList.add("estratta");
        }
      }
    });
  });

  // Inizializza il setup all'apertura
  setupContainer.style.display = "block";
  gameContainer.style.display = "none";
});
