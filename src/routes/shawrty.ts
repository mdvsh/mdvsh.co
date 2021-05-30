import fs from "fs";
import path from "path";
import prisma from "../database/prisma";
import { cleanUrl } from "../utils/cleanUrl";
import { Router, Request, Response } from "express";

import { validate } from "../middleware/auth";

import { getAuthUrl, getAuthProfile } from "../controller/google";

const shawrty = Router();

shawrty.get("/", validate, async (req: Request, res: Response) => {
  try {
    const links = await prisma.links.findMany();
    res.render("index", {
      profile_pic: req.session?.profile_pic,
      name: req.session?.name,
      email: req.session?.email,
      links,
    });
  } catch (e) {
    console.log(e);
    res.render("error", { status: "404", message: e.message });
  }
});

shawrty.post("/", validate, async (req: Request, res: Response) => {
  try {
    const { slug, target } = req.body;
    const cleanedUrl = cleanUrl(target);
    const shortlink = await prisma.links.findUnique({ where: { slug: slug } });

    if (shortlink) {
      if (cleanedUrl === "") {
        await prisma.links.delete({ where: { slug: slug } });
      } else {
        await prisma.links.update({
          where: { slug: slug },
          data: { target: cleanedUrl },
        });
      }
    } else if (!shortlink && cleanedUrl !== "") {
      await prisma.links.create({
        data: { slug: slug, target: cleanedUrl },
      });
    }

    res.redirect("shawrty");
  } catch (e) {
    console.log(e);
    res.render("error", { status: e.status.toString(), message: e.message });
  }
});

shawrty.get("/login", (req: Request, res: Response) => {
  try {
    res.render("login", {
      error: "",
      login_url: getAuthUrl(),
    });
  } catch (e) {
    console.log(e);
    res.render("error", { status: e.status.toString(), message: e.message });
  }
});

shawrty.get("/auth", async (req: Request, res: Response) => {
  try {
    const profile = await getAuthProfile(req.query.code as string);
    const { picture, name, email } = profile;
    const data = fs.readFileSync(path.resolve(__dirname, "../../.authorized"));

    if (data.includes(email)) {
      req.session!.email = email;
      req.session!.name = name;
      req.session!.profile_pic = picture;
      res.redirect("/shawrty");
    } else {
      res.redirect("/unauthorized");
    }
  } catch (error) {
    res.render("error", {
      status: "401",
      message: "You're not authorized to use this application.",
    });
  }
});

shawrty.get("/logout", (req: Request, res: Response) => {
  try {
    // @ts-ignore
    req.session = null;
    res.redirect("/shawrty/login");
  } catch (e) {
    console.log(e);
    res.render("error", { status: e.status.toString(), message: e.message });
  }
});

export default shawrty;
