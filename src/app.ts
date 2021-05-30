import path from "path";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import compression from "compression";
import expressLayouts from "express-ejs-layouts";
import express, { Application, Request, Response, NextFunction } from "express";

import prisma from "./database/prisma";
import indexRouter from "./routes/index";
import dashRouter from "./routes/shawrty";

require("dotenv").config();

const bodyParser = require("body-parser");
const session = require("express-session");

const app: Application = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/shawrty", dashRouter);

app.get("*", async (req: Request, res: Response) => {
  const link = req.url;
  if (link === "/") {
    res.redirect("https://madhavshekhar.com");
    return;
  }
  const shortlink = await prisma.links.findUnique({
    where: { slug: link.slice(1) },
  });
  if (!shortlink) {
    return res.status(404).render("error", {
      status: "404",
      message: "The page you were looking for could not be found.",
    });
  }
  res.redirect(shortlink.target);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  try {
    next();
  } catch (err) {
    res.render("error", {
      status: error.status.toString(),
      message: err.message,
    });
  }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
