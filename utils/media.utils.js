const cloudinary = require("cloudinary").v2;
const Media = require("../models/media.model");

module.exports.uploadImage = async (path, folder) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: `Instee/${folder}`,
  });

  const media = await Media.create({
    url: secure_url,
    public_id,
  });

  console.log(media);

  return media;
};

module.exports.deleteImage = async (id) => {
  const media = await Media.findById(id);

  const { result } = cloudinary.uploader.destroy(media.public_id);

  return result === "ok";
};
