const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const child_process = require("child_process");
const fileUpload = require("express-fileupload");
const decompress = require("decompress");
const morgan = require("morgan");
const lodash = require("lodash");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.static(path.join(__dirname, "uploads", "build")));

app.get("/alive", (req, res) => {
  return res.status(200).send("hi");
});
app.get("/test-app", (req, res) =>
  res
    .status(200)
    .sendFile(path.join(__dirname, "uploads", "build", "index.html"))
);
app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let file = req.files.file;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      await file.mv(path.join(__dirname, "uploads", file.name));

      await decompress(
        path.join(__dirname, "uploads", "build.zip"),
        path.join(__dirname, "uploads")
      );
      child_process.exec(
        path.join(__dirname, "node_modules", ".bin", "cypress") + " run",
        (error, stdout, stderr) => {
          console.log(error);
          console.log(stdout);
          console.log(stderr);

          let file = fs.readFileSync(
            path.join(__dirname, "cypress", "results", "mochawesome.json"),
            "utf-8"
          );
          let fileData = JSON.parse(file);

          running = false;

          return res.status(200).send(
            fileData.results[0].suites[0].tests.map((test) => ({
              test: test.title,
              state: test.state,
            }))
          );
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log("server running on port: " + port));
