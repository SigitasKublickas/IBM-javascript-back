import express, { Express, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://Ibm-task:Yo4JTcCcGGs9CZlJ@sigitas.pa12i8q.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = Promise;
mongoose.connect(uri);
mongoose.connection.on("error", (error: Error) => console.log(error));

const app: Express = express();

app.use(cors());
app.use(express.json());

const UserSearched = new mongoose.Schema({
  name: { type: String, required: true },
  searched: { type: String, required: true },
});
const UserModel = mongoose.model("usersSearched", UserSearched);

const UserSelected = new mongoose.Schema({
  name: { type: String, required: true },
  selected: { type: String, required: true },
});
const UserSelectedModel = mongoose.model("usersSelected", UserSelected);

app.post("/searchedCoins", async (req: Request, res: Response) => {
  const { name, searched } = req.body;
  try {
    const userCreate = await UserModel.create({
      name: name,
      searched: searched,
    });
    res.json({ success: true, data: userCreate });
  } catch (err) {
    res.json({ success: false, data: err });
  }
});

app.post("/selectedCoins", async (req: Request, res: Response) => {
  const { name, selected } = req.body;
  try {
    const userCreate = await UserSelectedModel.create({
      name: name,
      selected: selected,
    });
    res.json({ success: true, data: userCreate });
  } catch (err) {
    res.json({ success: false, data: err });
  }
});

app.get("/getTrandingCoins", async (req: Request, res: Response) => {
  const tranding = await axios.get(
    "https://api.coingecko.com/api/v3/search/trending"
  );
  if (tranding.status === 200) {
    res.json({ success: true, coins: tranding.data.coins });
  } else {
    res.json({ success: false, coins: [] });
  }
});

app.post("/search", async (req: Request, res: Response) => {
  const coins = await axios.get("https://api.coingecko.com/api/v3/search", {
    params: { query: req.body.input },
  });
  if (coins.status === 200) {
    res.json({ success: true, coins: coins.data.coins });
  } else {
    res.json({ success: false, coins: [] });
  }
});
app.post("/getCoin", async (req: Request, res: Response) => {
  const coin = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${req.body.id}`
  );
  if (coin.status === 200) {
    if (coin) {
      res.json({ success: true, coin: coin.data });
    } else {
      res.json({ success: false, coin: [] });
    }
  }
});

app.get("/getBtcToUsd", async (req: Request, res: Response) => {
  const usd = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
  );
  if (usd.status === 200) {
    res.json({ success: true, usd: usd.data.bitcoin.usd });
  } else {
    res.json({ success: false, usd: [] });
  }
});

app.listen(8000, () => {
  console.log("listening on port 8000");
});
