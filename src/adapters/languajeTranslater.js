import translate from "translate-google";

export default async function translateText(text, language) {
  try {
    const translatedText = await translate(text, {
      to: language,
    });
    return translatedText;
  } catch (error) {
    console.log(error);
  }
}
