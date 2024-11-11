const nbVehicles = 10;
const nbAdditionalVehicles = 5; // Nombre de véhicules supplémentaires qui suivent le premier en chaîne
let vehicles = [];
let target;
let interval; // Intervalle pour modifier la direction de la cible
let mouseFollower; // Véhicule suivant la souris
let seeker; // Véhicule avec arrive() sur mouseFollower
let formationVehicles = []; // Véhicules en formation autour du premier véhicule

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

  // Créer des véhicules supplémentaires qui suivent le premier en chaîne
  createAdditionalVehicles(nbAdditionalVehicles);

  // Créer des véhicules en formation en V autour du premier véhicule
  createFormationVehicles();

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

function createAdditionalVehicles(nbAdditionalVehicles) {
  for (let i = 0; i < nbAdditionalVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
}

function createFormationVehicles() {
  const leader = vehicles[0];
  const offsetDistance = 100;
  const angleOffset = PI / 6; // 30 degrees for V formation

  for (let i = 0; i < 5; i++) {
    let offsetAngle = angleOffset * (i - 2); // Place vehicles in a V shape
    let offsetX = offsetDistance * cos(offsetAngle);
    let offsetY = offsetDistance * sin(offsetAngle);
    let newVehicle = new Vehicle(leader.pos.x + offsetX, leader.pos.y + offsetY);
    formationVehicles.push(newVehicle);
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
      steering = vehicle.arrive(target, 100); // Modifier pour que la vitesse désirée soit nulle à une distance de 100
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

  // Mettre à jour le comportement des véhicules en formation
  formationVehicles.forEach((vehicle, index) => {
    let leader = vehicles[0];
    let target = createVector(leader.pos.x + 100 * cos(PI / 6 * (index - 2)), leader.pos.y + 100 * sin(PI / 6 * (index - 2)));
    let steering = vehicle.arrive(target, 40);

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
