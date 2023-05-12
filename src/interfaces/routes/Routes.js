import { Router } from "express";
import { getAllRecipesApi, getRecipe } from "../../data/api/index.js";

const rt = Router();

rt.get("/", async (req, res) => {
  getRecipe("tocino-cielo-tradicional_8.html").then((data) => {
    res.send(data);
  });
});

rt.get("/login", (req, res) => {
  res.send("login");
});

export default rt;
