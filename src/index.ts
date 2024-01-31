import express from "express";
import { mainRouter } from "./routes";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import { connectDB } from "./db";

const PORT = process.env.PORT || "4009";
const ENV = process.env.ENV || "prod";
const DOC = process.env.DOC;

const app = express();
connectDB();
if (DOC === "true") {
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(require("./features/swagger/swagger_output.json"), {
      explorer: true,
    })
  );
}

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
