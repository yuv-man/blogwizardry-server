import express from "express";
import authRouter from "./routes/auth.routes.js";
import generateRouter from "./routes/generate.routes.js";
import postRouter from "./routes/post.routes.js";

const router = express.Router();
router
  .use(authRouter)
  .use(generateRouter)
  .use(postRouter)
  .use((error, req, res, next) => {
    res.status(500).send({
      code: error.code,
      message: error.message,
    });
  });

export default router;