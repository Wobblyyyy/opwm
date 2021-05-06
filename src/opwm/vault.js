// noinspection JSUnfilteredForInLoop

const sha = {
    bits: 128,

    rsaKey: function (contents) {
        return cryptico.generateRSAKey(contents, this.bits);
    },

    rsaStr: function (rsaKey) {
        return cryptico.publicKeyString(rsaKey);
    },

    rsa: function (rsaContents) {
        return this.rsaStr(
            this.rsaKey(
                rsaContents
            )
        );
    },

    encrypt: function (text, pw) {
        return cryptico.encrypt(text, this.rsa(pw));
    },

    decrypt: function (text, pw) {
        return cryptico.decrypt(text, this.rsaKey(pw));
    }
}

const stringJson = {
    from: function (json) {
        return JSON.stringify(json);
    },

    to: function (string) {
        return JSON.parse(string);
    }
}

const vault = {
    contents: {
        main: {
            fields: {},
            name: "Main",
            isFolder: true
        }
    },

    encryptJson: function (json, pw) {
        return sha.encrypt(stringJson.from(json), pw);
    },

    decryptString: function (string, pw) {
        return sha.decrypt(string, pw);
    },

    decryptStringToJson: function (string, pw) {
        return stringJson.to(sha.decrypt(string, pw).plaintext);
    }
}

const render = {
    base: "renderView",
    title: "location",

    getBase: function () {
        return document.getElementById(this.base);
    },

    getTitle: function() {
        return document.getElementById(this.title);
    },

    renderFolder: function (folder) {
        let name = folder.name;
    },

    renderFile: function (file) {
        let name = file.name;
    },

    renderField: function (field) {
        let key = field.key;
        let value = field.value;
    },

    clear: function () {
        this.getBase().innerHTML = "";
    },

    setTitle: function (title) {
        this.getTitle().innerHTML = title;
    },

    tree: function (json) {
        let name = json.name;
        let fields = json.fields;

        this.setTitle(name);

        if (json.isFolder) {
            let folders = {};
            let files = {};

            for (let fieldName in fields) {
                let field = fields[fieldName];

                if (field.isFolder) {
                    folders[fieldName] = field;
                } else {
                    files[fieldName] = field;
                }

                console.log(folders);
                console.log(files);
            }

            for (let folderName in folders) {
                let folder = folders[folderName];

                this.renderFolder(folder);
            }

            for (let fileName in files) {
                let file = files[fileName];

                this.renderFile(file);
            }
        } else {
            for (let fieldName in fields) {
                let field = fields[fieldName];

                this.renderField(field);
            }
        }
    }
}

render.tree({
    isFolder: true,
    name: "test",
    fields: {
        b: {
            isFolder: true,
            name: "sub test",
            fields: {}
        },
        c: {
            isFolder: false,
            name: "cool",
            fields: {
                username: {
                    key: "Username",
                    value: "Very awesome username",
                }
            }
        }
    }
});

// const complicated = {
//     "value1": "hello from value 1",
//     "value2": "hello from value 2"
// }
//
// const encryptedComplicated = vault.encryptJson(complicated, "password");
//
// console.log(encryptedComplicated);
//
// const decryptedComplicated = vault.decryptString(encryptedComplicated.cipher, "password");
//
// console.log(decryptedComplicated);
//
// // console.log(new File(new Folder("", ""), "test", {test: 123}));
