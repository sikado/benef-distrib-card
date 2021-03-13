export class Helpers {
  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   *
   * @param max Upper bound
   * @param min Lower bound
   * @returns random integer
   */
  static getRandomInt(max: number, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Return a random hex color
   */
  static getRandomHexColor() {
    Helpers.getRandomInt(255).toString(16);
    return (
      '#' +
      Helpers.getRandomHex() +
      Helpers.getRandomHex() +
      Helpers.getRandomHex()
    );
  }

  /**
   * Return a random uppercase hex number on 2 digits
   */
  static getRandomHex(): string {
    let rand = Helpers.getRandomInt(255).toString(16).toUpperCase();
    if (rand.length === 1) {
      rand = 'O' + rand;
    }
    return rand;
  }
}
