import {
  getAllDiets,
  getRecipesByDietId,
} from "../../controllers/gql/actions/controller.Actions.Graphql.js";
import {
  getAllRecipes,
  getRecipe,
  getRecipesByKeyword,
  getRecipeByCategory,
  getRecipeByMetaInfo,
  getRecipeBySearch,
  getReipeCategories,
  getRecipeMetaInfo,
} from "../../controllers/gql/recipes/controller.Recipes.Graphql.js";
import { getUser } from "../../controllers/gql/users/contoller.Users.Graphql.js";

export const Query = {
  getAllRecipes: async (_, { page }) => await getAllRecipes(page),
  getRecipe: async (_, { id }) => await getRecipe(id),
  getRecipesByKeyword: async (_, { keyword, page, limit }) =>
    await getRecipesByKeyword(keyword, page, limit),
  getRecipeByCategory: async (_, { category, page }) =>
    await getRecipeByCategory(category, page),

  getRecipeByMetaInfo: async (_, { metaInfo, page }) =>
    await getRecipeByMetaInfo(metaInfo, page),
  getRecipeBySearch: async (_, { search, page , filters }) =>
    await getRecipeBySearch(search, filters ,page ),

  getRecipeCategorie: async () => await getReipeCategories(),
  getRecipeMetaInfo: async () => await getRecipeMetaInfo(),
  getUser: async (root, args, context) => {
    return context.currentUser;
  },

  getAllDiets: getAllDiets,
  getRecipesByDietId: getRecipesByDietId,
};
