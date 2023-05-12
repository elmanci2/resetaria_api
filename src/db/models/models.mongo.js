import { Schema, mongoose } from "mongoose";

export const recipeSchema = new Schema({
  id: { type: String },
  title: { type: String },
  image: { type: String },
  time: { type: String },
  video: { type: String },
  preview: { type: String },
  history: { type: String },
  uploadDate: { type: String },
  ingredients: [
    {
      id: { type: Number },
      name: { type: String },
      emoji: { type: String },
    },
  ],
  tips: [{ type: String }],

  keywords: [
    {
      id: { type: Number },
      keyword: { type: String },
    },
  ],

  metaextra: [
    {
      id: Number,
      title: String,
      values: [
        {
          item: String,
        },
      ],
    },
  ],

  metaheader: [
    {
      id: Number,
      title: String,
      element: String,
    },
  ],
  steps: [
    {
      instruction: { type: String },
      description: { type: String },
      imageUrl: { type: String },
    },
  ],

  ratings: [
    {
      stars: { type: String },
      votes: { type: String },
    },
  ],
});

/// users schema

const usersSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  role: { type: String, required: true },
  isPremium: { type: Boolean, required: true },
  premiumExpiresAt: { type: Date, default: null },
});

export const createUser = mongoose.model("users", usersSchema);

///  create diet users
const dietUsersSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diet: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      recipes: [
        {
          recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        },
      ],
    },
  ],
});

/* const dietUsersSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diet: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Agregamos el campo "recipes"
    },
  ],
});
 */

export const createDietUsers = mongoose.model("diets", dietUsersSchema);
