import express from "express";
import { router } from "./router";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import { connectDB } from "./db";
import { passportMiddlewareInitialize } from "./middlewares/passport";

const PORT = process.env.PORT || "4009";
const ENV = process.env.ENV || "prod";
const DOC = process.env.DOC;

const app = express();
connectDB();
if (DOC === "true") {
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(require("../swagger_output.json"), {
      explorer: true,
    })
  );
}

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.static("app-images"));

// app.use(expressSession);
app.use(passportMiddlewareInitialize);
// app.use(passportMiddleware.authenticate("session"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
