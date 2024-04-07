<script>
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusLoaded,
  } from "../store.ts";

  let files = {
    accepted: [],
    rejected: [],
  };

  let videoSource = null;
  let loading = false;
  const getVideoCamera = async () => {
    try {
      loading = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoSource.srcObject = stream;
      videoSource.play();
      loading = false;
    } catch (error) {
      console.error(error);
    }
  };

  async function handleFilesSelect(e) {
    console.log(e);
    const { acceptedFiles, fileRejections } = e.detail;

    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    if (acceptedFiles.length > 0) {
      setAppStatusLoading();

      const formData = new FormData();

      formData.append("file", acceptedFiles[0]);

      const res = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setAppStatusError();
      }

      const { id, img_url } = await res.json();

      const img_url_resized = img_url.replace(
        "/upload/",
        "/upload/w_320,h_320,c_fill/"
      );

      console.log({ id, img_url_resized });

      setAppStatusLoaded({ id, img_url: img_url_resized });
    }
  }

  async function handleImageSelect(e) {
    console.log(e);
    const { files } = e.target;

    if (files.length > 0) {
      setAppStatusLoading();

      const formData = new FormData();

      formData.append("file", files[0]);

      const res = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setAppStatusError();
      }

      const { id, img_url } = await res.json();

      // convert 'https://res.cloudinary.com/demo/image/upload/balloons.jpg' to 'https://res.cloudinary.com/demo/image/upload/w_512,h_512,c_fill/balloons.jpg'
      const img_url_resized = img_url.replace(
        "/upload/",
        "/upload/w_320,h_320,c_fill/"
      );

      console.log({ id, img_url_resized });

      setAppStatusLoaded({ id, img_url: img_url_resized });
    }
  }

  async function handleImageUpload(e) {
    const input = document.querySelector("input[type=file]");
    input.click();
  }
</script>

{#if files.accepted.length === 0}
  <div class="flex justify-center items-center flex-col mt-4">
    <button
      class="flex items-center text-slate-400 p-4 h-20 bg-slate-50 border-dashed border-slate-200 border-2 rounded cursor-pointer"
      on:click={handleImageUpload}
    >
      Cargá la foto de tu comida acá!
    </button>
    <input
      class="hidden"
      type="file"
      accept="image/*"
      capture="camera"
      multiple="false"
      on:change={handleImageSelect}
    />
  </div>
{/if}

<ul>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ul>
