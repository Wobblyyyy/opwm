// noinspection JSUnfilteredForInLoop, UnnecessaryLocalVariableJS

const aes256 = {
    bits: 1024,

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
        isFolder: true,
        name: "test",
        fields: {
            b: {
                isFolder: true,
                name: "sub test",
                fields: {
                    b1: {
                        isFolder: true,
                        name: "B1"
                    },
                    b2: {
                        isFolder: true,
                        name: "B2"
                    }
                }
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
            },
            d: {
                isFolder: false,
                name: "super cool",
                fields: {
                    username: {
                        key: "Username",
                        value: "Very awesome username",
                    }
                }
            },
            e: {
                isFolder: true,
                name: "small test",
                fields: {}
            },
            f: {
                isFolder: true,
                name: "brush e",
                fields: {}
            },
            g: {
                isFolder: true,
                name: "small test e",
                fields: {}
            },
            h: {
                isFolder: true,
                name: "brush a",
                fields: {}
            },
        }
    },

    compress: function (v) {
        return lzw.compress(v);
    },

    decompress: function (v) {
        return lzw.decompress(v);
    },

    sealVault: function (json, pw) {
        let string = stringJson.from(json);
        let compressed = this.compress(string);
        let encrypted = aes256.encrypt(compressed, pw);

        return encrypted;
    },

    unsealVault: function (string, pw) {
        let decrypted = aes256.decrypt(string, pw);
        let decompressed = this.decompress(decrypted.plaintext);
        let json = stringJson.to(decompressed);

        return {
            status: decrypted.status,
            json: json
        }
    }
}

const render = {
    base: "renderView",
    title: "location",
    back: "back",
    path: [],

    tracePath: function (json) {
        for (let p of this.path) {
            if (json.hasOwnProperty(p)) {
                json = json[p];
            }
        }

        return json;
    },

    rerender: function () {
        this.tree(this.tracePath(vault.contents));
    },

    goBack: function () {
        if (this.path.length > 0) {
            this.path.pop();
            this.path.pop();
        }

        this.rerender();
    },

    click: function (target) {
        this.path.push("fields");
        this.path.push(target);

        this.rerender();
    },

    bindClick: function (element, code) {
        element.onclick = function () {
            render.click(code);
        }

        return element;
    },

    getBase: function () {
        return document.getElementById(this.base);
    },

    getTitle: function () {
        return document.getElementById(this.title);
    },

    getBack: function () {
        return document.getElementById(this.back);
    },

    bindBack: function () {
        let button = this.getBack();

        button.onclick = function () {
            render.goBack();
        }
    },

    renderFolder: function (folder, code) {
        let name = folder.name;

        let element = document.createElement("p");
        element.innerHTML = name;
        element.className = "container folder";

        this.bindClick(element, code);

        this.getBase().appendChild(element);
    },

    renderFile: function (file, code) {
        let name = file.name;

        let element = document.createElement("p");
        element.innerHTML = name;
        element.className = "container file";

        this.bindClick(element, code);

        this.getBase().appendChild(element);
    },

    renderField: function (field, code) {
        let key = field.key;
        let value = field.value;

        let element = document.createElement("p");
        element.innerHTML = "Key: " + key + "<br>Value: " + value;
        element.className = "container field";

        this.getBase().appendChild(element);
    },

    clear: function () {
        this.getBase().innerHTML = "";
    },

    setTitle: function (title) {
        this.getTitle().innerHTML = title;
    },

    tree: function (json) {
        this.clear();

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
            }

            for (let folderName in folders) {
                let folder = folders[folderName];

                this.renderFolder(folder, folderName);
            }

            for (let fileName in files) {
                let file = files[fileName];

                this.renderFile(file, fileName);
            }
        } else {
            for (let fieldName in fields) {
                let field = fields[fieldName];

                this.renderField(field, fieldName);
            }
        }
    }
}

render.bindBack();
render.tree(vault.contents);

// const story = "Once upon a time there was a person named Colin who was writing out a bunch of code in a language" +
//     "he hasn't worked in in nearly a year. It wasn't going too well."

// const complicated = {
//     value1: hash("hello from value 1"),
//     value2: hash(hash("hello from value 2")),
//     value3: "Once upon a time there was a person named Colin who was writing out a bunch of code in a language" +
//         "he hasn't worked in in nearly a year. It wasn't going too well.",
//     value4: "Once upon a time there was a person named Colin who was writing out a bunch of code in a language" +
//         "he hasn't worked in in nearly a year. It wasn't going too well.",
//     value5: story
// }

// const e = lzw.encode(story);
// const d = lzw.decode(story);

// console.log(e);
// console.log(d);

// const sealed = vault.sealVault(complicated, story);
// const unsealed = vault.unsealVault(sealed.cipher, story);

// console.log(sealed);
// console.log(unsealed);

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
