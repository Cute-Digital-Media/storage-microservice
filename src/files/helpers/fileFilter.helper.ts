export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) return cb(new Error('File is empty'), false);

  const fileExt = file.mimetype.split('/')[1];
  const validExt = ['png', 'jpg', 'jpeg', 'gif'];
  if (validExt.includes(fileExt)) return cb(null, true);

  cb(null, false);
};
