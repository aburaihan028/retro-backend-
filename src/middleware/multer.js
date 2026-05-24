import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/temp");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.replace(" ", ""));
  },
});

const upload = multer({ storage: storage });

export { upload };
