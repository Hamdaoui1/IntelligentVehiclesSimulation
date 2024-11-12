const nbVehicles = 20;
let vehicles = [];
let targets = []; // Tableau pour les cibles
let movingTargets = []; // Tableau pour les cibles en mouvement
let font; // Police pour dessiner les lettres "HAMDAOUI HAMZA"
let targetsReached = []; // Pour suivre si une cible a été atteinte
let allTargetsReached = false; // Pour vérifier si toutes les cibles sont atteintes
let vehiclesStarted = false; // Pour vérifier si les véhicules ont commencé à apparaître
let explosions = []; // Pour gérer les explosions
let vehiclesArrived = []; // Pour suivre si les véhicules sont arrivés à leurs cibles

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf'); // Charger une police à partir d'une URL
}

function setup() {
  createCanvas(800, 800);

  // Créer les cibles pour former "HAMDAOUI HAMZA"
  createLetterTargets();

  // Créer des cibles en mouvement initialisées à une position aléatoire
  createMovingTargets();

  // Initialiser le tableau des cibles atteintes
  targetsReached = Array(movingTargets.length).fill(false);
  vehiclesArrived = Array(nbVehicles).fill(false); // Initialiser le tableau pour suivre l'arrivée des véhicules
}

function createLetterTargets() {
  // Utiliser la fonction textToPoints de p5.js pour obtenir des positions des lettres "HAMDAOUI HAMZA"
  let points = font.textToPoints('HAMDAOUI HAMZA', 50, 300, 64, { // Réduire la taille de la police pour qu'elle s'adapte à l'écran
    sampleFactor: 0.2, // Facteur d'échantillonnage pour réduire le nombre de points et ajuster la densité
    simplifyThreshold: 0
  });

  targets = points.map(pt => createVector(pt.x, pt.y));
}

function createVehicles(nbVehicles) {
  for (let i = 0; i < nbVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
}

function createMovingTargets() {
  for (let i = 0; i < targets.length; i++) {
    let x = random(width);
    let y = random(height);
    movingTargets.push(createVector(x, y));
  }
}

function draw() {
  background(0);

  // Mettre à jour les positions des cibles en mouvement vers leurs positions finales
  movingTargets.forEach((movingTarget, index) => {
    if (!targetsReached[index]) {
      let target = targets[index];
      let dir = p5.Vector.sub(target, movingTarget);
      if (dir.mag() > 2) {
        dir.setMag(2); // Ajuster la vitesse de mouvement des cibles
        movingTarget.add(dir);
      } else {
        movingTarget.set(target); // Fixer la position une fois atteinte
        targetsReached[index] = true;
      }
    }

    // Dessiner la cible en mouvement si elle n'a pas encore explosé
    if (!explosions[index]) {
      fill(255, 0, 0);
      noStroke();
      ellipse(movingTarget.x, movingTarget.y, 10);
    }
  });

  // Vérifier si toutes les cibles ont été atteintes
  if (!allTargetsReached && targetsReached.every(reached => reached)) {
    allTargetsReached = true;
    vehiclesStarted = true;
    createVehicles(nbVehicles); // Créer des véhicules une fois que les cibles ont atteint leurs positions finales
  }

  // Mettre à jour le comportement des véhicules une fois qu'ils ont commencé
  if (vehiclesStarted) {
    vehicles.forEach((vehicle, index) => {
      if (index < movingTargets.length && !vehiclesArrived[index]) {
        let steering = vehicle.arrive(movingTargets[index], 50);
        vehicle.applyForce(steering);
        vehicle.update();
        vehicle.show();

        // Loguer l'état du véhicule
        if (!vehiclesArrived[index]) {
          console.log(`Véhicule ${index} est en route vers la cible (${movingTargets[index].x}, ${movingTargets[index].y}). Position actuelle: (${vehicle.pos.x}, ${vehicle.pos.y})`);
        }

        // Explosion lorsque le véhicule atteint sa cible
        if (vehicleHasArrived(vehicle, movingTargets[index])) {
          vehiclesArrived[index] = true;
          explosions[index] = true;
          console.log(`Véhicule ${index} est arrivé à sa cible.`); // Ajouter un message de log lorsque le véhicule atteint sa cible
          createExplosion(movingTargets[index].x, movingTargets[index].y);
        }
      }
    });

    // Vérifier si tous les véhicules ont atteint leurs cibles
    if (vehiclesArrived.every(arrived => arrived)) {
      console.log("Tous les véhicules sont arrivés à leurs cibles.");
    }
  }

  // Dessiner les explosions
  explosions.forEach((exploded, index) => {
    if (exploded) {
      drawExplosion(movingTargets[index]);
    }
  });
}

function vehicleHasArrived(vehicle, target) {
  const distanceThreshold = 5; // Distance pour considérer que le véhicule est arrivé
  return p5.Vector.dist(vehicle.pos, target) < distanceThreshold;
}

function createExplosion(x, y) {
  for (let i = 0; i < 15; i++) {
    let angle = random(TWO_PI);
    let distance = random(20, 50);
    let offsetX = cos(angle) * distance;
    let offsetY = sin(angle) * distance;
    explosions.push({ x: x + offsetX, y: y + offsetY, alpha: 255 });
  }
}

function drawExplosion(target) {
  fill(255, 150, 0, target.alpha);
  noStroke();
  ellipse(target.x, target.y, random(5, 15));
  target.alpha -= 5; // Réduire l'opacité pour l'effet de disparition
}

function keyPressed() {
  if (key === 'd') {
    // Basculer le mode debug pour les véhicules
    Vehicle.debug = !Vehicle.debug;
    console.log(`Debug mode is now ${Vehicle.debug ? "ON" : "OFF"}`);
  }

  if (key === 'x') {
    // Arrêter l'intervalle si nécessaire
    clearInterval(interval);
    console.log("Interval stopped.");
  }
}
