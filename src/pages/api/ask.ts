import { type APIRoute } from "astro";
import { responseSSE } from "../../utils/sse";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_KEY,
});

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const img_url = url.searchParams.get("img_url");
  const id = url.searchParams.get("id");
  const question = url.searchParams.get("question");

  if (!id)
    return new Response(JSON.stringify({ message: "No id provided" }), {
      status: 400,
    });

  if (!question)
    return new Response(JSON.stringify({ message: "No question provided" }), {
      status: 400,
    });

  return responseSSE({ request }, async (sendEvent) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Eres un especialista en nutrición español y eres capaz de listar todos los ingredientes de un plato de comida con sólo observar una foto del mismo, que te será proporcionada. Puedes determinar la cantidad de cada ingrediente y calcular el contenido nutricional de cada uno en forma clara y concisa.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${question} En la primera oración, debes proporcionar el contenido total estimado del plato de lo solicitado en la consulta.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `${img_url}`,
              },
            },
          ],
        },
      ],
    });

    for await (const part of response) {
      sendEvent(part.choices[0].delta.content);
    }

    sendEvent("__END__");
  });
};
