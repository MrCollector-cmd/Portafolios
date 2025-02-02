import { Sphere3D } from "./Sphere.js";
import { text } from "./config.js";

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");

const settingsAnimate = {
    animateIni: false,
    animateWriting: true,
    localWrite:true,
    text: text,
    opacity:0,
    index: 0,
    radMax: { sphere1: 190, sphere2: 100 },
    growthSpeed: 6,
    spheres: {
        sphere1: new Sphere3D(canvas.width / 2, canvas.height / 2, 50, { light: true, volumLight: 0.3, quantity: 200 }, { factorX: 0.001, factorY: 0.001 }),
        sphere2: new Sphere3D(canvas.width / 2, canvas.height / 2, 50, { color: "red", light: true, reverse: true, quantity: 200 }, { factorX: 0.01, factorY: 0.01, factorZ: 0.01 })
    },
    lastWriteTime: 0,
    lastBlinkTime: 0,
    showCursor: false,
    cursorBlinking: false,
    updateSize: function () {
        Object.values(this.spheres).forEach(sphere => {
            sphere.x = canvas.width / 2;
            sphere.y = canvas.height / 2;
        });
    },
    iniWriting: function () {
        if (canvas.width < 500) {
            ctx.font = "15px 'Press Start 2P'";
        } else {
            ctx.font = "20px 'Press Start 2P'";
        }
        ctx.fillStyle = "#31c272";
        
        if (settingsAnimate.localWrite) {
            // Escribir el texto hasta el índice actual
            let cursor = settingsAnimate.showCursor ? "_" : "";
            ctx.fillText(settingsAnimate.text.substring(0, settingsAnimate.index) + cursor, 20, 100);
            
            // Aumentar el índice para escribir el siguiente carácter
            if (settingsAnimate.index < settingsAnimate.text.length) {
                settingsAnimate.index++;
                settingsAnimate.lastWriteTime = Date.now(); // Registrar el momento de la última escritura
            } else {
                // Terminar la escritura y comenzar el parpadeo del cursor
                if (!settingsAnimate.cursorBlinking) {
                    settingsAnimate.cursorBlinking = true;
                    settingsAnimate.lastBlinkTime = Date.now(); // Iniciar el parpadeo del cursor
                }
            }
        } else if (!settingsAnimate.localWrite && settingsAnimate.index > 0) {
            // Si estamos en el proceso de borrado, disminuir el índice y borrar la última letra
            let cursor = settingsAnimate.showCursor ? "_" : "";
            ctx.fillText(settingsAnimate.text.substring(0, settingsAnimate.index) + cursor, 20, 100);
            settingsAnimate.index--;  // Disminuir el índice para borrar el texto
            settingsAnimate.lastWriteTime = Date.now(); // Registrar el momento de la última eliminación
        }
    
        // Borrar el texto después de 2 segundos
        if (Date.now() - settingsAnimate.lastWriteTime > 2000) {
            console.log("Borrando");
            settingsAnimate.localWrite = false
            if (settingsAnimate.index > 0) {
                settingsAnimate.index--;  // Disminuir el índice para borrar el texto
                settingsAnimate.lastWriteTime = Date.now(); // Registrar el momento de la última eliminación
            } else {
                // Cuando se haya borrado completamente el texto, iniciar la animación de las esferas
                if (!settingsAnimate.animateIni) {
                    settingsAnimate.animateWriting = false; // Desactiva la escritura
                    settingsAnimate.cursorBlinking = false; // Detener el parpadeo del cursor
                    settingsAnimate.animateIni = true; // Inicia la animación de las esferas
                }
            }
        }
    },
    
    blinkCursor: function () {
        if (!settingsAnimate.cursorBlinking) return;
    
        // Alternar el cursor cada 500ms
        if (Date.now() - settingsAnimate.lastBlinkTime > 300) {
            settingsAnimate.showCursor = !settingsAnimate.showCursor; // Alternar estado del cursor
            settingsAnimate.lastBlinkTime = Date.now(); // Registrar el tiempo del último parpadeo
        }
    
        // Redibuja el texto con el cursor parpadeante
        ctx.fillText(settingsAnimate.text.substring(0, settingsAnimate.index) + (settingsAnimate.showCursor ? "_" : ""), 20, 100);
    }
    
};

export {settingsAnimate}