const axios = require('axios');
const Buffer = require('buffer').Buffer;
const Config = require('../server.config');

class ImageController {

  static async handleGetObjectImageThumbnail(req, rep) {
    const thumbnail = await this.models.collectionsObjectImage.findOne({
      where: {
        object_id: req.params.objectId,
        is_thumb: true
      }
    });

    if(thumbnail === null) {
      rep.code(404).send('Not found');
    } else {
      const imagePublicPath = `${Config.images.src}${thumbnail.imagePublicPath}`;
      const raw = await axios.get(imagePublicPath, {
        responseType: 'arraybuffer'
      });
  
      rep
        .code(200)
        .header('Content-type', raw.headers['content-type'])
        .send(Buffer.from(raw.data, 'binary'));
    }
  }

  static async handleGetObjectImage(req, rep) {
    const image = await this.models.collectionsObjectImage.findOne({
      offset: req.params.imageId,
      where: {
        object_id: req.params.objectId,
        is_thumb: false
      }
    });

    if(image === null) {
      rep.code(404).send('Not found');
    } else {
      const imagePublicPath = `${Config.images.src}${image.imagePublicPath}`;
      
      const raw = await axios.get(imagePublicPath, {
        responseType: 'arraybuffer'
      });

      rep
        .code(200)
        .header('Content-type', raw.headers['content-type'])
        .send(Buffer.from(raw.data, 'binary'));
    }
  }
}

module.exports = ImageController;