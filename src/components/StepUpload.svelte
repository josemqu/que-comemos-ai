<script>
  import {
    setAppStatusLoading,
    setAppStatusError,
    setAppStatusLoaded,
  } from "../store.ts";
  import Dropzone from "svelte-file-dropzone";

  let files = {
    accepted: [],
    rejected: [],
  };

  async function handleFilesSelect(e) {
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
      setAppStatusLoaded({ id, img_url });
    }
  }
</script>

{#if files.accepted.length === 0}
  <Dropzone accept="image/*" multiple={false} on:drop={handleFilesSelect}
    >Arrastra y suelta una foto aquí
  </Dropzone>
{/if}

<ul>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ul>
