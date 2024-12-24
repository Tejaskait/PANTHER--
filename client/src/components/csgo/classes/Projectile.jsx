import React from 'react';


export default class Projectile {
    constructor({ x, y, radius, color='white', velocity }) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
  
    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
      context.closePath();
    }
  
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }