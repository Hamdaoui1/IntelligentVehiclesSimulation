// Updated version of sketch.js with the requested modifications

const nbVehicles = 10;
let vehicles = [];
let target;

function setup() {
  createCanvas(800, 800);

  // Create random initial target
  target = createRandomTarget();

  // Create vehicles
  createVehicles(nbVehicles);
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

  // Draw target
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // Update vehicles behavior
  vehicles.forEach((vehicle, index) => {
    let steering;

    if (index === 0) {
      // First vehicle: arrives at the target
      steering = vehicle.arrive(target);
      if (vehicleReachedTarget(vehicle)) {
        target = createRandomTarget(); // Move the target randomly once reached
      }
    } else {
      // Subsequent vehicles follow the previous one
      let newTarget = vehicles[index - 1].pos;
      steering = vehicle.arrive(newTarget, 40);
    }

    // Apply force and update vehicle
    vehicle.applyForce(steering);
    vehicle.update();
    vehicle.show();
  });
}

function createRandomTarget() {
  let x = random(width);
  let y = random(height);
  return createVector(x, y);
}

function vehicleReachedTarget(vehicle) {
  return p5.Vector.dist(vehicle.pos, target) < 10;
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}
