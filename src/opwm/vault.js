// noinspection JSUnfilteredForInLoop, UnnecessaryLocalVariableJS, JSUnresolvedVariable

window.addEventListener("load", function (e) {
    storage.load();
});

window.addEventListener("unload", function (e) {
    storage.save();
});

render.bindButtons();
render.tree(vault.contents);
