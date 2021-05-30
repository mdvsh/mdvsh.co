import prisma from "../database/prisma";
import { Router, Request, Response } from "express";
import { validate } from "../middleware/auth";

import { getAuthUrl } from "../controller/google";

const index = Router();

index.post("/delete/:id", validate, async (req: Request, res: Response) => {
  try {
    await prisma.links.delete({ where: { id: +req.params.id } });
    res.redirect("/shawrty/");
  } catch (e) {
    console.log(e);
    res.render("error", { status: e.status.toString(), message: e.message });
  }
});

index.get("/unauthorized", (req: Request, res: Response) => {
  res.render("login", {
    error: "Sorry, your account isn't authorized.",
    login_url: getAuthUrl,
  });
});

export default index;
