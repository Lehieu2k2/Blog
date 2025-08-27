interface FileMapper {
  file: Express.Multer.File;
  type: string;
}

export const fileMapper = ({ file, type }: FileMapper) => {
  return {
    originalname: file.originalname,
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    type: type,
  };
};
