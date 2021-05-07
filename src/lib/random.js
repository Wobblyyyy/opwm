const random = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "1234567890",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    text: function (length, chars) {
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(chars.charAt(
                Math.floor(Math.random() * chars.length)
            ));
        }
        return result.join("");
    },
    textAlphanumeric: function (length) {
        return this.text(length, this.alphanumeric);
    },
    textNumeric: function (length) {
        return this.text(length, this.numbers);
    },
    textLetters: function (length) {
        return this.text(length, this.letters)
    },
    textUppercase: function (length) {
        return this.text(length, this.uppercase);
    },
    textLowercase: function (length) {
        return this.text(length, this.lowercase);
    },
    eightCharId: function () {
        return this.textLetters(8);
    }
}
