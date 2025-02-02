import { mainLoop } from "./utils/mainLoop.js";
// Esperamos a que la página y las fuentes se hayan cargado completamente
document.addEventListener("DOMContentLoaded", () => {
    document.fonts.ready.then(() => {
        mainLoop.iterator();
    });
});