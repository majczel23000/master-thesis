import image from '../controllers/imageController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainImagesRouter = require('express').Router();

MainImagesRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.images.create), image.addImage)
    .get(verifyToken, checkRoleAndStatus(roles.images.getAll), image.getAllImages);
MainImagesRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.images.getId), image.getImageById)
    .delete(verifyToken, checkRoleAndStatus(roles.images.delete), image.deleteImage);
MainImagesRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.images.update), image.activate);
MainImagesRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.images.update), image.deactivate);

module.exports = MainImagesRouter;