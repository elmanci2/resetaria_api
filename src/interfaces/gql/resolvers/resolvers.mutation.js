import { getPremiun } from "../../controllers/gql/Premiun/controller.Preminu.Graphql.js";
import {
  addRecipesToDiet,
  createDiet,
  deleteDiet,
  removeRecipeFromDiet,
  updateDiet,
} from "../../controllers/gql/actions/controller.Actions.Graphql.js";
import {
  createNewUser,
  deleteUser,
  loginUser,
} from "../../controllers/gql/users/contoller.Users.Graphql.js";

export const Mutation = {
  createUser: createNewUser,

  loginUser: loginUser,

  deleteUser: deleteUser,

  getPremiun: getPremiun,

  createDiet: createDiet,

  addedRecipeToDiet: addRecipesToDiet,

  deleteRecipeToDiet: removeRecipeFromDiet,

  deleteDiet: deleteDiet,

  updateDiet: updateDiet,

};
