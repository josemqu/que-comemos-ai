<script>
  import ImageResize from "image-resize";
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusLoaded,
  } from "../store.ts";

  let files = {
    accepted: [],
    rejected: [],
  };

  let loading = false;

  const imageResize = new ImageResize({
    width: 512,
    format: "jpg",
    quality: 0.5,
  });

  async function handleImageSelect(e) {
    try {
      const file = e.target.files[0];

      if (file && file.type.includes("image")) setAppStatusLoading();

      let resizedImage = await imageResize.play(file);

      const newImage = new File([resizedImage], file.name, {
        type: "image/jpeg",
      });

      loading = true;

      const formData = new FormData();
      formData.append("file", newImage);

      const res = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setAppStatusError();
      } else {
        console.log("Image uploaded successfully");
        loading = false;

        const { id, img_url } = await res.json();

        const img_url_resized = img_url.replace(
          "/upload/",
          "/upload/w_512,c_fill/"
        );

        setAppStatusLoaded({ id, img_url: img_url_resized });
      }
    } catch (error) {
      console.error(error);
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
