const multivault = {
    vaults: [
        // vault info goes here
        // { name, code }
    ],

    decode: function (vaultDetails) {
        let code = vaultDetails.code;
        let password = vaultDetails.password;
        let encrypted = localStorage.getItem(code);
        if (encrypted !== null && encrypted.length > 0) {
            storage.setCurrentVaultCode(code);
            storage.setPassword(password);
            localStorage.setItem("vault_data", encrypted);
            window.location.href = "vault.html";
        } else {
            this.ui.promptEncrypted(code, password);
        }
    },

    loadVaults: function () {
        let vaultString = localStorage.getItem("vaults");

        if (vaultString !== null && vaultString.length > 0) {
            this.vaults = stringJson.to(vaultString);
        }

        let view = document.getElementById("renderView");

        for (let vault of this.vaults) {
            let button = document.createElement("button");
            button.innerHTML = vault.name;
            button.onclick = function () {
                localStorage.setItem("vault_current_code", vault.code);
                multivault.ui.promptPassword(vault.code);
            }
            view.appendChild(button);
        }
    },

    saveVaults: function () {
        let string = stringJson.from(this.vaults);

        localStorage.setItem("vaults", string);
    },

    addVault: function (name, code) {
        this.vaults.push({
            name: name,
            code: code
        });

        this.saveVaults();
    },

    ui: {
        promptPassword: function (vaultCode) {
            let input = document.createElement("input");

            input.className = "swal-content__input";
            input.type = "password";
            input.placeholder = "Vault password...";

            swal({
                title: "Enter this vault's password",
                content: input
            }).then((result) => {
                switch (result) {
                    case true:
                    case false: {
                        multivault.decode({
                            code: vaultCode,
                            password: input.value
                        });
                        break;
                    }

                    default: {
                        break;
                    }
                }
            });
        },

        promptEncrypted: function (vaultCode, password) {
            let input = document.createElement("input");

            input.className = "swal-content__input";
            input.type = "text";
            input.placeholder = "Encrypted vault data...";

            swal({
                title: "Enter the vault's encrypted data",
                text: "We didn't find any vaults with that vault code. " +
                    "If you have the vault's raw encrypted data, paste it " +
                    "here and we'll save it for you.",
                content: input
            }).then((result) => {
                switch (result) {
                    case true:
                    case false: {
                        localStorage.setItem(
                            vaultCode,
                            input.value
                        );
                        if (password !== null) {
                            multivault.decode({
                                code: vaultCode,
                                password: password
                            });
                        }
                        break;
                    }

                    default: {
                        break;
                    }
                }
            });
        }
    },

    bindImport: function () {
        let button = document.getElementById("import");

        button.onclick = function () {
            let input = document.createElement("input");

            input.className = "swal-content__input";
            input.type = "text";
            input.placeholder = "Vault name...";

            swal({
                title: "Enter the vault's name",
                text: "This name is used in generating your vault's code. You will have the option to rename " +
                    "your vault later on.",
                content: input
            }).then((result) => {
               switch (result) {
                   case true:
                   case false: {
                       multivault.ui.promptEncrypted(hash(input.value));
                       break;
                   }

                   default: {
                       break;
                   }
               }
            });
        }
    },

    bindAdd: function () {
        let button = document.getElementById("add");

        button.onclick = function () {
            let inputs = document.createElement("div");

            let inputName = document.createElement("input");
            let spacer = document.createElement("br");
            let inputPassword = document.createElement("input");
            let security = document.createElement("p");

            inputName.type = "text";
            inputPassword.type = "password";

            inputName.className = "swal-content__input";
            inputPassword.className = "swal-content__input";

            inputName.placeholder = "What's your vault's name?";
            inputPassword.placeholder = "And how about a super-secure password?";

            inputs.appendChild(inputName);
            inputs.appendChild(spacer);
            inputs.appendChild(inputPassword);
            inputs.appendChild(security);

            const sec = function () {
                security.innerHTML = `Your security level: ${passwords.securityLevel(inputPassword.value)}`;
            }

            sec();

            inputPassword.addEventListener("keyup", sec);

            swal({
                title: "Create a new vault",
                text: "Exciting, right? Make sure to choose a password you'll remember. The data inside of " +
                    "your vault can not ever be recovered without your password.",
                content: inputs
            }).then((result) => {
                switch (result) {
                    case true:
                    case false: {
                        let name = inputName.value;
                        let password = inputPassword.value;

                        if (name.length < 1 || password.length < 1) {
                            button.click();
                            break;
                        } else {
                            let code = hash(name);
                            storage.setPassword(password);
                            storage.setCurrentVaultCode(code);
                            storage.save();
                            storage.setPassword(password);
                            storage.setCurrentVaultCode(code);
                            multivault.addVault(name, code);
                            localStorage.setItem(code, localStorage.getItem(storage.data));
                            multivault.saveVaults();
                            window.location.href = "vault.html";
                        }

                        break;
                    }

                    default: {
                        break;
                    }
                }
            });
        }
    },

    bindNav: function () {
        this.bindImport();
        this.bindAdd()
    }
}

multivault.bindNav();
multivault.loadVaults();
