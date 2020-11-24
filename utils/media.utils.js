const cloudinary = require("cloudinary").v2;
const Media = require("../models/media.model");

result = await cloudinary.uploader.upload(path, {
  folder: "Coders-x/Covers/",
});

module.exports.uploadImage = async (path, folder) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: `Chatapp/${folder}`,
  });

  const media = await Media.create({
    secure_url,
    public_id,
  });

  return media;
};

module.exports.deleteImage = async (id) => {
  const media = await Media.findById(id);

  const { result } = cloudinary.uploader.destroy(media.public_id);

  return result === "ok";
};
