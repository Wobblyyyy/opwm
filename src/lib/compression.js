const lzw = {
    // Takes a string input and returns a compressed string output.
    encode: function (text) {
        if (!text) return text;

        let dictionary = new Map();
        let data = (text + "").split("");
        let output = [];

        let currentCharacter;
        let phrase = data[0];
        let code = 256;

        for (let i = 1; i < data.length; i++) {
            currentCharacter = data[i];

            if (dictionary.has(phrase + currentCharacter)) {
                phrase += currentCharacter;
            } else {
                output.push(phrase.length > 1 ? dictionary.get(phrase) : phrase.charCodeAt(0));
                dictionary.set(phrase + currentCharacter, code);

                code++;
                phrase = currentCharacter;
            }
        }

        output.push(phrase.length > 1 ? dictionary.get(phrase) : phrase.charCodeAt(0));

        for (let i = 0; i < output.length; i++) {
            output[i] = String.fromCharCode(output[i]);
        }

        return output.join("");
    },

    // Takes a compressed string input and returns a string output.
    decode: function (encoded) {
        let dictionary = new Map();
        let data = (encoded + "").split("");
        let currentCharacter = data[0];
        let output = [currentCharacter];

        let phrase;
        let oldPhrase = currentCharacter;
        let code = 256;

        for (let i = 1; i < data.length; i++) {
            let currentCode = data[i].charCodeAt(0);

            if (currentCode < 256) {
                phrase = data[i];
            } else {
                phrase = dictionary.has(currentCode) ?
                    dictionary.get(currentCode) :
                    (oldPhrase + currentCharacter);
            }

            output.push(phrase);
            currentCharacter = phrase.charAt(0);
            dictionary.set(code, oldPhrase + currentCharacter);

            code++;
            oldPhrase = phrase;
        }

        return output.join("");
    },

    encodeUtf8: function (s) {
        return encodeURIComponent(s).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            });
    },

    decodeUtf8: function (s) {
        return decodeURIComponent(s.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    encodePlaintext: function (s) {
        return this.encodeUtf8(this.encode(s));
    },

    decodePlaintext: function (s) {
        return this.encodeUtf8(this.decode(this.decodeUtf8(s)));
    },

    compress: function (s) {
        return this.encodePlaintext(s);
    },

    decompress: function (s) {
        return this.decodePlaintext(s);
    }
}
