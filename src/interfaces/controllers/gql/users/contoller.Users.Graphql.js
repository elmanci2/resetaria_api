import {
  checkPassword,
  hashPassword,
} from "../../../../data/util/hashPassword.js";
import { createUser } from "../../../../db/models/models.mongo.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const SECRET_WORD = `${process.env.JWT_SECRED_WORD}`;

/// crete user
export const createNewUser = async (parent, args, context, info) => {
  try {
    const newUser = new createUser({
      ...args,
      password: await hashPassword(args.password),
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: null,
    });
    const user = await newUser.save();
    return user;
  } catch (error) {
    console.log("usuari no creado" + error);
  }
};

/// login user
export const loginUser = async (parent, args) => {
  try {
    const { email, password } = args;
    const user = await createUser.findOne({ email });
    if (!user) throw new Error("email no encontrado");
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) throw new Error("password incorrecto");

    const userToken = {
      _id: user._id,
      id: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
    };
    const token = jwt.sign(userToken, SECRET_WORD);
    return {
      value: token,
    };
  } catch (error) {
    console.log("error al logearse" + error);
    throw new Error("Error al iniciar sesión" + error);
  }
};

// delets acaunt

export const deleteUser = async (parent, args, context) => {
  const getToken = context.req.headers.authorization.split(" ")[1];
  const user = jwt.verify(getToken, SECRET_WORD);
  if (!user) throw new Error("usuario no encontrado");
  const { id } = user;
  const { password } = args;
  try {
    const user = await createUser.findOne({ id });
    if (!user) throw new Error("usuario no encotrado");
    const isMatch = await checkPassword(password, user?.password);
    if (!isMatch) throw new Error("password incorrecto");
    await createUser.deleteOne({ id });
    return user;
  } catch (error) {
    console.log("error al borrar usuario" + error);
  }
};

/// get user
export const getUser = async (root, args, context) => {
  return context.currentUser;
};
