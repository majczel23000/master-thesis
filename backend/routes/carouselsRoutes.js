import carousels from '../controllers/carouselController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainCarouselsRouter = require('express').Router();

MainCarouselsRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.carousels.create), carousels.createCarousel)
    .get(verifyToken, checkRoleAndStatus(roles.carousels.getAll), carousels.getAllCarousels);
MainCarouselsRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.carousels.getId), carousels.getCarouselById)
    .delete(verifyToken, checkRoleAndStatus(roles.carousels.delete), carousels.deleteCarousel)
    .put(verifyToken, checkRoleAndStatus(roles.carousels.update), carousels.update);
MainCarouselsRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.carousels.update), carousels.activate);
MainCarouselsRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.carousels.update), carousels.deactivate);

module.exports = MainCarouselsRouter;