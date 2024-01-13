// import App from "./app";
// import IndexRoute from "./routes/index.route";

// const server = new App([new IndexRoute()]);

// server.listen();
import express from "express";
import { json } from "express";
import cors from "cors"; // Import the cors middleware

const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

app.use(json());

app.get("/api/auth", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
