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
      system: "Respond only in Spanish.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: `${img_data}`,
              },
            },
            {
              type: "text",
              text: `${question} Evita usar frases como "no puedo determinar con exactitud los ingredientes ni las cantidades" y considera un plato de tamaño típico. Abrevia palabras largas como "aproximadamente" utilizando "aprox" ó "~". En la primera oración, debes proporcionar el contenido total estimado del plato de lo solicitado en la consulta. Si no puedes determinar algún ingrediente o su cantidad, ignora ese ingrediente. Finalmente, entrega el contenido nutricional total del plato en una tabla. Todo el texto debe estar en formato HTML. La tabla estará ubicada en un div con estilo "display: flex; align-items: center; justify-content: center; margin-top: 1rem;". Las celdas deben tener bordes colapsados de 1px y color gris claro, ancho de 50%, las celdas deben tener padding-x de 5px, y alineados a la izquierda los contenidos de las celdas y headers.`,
            },
          ],
        },
      ],
    })
    .on("text", (text: any) => text);

  return response;
};
