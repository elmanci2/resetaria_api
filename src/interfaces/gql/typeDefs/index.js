import { Diet } from "./diet.js";
import { recipesDef } from "./recipes.js";
import { userDef } from "./user.js";

export const typeDefs = /* GraphQL */ `
  ${recipesDef}
  ${userDef}
  ${Diet}

  type CategoriWidEmoji {
    category: String
    emoji: String
  }

  type RecipeMetaInfo {
    dietas: [String]
    dificultades: [String]
    tecnica: [String]
    temporada: [String]
  }

  type Token {
    value: String!
  }

  input FilterSearch {
    dietas: [String]
    dificulta: [String]
    tecnica: [String]
  }

  type Query {
    getAllRecipes(page: Int!): [Recipe]
    getRecipe(id: String!): Recipe
    getRecipesByKeyword(keyword: String!, page: Int!, limit: Int): [Recipe]
    getRecipeByCategory(category: String!, page: Int!): [Recipe]
    getRecipeByMetaInfo(metaInfo: String!, page: Int!): [Recipe]
    getRecipeBySearch(
      search: String!
      page: Int!
      filters: FilterSearch
    ): [Recipe]
    getRecipeCategorie: [CategoriWidEmoji]
    getRecipeMetaInfo: RecipeMetaInfo
    getUser: User
    getAllDiets: [Diet]
    getRecipesByDietId(dietId: String!): [Recipe]
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      role: String!
      isPremium: Boolean!
    ): User

    loginUser(email: String!, password: String!): Token
    deleteUser(password: String!): User
    getPremiun: Message

    createDiet(
      name: String!
      description: String!
      image: String
      recipesId: String!
    ): Diet

    addedRecipeToDiet(dietId: String!, recipeId: String!): Recipe
    deleteRecipeToDiet(dietId: String!, recipeId: String!): Diet
    deleteDiet(dietId: String!): Diet
    updateDiet(
      dietId: String!
      name: String!
      description: String!
      image: String!
    ): Diet
  }
`;
