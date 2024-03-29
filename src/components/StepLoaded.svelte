<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store";
  const { id, img_url } = $appStatusInfo;

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

<div class="flex align-middle justify-center max-w-80 m-4">
  <img
    src={img_url}
    alt="Image of food"
    class="rounded h-auto aspect-[4/3] object-cover"
    aria-hidden="true"
  />
</div>

<form class="w-full m-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2 pl-5">
    Pregunta lo que quieras saber...
  </Label>
  <Input
    id="question"
    class="ml-2"
    placeholder="¿Cuántas calorías tiene el plato?"
  ></Input>
</form>

{#if loading}
  <Spinner class="mt-4"></Spinner>
{/if}

{#if answer}
  <p class="m-4">{answer}</p>
{/if}
