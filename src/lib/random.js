const random = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
  text: function (length) {
    let result = [];
    for (let i = 0; i < length; i++) {
      result.push(this.alphanumeric.charAt(Math.floor(Math.random() * this.alphanumeric.length)));
    }
    return result.join("");
  }
}
