<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store";
  const { id, img_url } = $appStatusInfo;

  console.log(img_url);

  let answer = "";
  let loading = false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    loading = true;

    const question = e.target.question.value;

    const searchParams = new URLSearchParams();
    searchParams.append("id", id);
    searchParams.append("img_url", img_url);
    searchParams.append("question", question);

    try {
      const eventSource = new EventSource(
        `/api/ask?${searchParams.toString()}`
      );

      eventSource.onmessage = (event) => {
        loading = false;

        const incomingData = JSON.parse(event.data || {});

        if (incomingData === "__END__") {
          eventSource.close();
          return;
        }

        answer += incomingData;
      };
    } catch (error) {
      setAppStatusError();
    } finally {
      loading = false;
    }
  };
</script>

<div class="flex justify-center align-middle">
  <img
    src={img_url}
    alt="Image of food"
    class="rounded max-w-[400px] h-auto aspect-[4/3] object-cover"
    aria-hidden="true"
  />
</div>

<form class="m-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">
    Pregunta lo que quieras saber...
  </Label>
  <Input id="question" placeholder="¿Cuántas calorías tiene el plato?"></Input>
</form>

{#if loading}
  <Spinner class="mt-4"></Spinner>
{/if}

{#if answer}
  <p class="my-4">{answer}</p>
{/if}
