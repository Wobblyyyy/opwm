const random = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "1234567890",
  alphanumeric: this.uppercase + this.lowercase + this.numbers,
  text: function (length) {
    let result = [];
    for (let i = 0; i < length; i++) {
      result.push(this.alphanumeric.charAt(Math.floor(Math.random() * this.alphanumeric.length)));
    }
    return result.join("");
  }
}
