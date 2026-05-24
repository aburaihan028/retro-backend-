import { app } from "./app.js";
import "dotenv/config";
import { connectdb } from "./src/config/mongodb.js";

const prot = process.env.PORT || 4000;

connectdb()
  .then(() => {
    app.listen(prot, () => {
      console.log(`server running on http://localhost:${prot}`);
    });
  })
  .catch((err) => {
    console.log("error from Failed Database connection", err);
  });
