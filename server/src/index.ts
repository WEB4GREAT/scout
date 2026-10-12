import "dotenv/config";
import app from "../../index";

const PORT = Number(process.env.PORT || 8787);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scout API listening on port ${PORT}`);
});
