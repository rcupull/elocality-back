import express from "express";
import dotenv from "dotenv";
import { mainRouter } from "./routes";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";

//@ts-expect-error ignore
import swaggerOutput from "./features/swagger/swagger_output.json";

dotenv.config();

const port = process.env.PORT;
const env = process.env.ENV;
const app = express();

if (env === "dev") {
  // Serve Swagger documentation
  app.use(
    "/api-docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerOutput, { explorer: true })
  );
}

app.use(
  cors({ origin: "http://local.elocality.com:3000", optionsSuccessStatus: 200 })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", mainRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
