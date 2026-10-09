require("dotenv").config();

const connectDB = require("./src/db/db");
const app = require('./src/app');

const port = process.env.PORT || 3000;

(async () => {
    const isDatabaseConnected = await connectDB();

    if (!isDatabaseConnected) {
        process.exitCode = 1;
        return;
    }

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})();
