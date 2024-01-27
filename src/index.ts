import express from "express";
import { mainRouter } from "./routes";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";

const PORT = process.env.PORT || "4009";
const ENV = process.env.ENV || "prod";
const DOC = process.env.DOC;

const expressApp = express();

if (DOC === "true") {
  expressApp.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(require("./features/swagger/swagger_output.json"), {
      explorer: true,
    })
  );
}

expressApp.use(
  cors({ origin: "http://local.elocality.com:3000", optionsSuccessStatus: 200 })
);

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use("/", mainRouter);

expressApp.get("/some-data", (request, response) => {
  response.send("Hello world");
});

expressApp.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

export const app = expressApp;
