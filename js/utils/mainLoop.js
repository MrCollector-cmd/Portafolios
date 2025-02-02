import { settingsAnimate } from "./settingsAnimate.js";
import { honeycomb } from "./honeycomb.js";
const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");
const view = document.getElementById("viewInf");
const body = document.body;

// Función para actualizar el tamaño del canvas
const updateCanvasSize = () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        settingsAnimate.updateSize();
        // honeycomb.insertWeb()
    }
};

const mainLoop = {
    idEjecute: null,
    targetFPS: 30,
    lastTime: 0,

    iterator(timestamp) {
        if (timestamp - this.lastTime >= 1000 / this.targetFPS) {
            this.refresh();
            this.draw();
            this.lastTime = timestamp;
        }
        this.idEjecute = requestAnimationFrame(this.iterator.bind(this));
    },

    refresh() {
        updateCanvasSize(); // Actualizamos el tamaño del canvas si es necesario

        if (settingsAnimate.animateIni) {
            let animationComplete = true;
            Object.entries(settingsAnimate.spheres).forEach(([key, sphere]) => {
                if (sphere.rad < settingsAnimate.radMax[key]) {
                    sphere.rad = Math.min(sphere.rad + settingsAnimate.growthSpeed, settingsAnimate.radMax[key]);
                    sphere.adjustDistanceOnRadiusChange(sphere.rad);
                    animationComplete = false;
                }
            });
            if (animationComplete) {
                settingsAnimate.animateIni = false;
                body.style.overflow = "auto";
            }
        }
        if(settingsAnimate.opacity < 1 && !settingsAnimate.animateIni && !settingsAnimate.animateWriting){
            settingsAnimate.opacity += 0.1
            view.style.opacity = settingsAnimate.opacity;
        }

        Object.values(settingsAnimate.spheres).forEach(sphere => sphere.updateRotation());
    },

    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ejecutar la escritura y el parpadeo del cursor
        if (settingsAnimate.animateWriting && !settingsAnimate.animateIni) {
            settingsAnimate.iniWriting();
        }

        if (settingsAnimate.cursorBlinking) {
            settingsAnimate.blinkCursor();
        }

        // Dibuja las esferas después de la escritura
        if (!settingsAnimate.animateWriting) {
            Object.values(settingsAnimate.spheres).forEach(sphere => sphere.drawSphere(ctx));
        }
    }
};

export { mainLoop };
