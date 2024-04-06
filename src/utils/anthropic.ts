import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_KEY });

export const imageToBase64 = async (image_url: string) => {
  const image_array_buffer = await (await fetch(image_url)).arrayBuffer();
  return Buffer.from(image_array_buffer).toString("base64");
};

export const anthropicResponse = async (img_data: string, question: string) => {
  const response = await anthropic.messages
    .stream({
      model: "claude-3-haiku-20240307", //"claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/webp",
                data: `${img_data}`,
              },
            },
            {
              type: "text",
              text: `${question} En la primera oración, debes proporcionar el contenido total estimado del plato de lo solicitado en la consulta.`,
            },
          ],
        },
      ],
    })
    .on("text", (text: any) => text);

  // console.log(response);

  return response;
};
