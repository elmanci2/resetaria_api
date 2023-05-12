import jwt from "jsonwebtoken";
import { SECRET_WORD } from "../../../../constants/util.js";
import { createDietUsers } from "../../../../db/models/models.mongo.js";
import { v4 as uuidv4 } from "uuid";

export const createDiet = async (parent, args, context, info) => {
  const { name, description, image, recipesId } = args;
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");
  const { _id } = user;
  const newDiet = new createDietUsers({
    id: uuidv4(),
    userId: _id,
    diet: [
      {
        id: uuidv4(),
        name,
        description,
        image,
        recipes: [
          {
            recipe: recipesId,
          },
        ],
      },
    ],
  });
  const diet = await newDiet.save();
  return diet;
};

export const addRecipesToDiet = async (parent, args, context, info) => {
  const { dietId, recipeId } = args;
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");

  // Verificamos si la dieta existe y pertenece al usuario logueado
  const diet = await createDietUsers.findOne({
    _id: dietId,
    userId: user._id,
  });
  if (!diet) throw new Error("Dieta no encontrada");

  // Agregamos la receta a la dieta
  const newRecipe = { recipe: recipeId };
  diet.diet[0].recipes = [...diet.diet[0].recipes, newRecipe];

  // Guardamos los cambios en la base de datos
  const updatedDiet = await diet.save();

  // Devolvemos la receta agregada
  const addedRecipe = updatedDiet.diet[0].recipes.find(
    (recipe) => recipe.recipe.toString() === recipeId
  );

  console.log(addedRecipe);
  return addedRecipe;
};

export const deleteDiet = async (parent, args, context, info) => {
  const { dietId } = args;
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");
  const { _id } = user;
  const deletedDiet = await createDietUsers
    .findOneAndRemove({ userId: _id, _id: dietId })
    .populate("recipes");
  return deletedDiet;
};

export const removeRecipeFromDiet = async (parent, args, context, info) => {
  const { dietId, recipeId } = args;
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("Usuario no encontrado");

  const diet = await createDietUsers.findOneAndUpdate(
    {
      _id: dietId,
      userId: user._id,
    },
    {
      $pull: { "diet.$[].recipes": { _id: recipeId } },
    },
    { new: true }
  );

  if (!diet) throw new Error("Dieta no encontrada o no pertenece al usuario");

  return diet;
};

export const updateDiet = async (parent, args, context) => {
  const token = context.req.headers.authorization.split(" ")[1];
  if (!token) throw new AuthenticationError("No se proporcionó un token");
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new AuthenticationError("Token inválido");
  const { dietId, name, description, image } = args;
  const diet = await createDietUsers.findOne({
    _id: dietId,
    userId: user._id,
  });
  if (!diet) throw new UserInputError("No se pudo encontrar la dieta");
  if (name) diet.diet[0].name = name;
  if (description) diet.diet[0].description = description;
  if (image) diet.diet[0].image = image;
  const updatedDiet = await diet.save();
  return updatedDiet;
};

export const getAllDiets = async (parent, args, context, info) => {
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");

  // Obtenemos todas las dietas del usuario
  const diets = await createDietUsers
    .find({ userId: user._id })
    .populate("diet.recipes");

  console.log(diets);

  return diets;
};

export const getRecipesByDietId = async (parent, args, context, info) => {
  const { dietId } = args;
  const token = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, SECRET_WORD);
  if (!user) throw new Error("Usuario no encontrado");
  const { _id } = user;
  const diet = await createDietUsers
    .findOne({ userId: _id, _id: dietId })
    .populate("diet.recipes.recipe");
  if (!diet) throw new Error("Dieta no encontrada");
  const recipes = diet.diet.map((d) => d.recipes.map((r) => r.recipe));
  return recipes.flat();
};
