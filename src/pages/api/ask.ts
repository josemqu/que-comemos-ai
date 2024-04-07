import { type APIRoute } from "astro";
import { responseSSE } from "../../utils/sse";
import { openaiResponse } from "../../utils/openai";
import { anthropicResponse, imageToBase64 } from "../../utils/anthropic";

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

  const img_data = await imageToBase64(img_url);

  return responseSSE({ request }, async (sendEvent) => {
    try {
      const response = await anthropicResponse(img_data, question);

      for await (const part of response) {
        if (part.type === "content_block_delta") {
          sendEvent({ type: "text", data: part.delta.text });
        } else if (part.type === "message_start") {
          sendEvent({ type: "usage", data: part.message.usage });
        }
      }
    } catch (error) {
      console.error(error);
      sendEvent({ type: "error", data: error });
    }

    sendEvent("__END__");
  });
};
