import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import https from 'https';
import path from "path";

import fs from 'fs';

dotenv.config({ path: ".env" });

connectDB()
  .then(() => {
    console.log(path.join('./', 'cert', 'key.pem'));
    // Read SSL certificate and private key
    // const privateKey = fs.readFileSync('./cert/key.pem', 'utf8');
    // const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');

    // Create HTTPS server
    const __dirname = path.resolve();
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, 'backend', 'src', 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'backend', 'src', 'cert', 'cert.pem'))
    };

    https.createServer(httpsOptions, app).listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} with SSL`);
    });
  })
  .catch((error) => console.log(error));
