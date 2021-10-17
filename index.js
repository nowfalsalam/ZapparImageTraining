const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const train = require('@zappar/imagetraining');
const fs  = require("fs/promises")
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

// configuring the DiscStorage engine.
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//POST method route for uploading file
app.post('/train_target', upload.single('file'), function (req, res) {
  //Multer middleware adds file(in case of single file ) or files(multiple files) object to the request object.
  //req.file is the demo_file
 // uploadFile(req.file.path, req.file.filename ,res);
 res.setHeader('Content-Type', 'application/json');
  perform(req.file.path, req.file.filename ,res);
})

async function perform(path , name, res) {
    let png = await fs.readFile(path);
    let target = await train.train(png);
    await fs.writeFile("uploads/target.zpt", target);
    fs.unlink(path)
    res.sendFile('target.zpt',{root: "uploads"});
}

app.listen(3000, () =>
  console.log('Express server is running on localhost:3001')
);