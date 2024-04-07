<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store";
  const { id, img_url, text, envMode } = $appStatusInfo;

  let answer = "";
  let tokens = 0;
  let loading = false;

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

        if (incomingData.type === "text") answer += incomingData.data;
        if (incomingData.type === "usage") tokens = incomingData.data;
      };
    } catch (error) {
      setAppStatusError();
    } finally {
      // loading = false;
    }
  };
</script>

<div class="flex align-middle justify-center w-full sm:m-4 m-2 px-4 max-h-60">
  <a href={img_url} target="_blank" rel="noopener noreferrer">
    <img
      src={img_url}
      alt="Image of food"
      class="rounded h-full aspect-[16/9] sm:aspect-[4/3] object-cover"
      aria-hidden="true"
    />
  </a>
</div>

<form class="max-w-80 w-full mx-4 px-4" on:submit={handleSubmit}>
  <Label for="question" class="font-medium block my-2">
    Pregunta lo que quieras saber...
  </Label>
  <div class="flex justify-between align-middle">
    <Input
      id="question"
      class=""
      required
      placeholder="¿Cuántas calorías tiene el plato?"
    ></Input>
    <button
      type="submit"
      class="ml-2 w-12 h-10 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-2 transition-all duration-400 ease-in-out"
    >
      <!-- flecha -->
      <svg
        class="w-6 h-6 inline-block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M9 5l7 7-7 7"
        ></path>
      </svg></button
    >
  </div>
</form>

{#if loading}
  <div class="mt-4 flex justify-center items-center flex-col gap-y-2">
    <Spinner color="blue" />
  </div>
{/if}

{#if answer}
  <div class="p-4 w-full">
    <div class="flex align-middle justify-between">
      <span
        class="text-sm rtl:text-right text-gray-900 dark:text-gray-300 font-medium block my-2"
      >
        Respuesta:
      </span>
      <span
        class="text-sm rtl:text-right text-gray-400 dark:text-gray-900 block my-2"
      >
        Tokens: {tokens.input_tokens} (entrada) {tokens.output_tokens} (salida)
      </span>
    </div>
    <p class="text-sm text-gray-900">
      {answer}
    </p>
  </div>
{:else if envMode !== "production" && envMode === "development"}
  <div class="px-4 mt-4">
    <div class="flex align-middle justify-between">
      <span
        class="text-sm rtl:text-right text-gray-900 dark:text-gray-300 font-medium block my-2"
      >
        Respuesta de ejemplo:
      </span>
      <span
        class="text-sm rtl:text-right text-gray-400 dark:text-gray-900 block my-2"
      >
        Tokens: 0 (entrada) 0 (salida)
      </span>
    </div>
    <p class="text-sm text-gray-400">
      {text}
    </p>
  </div>
{/if}
