<script>
  import { Alert } from "flowbite-svelte";
  import { APP_STATUS, appStatus } from "../store.ts";
  import StepUpload from "./StepUpload.svelte";
  import StepLoading from "./StepLoading.svelte";
  import StepLoaded from "./StepLoaded.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.LOADED}
  <StepLoaded />
  <Alert>
    <span class="font-medium">¡Carga exitosa!</span>
    La imagen ha sido cargada exitosamente.
  </Alert>
{:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <span class="font-medium">Error alert!</span>
    Hay un error en la aplicación.
  </Alert>
{:else}
  <Alert>
    <span class="font-medium">Algo malo ha pasado!</span>
    Este estado de la aplicación no está reconocido.
  </Alert>
{/if}
