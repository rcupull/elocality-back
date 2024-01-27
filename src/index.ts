import express from "express";
import { mainRouter } from "./routes";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";

const PORT = process.env.PORT || "4009";
const ENV = process.env.ENV || "prod";
const DOC = process.env.DOC;

const app = express();

if (DOC === "true") {
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(require("./features/swagger/swagger_output.json"), {
      explorer: true,
    })
  );
}

app.use(
  cors({ origin: "http://local.elocality.com:3000", optionsSuccessStatus: 200 })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", mainRouter);

app.get("/some-data", (request, response) => {
  response.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
