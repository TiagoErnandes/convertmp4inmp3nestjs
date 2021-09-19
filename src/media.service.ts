/* eslint-disable prettier/prettier */
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');
const supportedFiles = ['mp4', 'mov', 'm4v'];
@Injectable()
export class MediaService {
  constructor() {}
  async fileUpload(@Req() req, @Res() res) {
    console.log(req)
    console.log('chegou no service')
    if(req.file){
        console.log(req.file.path)

        const output = Date.now() + "output.mp3"

        exec(`ffmpeg -i ${req.file.path} -bufsize 64k ${output}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("file is converted")
            res.download(output,(err) => {
                if(err) throw err                
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(output)
            })
        }
        })
    }
  }

  getFileExtension = (file) => {
    const fileName = file.originalname;
    return fileName.split('.').pop();
  };
  getFileNameWithoutExtension = (file) => {
    return file.split('.').slice(0, -1).join('.');
  };
}
