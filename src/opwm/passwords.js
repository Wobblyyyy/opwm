const passwords = {
    securityLevel: function (password) {
        const symbols = [
            "!", "@", "#", "$", "%", "^", "&", "*", "(", ")",
            "_", "-", "+", ":", "/", "\\", "{", "}", "[", "]"
        ];

        let level = 0;

        if (password.length > 8) level += 1;
        if (password.length > 12) level += 1;
        if (password.length > 20) level += 2;

        for (let s of symbols) {
            if (password.includes(s)) level += 1;
        }

        return `${level}/24`;
    }
}