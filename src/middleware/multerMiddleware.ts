// multer configuration

import multer from "multer";

const storage = multer.diskStorage({
  // location of where the incoming file is to be kept
  destination: function(req:Request, file:Express.Multer.File, cb:any){
    // inside cb-callback function we give two arguments i.e what is to do if failure and what to do if success. in this case we do nothing in case of error and storage location in case of success.
    cb(null,'./src/storage')
  },
  // name of the file while storing it
  filename: function(req:Request, file:Express.Multer.File, cb:any){
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export default storage;