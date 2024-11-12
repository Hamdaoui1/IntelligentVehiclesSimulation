
class Vehicle {
  static debug = false;

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 10;
    this.maxForce = 0.6;
    this.r = 16;
    this.rayonZoneDeFreinage = 100;
  }

  hasReachedTarget(target) {
    let distance = p5.Vector.dist(this.pos, target);
    return distance < this.r; // Considérer le véhicule comme arrivé si la distance est inférieure à son rayon
  }

  explode() {
    fill(255, 150, 0);
    noStroke();
    for (let i = 0; i < 10; i++) {
      let offset = p5.Vector.random2D().mult(random(5, 20));
      ellipse(this.pos.x + offset.x, this.pos.y + offset.y, random(5, 10));
    }
  }

  arrive(target, d = 0) {
    return this.seek(target, true, d);
  }

  seek(target, arrival = false, d) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      if (Vehicle.debug) {
        stroke(255, 255, 255);
        noFill();
        circle(target.x, target.y, this.rayonZoneDeFreinage);
      }

      let distance = p5.Vector.dist(this.pos, target);

      if (distance < this.rayonZoneDeFreinage) {
        desiredSpeed = map(distance, d, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
