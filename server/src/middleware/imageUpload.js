import multer from 'multer';

const fileFilter = (req, file, cb) => {
  const error = new Error('Only JPG/PNG images are allowed');
  error.status = 422;
  // accept only jpg or png images
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(error, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

export default upload;
