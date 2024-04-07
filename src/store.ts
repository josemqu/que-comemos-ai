import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: -1,
};

const envMode =
  import.meta.env.ENV_MODE ?? window.location.hostname === "localhost"
    ? "development"
    : "production";

const initialStatus =
  envMode === "development" ? APP_STATUS.INIT : APP_STATUS.INIT;

export const appStatus = writable(initialStatus);
export const appStatusInfo = writable({
  id: "88632685d41375f2ccb15817d5b2bff0",
  img_url:
    "https://res.cloudinary.com/djqrrlwav/image/upload/v1712425251/images/jbedvztwq9t4bbuhtpcp.webp",
  text: "El contenido glucémico total estimado de este plato depende de los diferentes componentes presentes. El plato incluye una porción de arroz con vegetales, una ensalada de lechuga y tomates cherry, así como algunas legumbres como lentillas. En general, los carbohidratos de este plato provienen principalmente de los cereales (arroz) y las legumbres, los cuales tienen un índice glucémico moderado. La presencia de vegetales frescos, como la lechuga y los tomates, aportan fibra y compuestos que ayudan a moderar la respuesta glucémica. Por lo tanto, este plato podría considerarse de índice glucémico moderado.",
  envMode: envMode,
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
