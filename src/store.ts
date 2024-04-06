import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.LOADED);
export const appStatusInfo = writable({
  id: "88632685d41375f2ccb15817d5b2bff0",
  img_url:
    "https://res.cloudinary.com/djqrrlwav/image/upload/v1712425251/images/jbedvztwq9t4bbuhtpcp.webp",
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
}: {
  id: string;
  img_url: string;
}) => {
  appStatus.set(APP_STATUS.LOADED);
  appStatusInfo.set({ id, img_url });
};
