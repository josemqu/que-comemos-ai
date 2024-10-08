import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: -1,
};

const initialStatus = APP_STATUS.INIT;

export const appStatus = writable(initialStatus);
export const appStatusInfo = writable({
  id: "d209bc3ddd757dae369614717dc384c3",
  img_url:
    "https://res.cloudinary.com/djqrrlwav/image/upload/v1724117726/images/food/srev2m1pq4mqm3byjzir.jpg",
  //"https://res.cloudinary.com/djqrrlwav/image/upload/v1724157923/images/food/matuhqwwnhzl3m4eextb.jpg",
  //"https://res.cloudinary.com/djqrrlwav/image/upload/v1724861622/images/food/gw6zane6gy1555xdnagx.jpg",
  //"https://res.cloudinary.com/djqrrlwav/image/upload/w_320,h_320,c_fill/v1712458705/images/rimoxl5utpjz9kk22bnt.jpg",
  text: "El plato presentado contiene alimentos con un bajo contenido glucémico, como las verduras (zucchini, tomates, lechuga) y el salmón. Aunque el maíz dulce tiene un contenido glucémico más alto, la cantidad en el plato es relativamente pequeña en comparación con los demás componentes. Por lo tanto, el contenido glucémico total estimado del plato es bajo.",
  envMode: "production",
});

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setAppStatusLoaded = ({
  id,
  img_url,
  text,
  envMode,
}: {
  id: string;
  img_url: string;
  text: string;
  envMode: string;
}) => {
  appStatus.set(APP_STATUS.LOADED);
  appStatusInfo.set({ id, img_url, text, envMode });
};
