import { createLogger } from "graphql-yoga";
import { recipeSchema } from "../../../../db/models/models.mongo.js";
import mongoose from "mongoose";
import { getAllRecipesApi } from "../../../../data/api/index.js";
import { emojisWidCategoris } from "../../../../data/util/emoji.js";
const Recipe = mongoose.model("Recipe", recipeSchema);
const logger = createLogger();

///  get all recipes
export const getAllRecipes = async (page = 1, limit = 50) => {
  try {
    const recipes = await Recipe.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get all recipes" });
    throw new Error("Failed to get all recipes");
  }
};

///  get recipe by id
export const getRecipe = async (id) => {
  try {
    const recipe = await Recipe.findOne({ id: id }).lean();
    return recipe;
  } catch (error) {
    logger.error({ message: "Failed to get recipe" });
    throw new Error("Failed to get recipe");
  }
};

//  get recipes by category

export const getRecipeByCategory = async (category, page = 1, limit = 50) => {
  const filter = {
    $or: [
      { "metaextra.values.item": { $regex: category, $options: "i" } },
      { "ratings.stars": { $regex: category, $options: "i" } },
    ],
  };

  try {
    const recipes = await Recipe.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get recipes by diet" });
    throw new Error("Failed to get recipes by diet");
  }
};

//  get recipes by keyword

export const getRecipesByKeyword = async (keyword, page = 1, limit = 50) => {
  try {
    const recipes = await Recipe.find({ "keywords.keyword": keyword })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get recipes by keyword" });
    throw new Error("Failed to get recipes by keyword");
  }
};

///  get by meta info

export const getRecipeByMetaInfo = async (metaInfo, page = 1, limit = 50) => {
  try {
    const recipes = await Recipe.find({ "metaheader.element": metaInfo })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get recipes by meta info" });
    throw new Error("Failed to get recipes by meta info");
  }
};

/// search recipes by title and description and meta info and kyewords

export const getRecipeBySearch = async (
  search,
  filters = {
    dietas: ["vegertariana"],
    dificulta: ["facil"],
    tecnica: ["horno"],
  },
  page = 1,
  limit = 50
) => {
  const filter = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { id: { $regex: search, $options: "i" } },
      { "metaextra.values.item": { $regex: search, $options: "i" } },
      { "metaheader.element": { $regex: search, $options: "i" } },
      { "keywords.keyword": { $regex: search, $options: "i" } },
      { "ingredients.name": { $regex: search, $options: "i" } },
      { "steps.description": { $regex: search, $options: "i" } },
    ],
  };

  try {
    const recipes = await Recipe.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get recipes by search" });
    throw new Error("Failed to get recipes by search");
  }
};

// recomended recipes

export const getRecomendedRecipes = async (page = 1, limit = 50) => {
  try {
    const recipes = await Recipe.find({
      "metaextra.values.item": "Recomendada",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return recipes;
  } catch (error) {
    logger.error({ message: "Failed to get recomended recipes" });
    throw new Error("Failed to get recomended recipes");
  }
};

export const getReipeCategories = async () => {
  try {
    const categories = await Recipe.distinct("keywords.keyword");
    const removeRepeat = new Set(categories);

    const addEmoji = [...removeRepeat].map((category) => {
      const emojiObject = emojisWidCategoris.find(
        (obj) => Object.keys(obj)[0] === category
      );
      const emoji = emojiObject ? Object.values(emojiObject)[0] : ""; // si no se encuentra un emoji, asigna una cadena vacía
      return { category, emoji };
    });

    return addEmoji;
  } catch (error) {
    logger.error({ message: "Failed to get recipe categories" });
    throw new Error("Failed to get recipe categories");
  }
};

export const getRecipeMetaInfo = async () => {
  try {
    const metaInfo = await Recipe.find({ metaextra: { $exists: true } })
      .distinct("metaextra")
      .lean();

    const dietas = metaInfo
      .filter((meta) => meta.title === "Dieta:")
      .map((meta) => meta.values[0]?.item)
      .filter(Boolean);

    const dificultades = metaInfo
      .filter((meta) => meta.title === "Dificultad:")
      .map((meta) => meta.values[0]?.item)
      .filter(Boolean);

    const tecnica = metaInfo
      .filter((meta) => meta.title === "Técnica:")
      .map((meta) => meta.values[0]?.item)
      .filter(Boolean);

    const temporada = metaInfo
      .filter((meta) => meta.title === "Temporada:")
      .map((meta) => meta.values[0]?.item)
      .filter(Boolean);

    return {
      dietas: [...new Set(dietas)] || null,
      dificultades: [...new Set(dificultades)] || null,
      tecnica: [...new Set(tecnica)] || null,
      temporada: [...new Set(temporada)] || null,
    };
  } catch (error) {
    logger.error({
      message: "Failed to get recipe meta info",
    });
    throw new Error("Failed to get recipe meta info");
  }
};

export const saveDatabaseRecipes = async () => {
  let pages = 516;
  for (let i = 1; i <= pages; i++) {
    const recipes = await getAllRecipesApi(i); // Obtiene las recetas de la página i
    for (let j = 0; j < recipes.length; j++) {
      const recipe = recipes[j];
      const newRecipe = new Recipe(recipe); // Crea una nueva instancia del modelo Recipe
      await newRecipe.save(); // Guarda la nueva receta en la base de datos
    }
    console.log(`Guardadas las recetas de la página ${i}`);
  }
  console.log("Todas las recetas se han guardado en la base de datos.");
};
