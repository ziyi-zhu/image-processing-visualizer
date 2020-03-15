function Kernel(height, width, type, method) {
  this.height = height;
  this.width = width;
  this.type = type;
  this.method = method;
  this.pixels = [];
  this.output = 0;
}

Kernel.prototype.applyMethod = function() {
  this.output = this.method(this.height * this.width, this.pixels);
}

module.exports = Kernel;