const cloudinary = require('cloudinary')
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

const streamUpload = (file, folderName) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.v2.uploader.upload_stream({ folder: folderName},
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
     streamifier.createReadStream(file).pipe(stream);
  });
};

const removeUploadedFile = (public_id) => {
  return cloudinary.v2.uploader.destroy(public_id)
}

module.exports = { streamUpload, removeUploadedFile }