const axios = require('axios');
const Buffer = require('buffer').Buffer;
const Config = require('../../server.config');

module.exports = (fastify, opts, done) => {

  fastify.get('/image/:objectId/thumb', async function (req, rep) {
    var thumbnail = await this.models.collectionsObjectImage.findOne({
      where: {
        object_id: req.params.objectId,
        is_thumb: true
      }
    });

    if(thumbnail === null) {
      rep.code(404).send('Not found');
    } else {
      var imagePublicPath = `${Config.images.src}${thumbnail.imagePublicPath}`;
      var raw = await axios.get(imagePublicPath, {
        responseType: 'arraybuffer'
      });
  
      rep
        .code(200)
        .header('Content-type', raw.headers['content-type'])
        .send(Buffer.from(raw.data, 'binary'));
    }
  });

  fastify.get('/image/:objectId/:imageId', async function (req, rep) {
    var image = await this.models.collectionsObjectImage.findOne({
      offset: req.params.imageId,
      where: {
        object_id: req.params.objectId,
        is_thumb: false
      }
    });

    if(image === null) {
      rep.code(404).send('Not found');
    } else {
      var imagePublicPath = `${Config.images.src}${image.imagePublicPath}`;
      
      var raw = await axios.get(imagePublicPath, {
        responseType: 'arraybuffer'
      });

      rep
        .code(200)
        .header('Content-type', raw.headers['content-type'])
        .send(Buffer.from(raw.data, 'binary'));
    }
  });

  done();
};