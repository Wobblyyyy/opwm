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
      currentChar = data[i];
      
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
    let oldPhrase = currentCharacter;
    let output = [currentCharacter];
    let code = 256;
    let phrase;
    
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
  }
}
