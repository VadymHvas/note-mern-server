import express from "express";
import mongoose from "mongoose";
import {
  registerUser,
  loginUser,
  getMe,
  updateAccount,
} from "./controllers/AuthController.js";
import {
  registerValidation,
  updateValidation,
} from "./validations/AuthValidation.js";
import { checkAuth } from "./middlewares/CheckAuth.js";
import dotenv from "dotenv/config";
import cors from "cors";
import fs from "fs";
import fileUpload from "express-fileupload";
import path from "path";
import {
  addToFavorite,
  createNote,
  deleteNote,
  getFavorites,
  getFullNote,
  getMyNotes,
  removeFromFavorite,
} from "./controllers/NoteController.js";
import { createNoteValidation } from "./validations/NoteValidation.js";
import UserModel from "./models/UserModel.js";

const DB_URL = process.env.DB_URL;

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DATABASE OK"))
  .catch(() => console.log("DATABASE ERROR"));

const app = express();

if (!fs.existsSync("uploads")) {
    fs.mkdir("uploads", { recursive: true }, err => {
      console.log(err);
    });
};

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("uploads"));

// Auth routes

app.get("/getMe", checkAuth, getMe);
app.post("/auth/register", registerValidation, registerUser);
app.post("/auth/login", loginUser);
app.post("/updateAccount", checkAuth, updateValidation, updateAccount);

// Note routes

app.get("/note/getMyNotes", checkAuth, getMyNotes);
app.get("/note/getFavorites", checkAuth, getFavorites);
app.post("/note/create", checkAuth, createNoteValidation, createNote);
app.post("/note/fullNote", getFullNote);
app.post("/note/deleteNote", checkAuth, deleteNote);
app.post("/note/addFavorite", checkAuth, addToFavorite);
app.post("/note/removeFavorite", checkAuth, removeFromFavorite);

app.get("/uploads/:img", (req, res) => {
  const { img } = req.params;

  const imgPath = path.join(__dirname, img);

  fs.readdir("./uploads/userAvatars", (err, files) => {
    if (files.includes(img)) {
      return res.send(`
        <img src=${imgPath} />
      `);
    } else {
      console.log(`Файл ${imgPath} не знайдено у директорії`);
    }
  });
});


app.listen(4444, () => {
  console.log("SERVER OK");
});
