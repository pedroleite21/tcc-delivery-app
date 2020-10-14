const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type, only JPEG and PNG is allowed!'),
      false,
    );
  }
};

const s3 = new aws.S3();
const upload = multer({
  limits: {
    fileSize: 1048576, // 1MB
  },
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    cacheControl: 'max-age=31536000',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const key = `user-profile-images/${process.env.NODE_ENV}/${
        req.params.userId
      }_${Date.now().toString()}${path.extname(file.originalname)}`;
      cb(null, key);
    },
  }),
});

const uploadImage = upload.single('image');

exports.singleUpload = (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        message: 'Image upload failed',
        success: false,
      });
    }

    return res.status(200).send({
      imageUrl: req.file.location,
      message: 'Image uploaded succesfully',
      success: false,
    });
  });
};
