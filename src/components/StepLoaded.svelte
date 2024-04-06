<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store";
  const { id, img_url, text, envMode } = $appStatusInfo;

  let answer = "";
  let loading = false;

  console.log({ envMode });

  const handleSubmit = async (e) => {
    e.preventDefault();

    loading = true;
    answer = "";
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
        // console.log(answer);
      };
    } catch (error) {
      setAppStatusError();
    } finally {
      // loading = false;
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

<form class="max-w-80 w-full mx-4 px-4" on:submit={handleSubmit}>
  <Label for="question" class="font-medium block my-2">
    Pregunta lo que quieras saber...
  </Label>
  <Input
    id="question"
    class=""
    required
    placeholder="¿Cuántas calorías tiene el plato?"
  ></Input>
</form>

{#if loading}
  <div class="mt-4 flex justify-center items-center flex-col gap-y-2">
    <Spinner />
  </div>
{/if}

{#if answer}
  <div class="px-4 w-full">
    <p
      class="text-sm rtl:text-right text-gray-900 dark:text-gray-300 font-medium block my-2"
    >
      Respuesta:
    </p>
    <p class="text-sm text-gray-900">
      {answer}
    </p>
  </div>
{:else if envMode !== "production" && envMode === "development"}
  <div class="px-4">
    <p
      class="text-sm rtl:text-right text-gray-900 dark:text-gray-300 font-medium block my-2"
    >
      Respuesta de ejemplo:
    </p>
    <p class="text-sm text-gray-400">
      {text}
    </p>
  </div>
{/if}
