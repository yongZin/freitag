const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const storage = multer.diskStorage({
  destination: (req, file, cd) => cd(null, "./uploads"), // 파일이 저장되는 디렉토리
  filename: (req, file, cd) => 
    cd(null, `${uuid()}.${mime.extension(file.mimetype)}`) // 파일저장명(겹치지않도록 임의 이름 지정)
});

const upload = multer({ storage,
  fileFilter: (req, file, cb) => { //확장자 제한
    if(["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
  },
  limits:{
    fileSize: 1024 * 1024 * 5, // 용량제한(5MB)
  }
});

module.exports = { upload };