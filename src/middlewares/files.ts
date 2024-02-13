import multer from "multer";
import fs from "fs";

export const filesDir = "app-images";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId, routeName } = req.params;

    const path = `./${filesDir}/${userId}/${routeName}/`;
    fs.mkdirSync(path, { recursive: true });

    cb(null, path); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to include the timestamp
  },
});

export const uploadMiddleware = multer({ storage: storage });
