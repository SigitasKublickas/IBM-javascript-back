import express, { Express, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

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
  try {
    const tranding = await axios.get(
      "https://api.coingecko.com/api/v3/search/trending"
    );
    res.json({ success: true, coins: tranding.data.coins });
  } catch (err) {
    res.json({ success: false, coins: [], err: err });
  }
});

app.post("/search", async (req: Request, res: Response) => {
  try {
    const coins = await axios.get("https://api.coingecko.com/api/v3/search", {
      params: { query: req.body.input },
    });
    res.json({ success: true, coins: coins.data.coins });
  } catch (err) {
    res.json({ success: false, coins: [], err: err });
  }
});

app.post("/getCoin", async (req: Request, res: Response) => {
  try {
    const coin = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${req.body.id}`
    );
    res.json({ success: true, coin: coin.data });
  } catch (err) {
    res.json({ success: false, coin: [], err: err });
  }
});

app.get("/getBtcToUsd", async (req: Request, res: Response) => {
  try {
    const usd = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
    );
    res.json({ success: true, usd: usd.data.bitcoin.usd });
  } catch (err) {
    res.json({ success: false, usd: [], err: err });
  }
});

app.listen(8000, () => {
  console.log("listening on port 8000");
});
