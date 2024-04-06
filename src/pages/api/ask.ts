import { type APIRoute } from "astro";
import { responseSSE } from "../../utils/sse";
import { openaiResponse } from "../../utils/openai";
import { anthropicResponse } from "../../utils/anthropic";

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

  if (!img_url)
    return new Response(JSON.stringify({ message: "No img_url provided" }), {
      status: 400,
    });

  return responseSSE({ request }, async (sendEvent) => {
    const response = await anthropicResponse(img_url, question);

    for await (const part of response) {
      sendEvent(part);
    }

    sendEvent("__END__");
  });
};
