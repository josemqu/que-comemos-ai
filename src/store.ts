import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({
  id: "2df1b31e655d73f66f65d87258c96574",
  img_url:
    "https://res.cloudinary.com/djqrrlwav/image/upload/v1711654275/images/xmt7mvna5ipcizcjr7dw.webp",
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
