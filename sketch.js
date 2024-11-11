// Updated version of sketch.js with the requested modifications

const nbVehicles = 10;
let vehicles = [];
let target;
let interval; // Intervalle pour modifier la direction de la cible
let mouseFollower; // Véhicule suivant la souris
let seeker; // Véhicule avec arrive() sur mouseFollower

function setup() {
  createCanvas(800, 800);

  // Créer une cible initiale
  target = createRandomTarget();

  // Créer des véhicules de base 
  createVehicles(nbVehicles);

  // Créer un véhicule qui suit la souris
  mouseFollower = new Vehicle(random(width), random(height));

  // Créer un véhicule qui arrive sur le mouseFollower
  seeker = new Vehicle(random(width), random(height));

  // Définir un intervalle pour changer la direction de la cible toutes les secondes
  interval = setInterval(() => {
    target = createRandomTarget();
  }, 1000); // 1000 ms = 1 seconde
}

function createVehicles(nbVehicles) {
  for (let i = 0; i < nbVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
}

function draw() {
  background(0);

  // Dessiner la cible
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // Mettre à jour le comportement des véhicules
  vehicles.forEach((vehicle, index) => {
    let steering;

    if (index === 0) {
      // Le premier véhicule se dirige vers la cible
      steering = vehicle.arrive(target);
    } else {
      // Les véhicules suivants suivent le précédent
      let newTarget = vehicles[index - 1].pos;
      steering = vehicle.arrive(newTarget, 40);
    }

    // Appliquer la force et mettre à jour le véhicule
    vehicle.applyForce(steering);
    vehicle.update();
    vehicle.show();
  });
  // Comportement : véhicule suivant la souris
  let mouseTarget = createVector(mouseX, mouseY);
  let mouseSteering = mouseFollower.seek(mouseTarget);
  mouseFollower.applyForce(mouseSteering);
  mouseFollower.update();
  mouseFollower.show();

  // Comportement : véhicule arrive() sur le mouseFollower
  let seekerSteering = seeker.arrive(mouseFollower.pos);
  seeker.applyForce(seekerSteering);
  seeker.update();
  seeker.show();
}

function createRandomTarget() {
  let x = random(width);
  let y = random(height);
  return createVector(x, y);
}

// function vehicleReachedTarget(vehicle) {
//   return p5.Vector.dist(vehicle.pos, target) < 10;
// }

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


