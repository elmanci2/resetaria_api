import * as cheerio from "cheerio";
import cloudscraper from "cloudscraper";
import { BASE_URL, ingredientsWithEmojis } from "../util/url.js";
import translate from "translate-google";
import natural from "natural";

const tokenizer = new natural.WordTokenizer();

export const getRecipe = async (id, language) => {
  try {
    const body = await cloudscraper(`${BASE_URL}/${id}`, {
      method: "GET",
    });
    const $ = cheerio?.load(body);

    const image = $(".recipe-img > figure > img");
    let imageUrl = image.attr("data-src"); // URL de la imagen con menor calidad por defecto

    if (image.attr("data-srcset")) {
      // Extraer las URLs y resoluciones de las imágenes disponibles
      const sources = image.attr("data-srcset").split(", ");
      const urlsAndResolutions = sources.map((source) => {
        const [url, resolution] = source.split(" ");
        return {
          url,
          resolution: parseInt(resolution),
        };
      });

      // Encontrar la URL de la imagen con mayor resolución
      const maxResolution = Math.max(
        ...urlsAndResolutions.map((ur) => ur.resolution)
      );
      imageUrl =
        urlsAndResolutions.find((ur) => ur.resolution === maxResolution)?.url ||
        imageUrl;
    }

    const regex = /\bhttps?:\/\/\S+\.mp4\b/g;
    const video = $("body ")
      ?.html()
      .match(regex)
      ?.find((u) => regex.test(u));

    const title = $(".recipe-title")?.text()?.trim();

    const preview = $(".recipe-entradilla")?.text()?.trim();

    const history = $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-intro-info > div.txt.summary.ad-mobile-top > div"
    )
      .text()
      ?.trim();

    const ingredients = [];

    $(".recipe-ingredients-table > ul > li")?.each((i, el) => {
      const ingredientText = $(el)?.text()?.trim();
      const ingredientWords = ingredientText.split(/\s+/); // separar en palabras
      let ingredientName = ingredientText;
      let ingredientEmoji = "";

      let bestMatch = null;
      let bestMatchCount = 0;

      // buscar la mejor coincidencia
      for (const [ingredient, emoji] of Object.entries(ingredientsWithEmojis)) {
        let count = 0;

        for (const word of ingredientWords) {
          if (ingredient.toLowerCase().includes(word.toLowerCase())) {
            count++;
          }
        }

        if (count > bestMatchCount) {
          bestMatch = emoji;
          bestMatchCount = count;
        }
      }

      // agregar emoji si se encontró una coincidencia
      if (bestMatch) {
        ingredientEmoji = bestMatch;
        ingredientName = ingredientText
          .replace(new RegExp(bestMatchCount, "gi"), "")
          .trim();
      }

      ingredients.push({
        id: i + 1,
        name: ingredientName,
        emoji: ingredientEmoji,
      });
    });

    const tips = [];

    $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-ingredients-steps > div.col-md-8.step-container > div.col-xs-12.col-md-12.txt > div > ul > li"
    )?.each((i, el) => {
      const tip = $(el)?.text()?.trim();
      tips.push(tip);
    });
    const metaextra = [];

    $(".recipe-body-container > p.recipe-extra-item-title").each((i, el) => {
      const title = $(el).text().trim();
      const values = [];
      $(el)
        .nextUntil("p.recipe-extra-item-title")
        .each((i, el) => {
          const value = $(el).text().trim().replace(/●/g, "");
          if (value) {
            values.push({ item: value });
          }
        });
      metaextra.push({
        id: i + 1,
        title,
        values,
      });
    });
    const steps = [];

    $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-ingredients-steps > div.col-md-8.step-container > div:nth-child(2) > div"
    ).each((i, el) => {
      const stepElement = $(el);
      const $step = $(el);
      const $stepInfo = $step.find(".stepInfo");
      const $stepPhoto = $step.find(".step-photo");

      const slectDescription =
        $stepInfo.find("p")?.text()?.trim() === "" || ""
          ? $stepInfo?.text()?.trim()
          : $stepInfo.find("p")?.text()?.trim();

      const instruction = $stepInfo.find("h3")?.text()?.trim();

      const step = {
        instruction,
        description: slectDescription?.replace(instruction, "")?.trim(),
        imageUrl:
          $stepPhoto.find("img").attr("data-src") ||
          $stepPhoto.find("img").attr("src"),
      };

      steps.push(step);
    });

    const secret = $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-ingredients-steps > div.col-md-8.step-container > div.col-md-12.recipe-trick > p.recipe-trick-text.col-md-12"
    )
      .text()
      .trim();

    const keywords = [];
    $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-intro-info > div.recipe-related-item > a"
    )?.each((i, el) => {
      const keyword = $(el)?.text()?.trim();
      keywords.push({
        id: i + 1,
        keyword,
      });
    });

    const uploadDate = $(
      "#ctl01_ctl00_phMain_phMain_ctl00_recipePanel > div.recipe-intro-info > p > time"
    )
      ?.text()
      ?.trim();

    const metaheader = [];

    $(".recipe-metaheader-container > span")?.each((i, el) => {
      const temp = {};
      const element = $(el)?.find(".metaheader-value")?.text()?.trim();
      const title = $(el)?.find(".metaheader-title")?.text()?.trim();
      metaheader.push({
        id: i,
        title,
        element,
      });
    });

    const ratingStar = $(".rating-value > .rating-votes").text().trim();
    const ratingVotes = $(".rating-value > .rating-votes-text")
      .text()
      .trim()
      .match(/\d+/)[0];
    const ratings = [
      {
        stars: ratingStar,
        votes: ratingVotes,
      },
    ];

    const recipe = {
      video: video || null,
      image: imageUrl || null,
      title: title || null,
      preview: preview || null,
      history: history || null,
      ingredients: ingredients || null,
      tips: tips || null,
      metaextra: metaextra || null,
      steps: steps || null,
      secret: secret || null,
      keywords: keywords || null,
      uploadDate: uploadDate || null,
      metaheader: metaheader || null,
      ratings: ratings || null,
    };

    return recipe;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllRecipesApi = async (page = 1) => {
  try {
    const body = await cloudscraper(
      `${BASE_URL}/buscador/?tit=%5ba-z%5d&_page=${page}`,
      {
        method: "GET",
      }
    );

    const $ = cheerio?.load(body);
    const recipes = [];

    // find
    const findTitle = " > div.info-container.col-xs-12 > header > a > h3";
    const findPoster = " > div.image-container.col-xs-12 > a > figure > img";
    const findId = " > div.image-container.col-xs-12 > a";
    const findTime =
      "> div.info-container.col-xs-12 > div > div.element-recipe-time";
    const allElmetEach =
      "  #main > div > div.search-result > div > div > div > article ";

    const recipePromises = $(allElmetEach).map(async (i, el) => {
      /// stract iformation
      const title = $(el).find(findTitle).text()?.trim();

      const image = $(el)?.find(findPoster);
      let imageUrl = image.attr("data-src"); // URL de la imagen con menor calidad por defecto

      if (image.attr("data-srcset")) {
        // Extraer las URLs y resoluciones de las imágenes disponibles
        const sources = image.attr("data-srcset").split(", ");
        const urlsAndResolutions = sources.map((source) => {
          const [url, resolution] = source.split(" ");
          return {
            url,
            resolution: parseInt(resolution),
          };
        });

        // Encontrar la URL de la imagen con mayor resolución
        const maxResolution = Math.max(
          ...urlsAndResolutions.map((ur) => ur.resolution)
        );
        imageUrl =
          urlsAndResolutions.find((ur) => ur.resolution === maxResolution)
            ?.url || imageUrl;
      }

      const id = $(el)?.find(findId).attr("href")?.replace("/recetas/", "");
      const time = $(el)?.find(findTime)?.text()?.trim();

      const recipe = {
        id,
        title,
        image: imageUrl,
        time,
      };

      const r = await getRecipe(id);
      if (r?.uploadDate === null) {
        return null;
      }
      return {
        ...recipe,
        ...r,
      };
    });

    const recipeArray = await Promise.all(recipePromises);
    return recipeArray;
  } catch (e) {
    return {
      error: e?.massage || e,
    };
  }
};

async function translateText() {
  const text = " is a test";
  const translatedText = await translate(text, { to: "en" });
  console.log(translatedText);
}
