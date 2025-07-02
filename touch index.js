const express = require("express");
const metadataRoute = require("./routes/metadata");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", metadataRoute);

app.listen(PORT, () => {
  console.log(`Servidor de Corteza OS2 corriendo en http://localhost:${PORT}`);
});
