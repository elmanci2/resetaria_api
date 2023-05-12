import express from "express";
import rt from "./src/interfaces/routes/Routes.js";
import { conextionDb } from "./src/db/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { schema } from "./src/interfaces/gql/index.js";
import { createYoga } from "graphql-yoga";
import jwt from "jsonwebtoken";
import { createUser } from "./src/db/models/models.mongo.js";

const gql = createYoga({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7);
      const { id } = jwt.verify(token, `${process.env.JWT_SECRET_WORD}`);
      const currentUser = await createUser.findOne({ id });
      return { currentUser };
    }
  },
});


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(rt);
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use(gql);

app.listen(port, () => {
  conextionDb();
  console.log(`Server running on port ${port}`);
});
