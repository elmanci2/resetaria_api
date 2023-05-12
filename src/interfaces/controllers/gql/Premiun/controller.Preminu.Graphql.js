import { SECRET_WORD } from "../../../../constants/util.js";
import jwt from "jsonwebtoken";
import { createUser } from "../../../../db/models/models.mongo.js";

export const getPremiun = async (parent, args, context, info) => {
  const getToken = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(getToken, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");

  const userDb = await createUser.findOne({ id: user.id });
  if (userDb.isPremium === false) {
    const now = new Date();
    const expiration = new Date(now.getTime() + 5 * 60000); // 5 minutos de tiempo de expiración
    userDb.isPremium = true;
    userDb.premiumExpiration = expiration;
    await userDb.save();
  } else {
    throw new Error("usuario ya es premium");
  }

  return {
    message: "usuario premium",
  };
};

const removePremin = async (parent, args, context, info) => {
  const getToken = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(getToken, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");

  const userDb = await createUser.findOne({ id: user.id });
  if (userDb.isPremium === true) {
    userDb.isPremium = false;
    await userDb.save();
  } else {
    throw new Error("usuario no es premium");
  }

  return {
    message: "usuario ya no es premium",
  };
};
