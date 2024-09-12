import multer from "multer";
import path from "path";
import { generarId } from '../helpers/tokens.js'



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb){
        cb(null, generarId() + path.extname(file.originalname))
    }
})


const upload = multer({storage})

import fs from 'fs';

const dir = './public/uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

export default upload