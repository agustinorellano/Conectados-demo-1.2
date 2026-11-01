import { useEffect, useState } from 'react';

/**
 * Escala automática de la web (/web).
 *
 * Muchas notebooks (p. ej. 1920×1080 con escala de Windows del 125–150 %) ofrecen apenas ~1280×600 px útiles
 * a zoom 100 %. El diseño se pensó para ~1900×880: en vez de pedir que se baje el zoom del navegador a mano,
 * la web aplica un zoom equivalente cuando la ventana es chica. En ventanas grandes la escala es 1 (no cambia nada).
 */
const REF_WIDTH = 1900;
const REF_HEIGHT = 880;
const MIN_ZOOM = 0.62;

export function computeWebZoom(width = window.innerWidth, height = window.innerHeight) {
  const z = Math.min(1, width / REF_WIDTH, height / REF_HEIGHT);
  return Math.max(MIN_ZOOM, Math.round(z * 100) / 100);
}

// Solo /web activa la escala; /app (móvil) y la landing no se tocan.
let enabled = false;
export function setWebZoomEnabled(value) {
  enabled = value;
}
export const getWebZoom = () => (enabled ? computeWebZoom() : 1);

/** Alto "efectivo" de la ventana: el que ve el diseño una vez aplicada la escala. */
export function useEffectiveHeight() {
  const read = () => window.innerHeight / getWebZoom();
  const [height, setHeight] = useState(read);
  useEffect(() => {
    const onResize = () => setHeight(read());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return height;
}
