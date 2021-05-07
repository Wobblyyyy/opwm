// noinspection JSUnfilteredForInLoop, UnnecessaryLocalVariableJS, JSUnresolvedVariable

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
        name: "Vault",
        fields: {}
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
    folderCreate: "addFolder",
    fileCreate: "addFile",
    fieldCreate: "addField",
    path: [],

    tracePath: function (json) {
        if (this.path.length === 0) return json;

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

    getFolderCreate: function () {
        return document.getElementById(this.folderCreate);
    },

    getFileCreate: function () {
        return document.getElementById(this.fileCreate);
    },

    getFieldCreate: function () {
        return document.getElementById(this.fieldCreate)
    },

    panel: function (clicks) {
        let panel = document.createElement("div");

        let edit = document.createElement("button");
        let rename = document.createElement("button");

        edit.innerHTML = '<i class=\"far fa-edit\"></i>';
        rename.innerHTML = '<i class=\"fab fa-amilia\"></i>';

        edit.onclick = function () {
            clicks.edit();
        }
        rename.onclick = function () {
            clicks.rename();
        }

        edit.className = "transparentButton";
        rename.className = "transparentButton";

        panel.className = "panel";

        panel.appendChild(edit);
        panel.appendChild(rename);

        return panel;
    },

    bindBack: function () {
        let button = this.getBack();

        button.onclick = function () {
            render.goBack();
        }
    },

    bindFolderCreate: function () {
        let button = this.getFolderCreate();

        button.onclick = function () {
            swal("Create a new folder", {
                content: "input",
                icon: "info"
            }).then((value) => {
                if (value == null) return;

                if (value.length === 0) {
                    button.click();
                } else {
                    let id = random.eightCharId();

                    render.addFolder({
                        fieldId: id,
                        name: value
                    });

                    swal(
                        `Created folder "${value}" with ID ${id}`,
                        {
                            buttons: {
                                open: {
                                    text: "Open it",
                                    value: "open"
                                },
                                dismiss: {
                                    text: "Dismiss",
                                    value: "dismiss"
                                }
                            }
                        }
                    ).then((finish) => {
                        switch (finish) {
                            case "open": {
                                render.click(id);
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    });
                }
            });
        }
    },

    bindFileCreate: function () {
        let button = this.getFileCreate();

        button.onclick = function () {
            swal(
                "Create a new file", {
                    content: "input",
                    icon: "info"
                }
            ).then((value) => {
                if (value == null) return;

                if (value.length === 0) {
                    button.click();
                } else {
                    let id = random.eightCharId();

                    render.addFile({
                        fieldId: id,
                        name: value
                    });

                    swal(
                        `Created file "${value}" with ID ${id}`,
                        {
                            buttons: {
                                open: {
                                    text: "Open it",
                                    value: "open"
                                },
                                dismiss: {
                                    text: "Dismiss",
                                    value: "dismiss"
                                }
                            }
                        }
                    ).then((finish) => {
                        switch (finish) {
                            case "open": {
                                render.click(id);
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    });
                }
            });
        }
    },

    bindFieldCreate: function () {

    },

    bindButtons: function () {
        this.bindBack();
        this.bindFolderCreate();
        this.bindFileCreate();
        // this.bindFieldCreate();
    },

    add: function (json, field) {
        if (json.hasOwnProperty("fields")) {
            json.fields[field.id] = field.contents;
        } else {
            json[field.id] = field.contents;
        }

        this.rerender();
    },

    addFolder: function (details) {
        this.add(
            this.tracePath(vault.contents),
            {
                id: details.fieldId,
                contents: {
                    isFolder: true,
                    name: details.name,
                    fields: {}
                }
            }
        )
    },

    addFile: function (details) {
        this.add(
            this.tracePath(vault.contents),
            {
                id: details.fieldId,
                contents: {
                    isFolder: false,
                    name: details.name,
                    fields: {}
                }
            }
        )
    },

    renderFolder: function (folder, code) {
        let name = folder.name;

        let element = document.createElement("p");
        element.innerHTML = '<i class="far fa-folder"></i>' + name;
        element.className = "container folder";

        this.bindClick(element, code);

        element.appendChild(
            this.panel({
                edit: function () {
                    alert("EDIT");
                },
                rename: function () {
                    alert("RENAME");
                }
            })
        );

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

    setTitle: function () {
        let path = this.path.filter(v => v !== "fields");
        path.unshift("Vault");
        this.getTitle().innerHTML = path.join("/");
    },

    tree: function (json) {
        if (!json.hasOwnProperty("fields")) {
            if (this.path[this.path.length - 1] === "fields") {
                this.path.pop();
            }

            json = this.tracePath(vault.contents);
        }

        if (json.isFolder) {
            this.getFolderCreate().className = "navButton";
            this.getFileCreate().className = "navButton";
            // this.getFieldCreate().className = "navButton";
        } else {
            this.getFolderCreate().className = "hidden";
            this.getFileCreate().className = "hidden";
            // this.getFieldCreate().className = "navButton";
        }

        if (json.name === "Vault") {
            this.getBack().className = "hidden";
        } else {
            this.getBack().className = "navButton";
        }

        this.clear();

        let fields = json.fields;

        this.setTitle();

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

render.bindButtons();
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
