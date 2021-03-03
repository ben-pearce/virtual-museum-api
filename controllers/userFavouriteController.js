
class UserFavouriteController {

  static async handleGetUserFavouriteObjects(req, rep) {
    const userId = req.user.id;
    const objectId = req.query.objectId;
    const whereClause = {
      userId: userId
    };

    if(objectId) {
      whereClause.objectId = objectId;
    }

    const favourites = await this.models.userCollectionsObjectFavourite.findAll({
      where: whereClause
    });

    if(!favourites.length) {
      await rep.code(404).send('Not found');
    } else {
      await rep.send(favourites);
    }
  }

  static async handleGetUserFavouritePeople(req, rep) {
    const userId = req.user.id;
    const personId = req.query.personId;
    const whereClause = {
      userId: userId
    };

    if(personId) {
      whereClause.personId = personId;
    }

    const favourites = await this.models.userCollectionsPersonFavourite.findAll({
      where: whereClause
    });

    if(!favourites.length) {
      await rep.code(404).send('Not found');
    } else {
      await rep.send(favourites);
    }
  }

  static async handleUserFavouriteObject(req, rep) {
    const objectId = req.body.objectId;

    const favourite = await this.models.userCollectionsObjectFavourite.create({
      userId: req.user.id,
      objectId: objectId
    });

    await rep.send(favourite);
  }

  static async handleUserFavouritePerson(req, rep) {
    const personId = req.body.personId;

    const favourite = await this.models.userCollectionsPersonFavourite.create({
      userId: req.user.id,
      personId: personId
    });

    await rep.send(favourite);
  }

  static async handleUserUnfavouriteObject(req, rep) {
    const objectId = req.params.objectId;

    await this.models.userCollectionsObjectFavourite.destroy({
      where: {
        userId: req.user.id,
        objectId: objectId
      }
    });

    await rep.send();
  }

  static async handleUserUnfavouritePerson(req, rep) {
    const personId = req.params.personId;

    await this.models.userCollectionsPersonFavourite.destroy({
      where: {
        userId: req.user.id,
        personId: personId
      }
    });

    await rep.send();
  }
}

module.exports = UserFavouriteController;