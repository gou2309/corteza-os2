import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import metadataRoute from "./routes/metadata.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api", metadataRoute);

app.listen(PORT, () => {
  console.log(`Servidor de Corteza OS2 corriendo en http://localhost:${PORT}`);
});
