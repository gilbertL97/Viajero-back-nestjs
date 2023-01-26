import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import path = require('path');
import { ValidateFile } from 'src/traveler/helper/validation.file';

const uploadFilterPdf = (req, file, cb) => {
  if (file.mimetype.match(/\/(pdf)$/)) {
    // Allow storage of file
    cb(null, true);
  } else {
    // Reject file
    cb(
      new HttpException(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};
const uploadFilterCsvExcel = (req, file, cb) => {
  console.log(file.mimetype);
  if (ValidateFile.isCSV(file) || ValidateFile.isExcel(file)) {
    console.log(file.mimetype);
    // Allow storage of file
    cb(null, true);
  } else {
    // Reject file
    cb(
      new HttpException(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};

export const coverageStorage = {
  storage: diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const filename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: uploadFilterPdf,
};

export const TravelersStorage = {
  storage: diskStorage({
    destination: './uploads/contractors/unprocesed',
    filename: (req, file, cb) => {
      const filename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: uploadFilterCsvExcel,
};
