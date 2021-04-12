import page from '../controllers/pageController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainPagesRouter = require('express').Router();

MainPagesRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.pages.create), page.createPage)
    .get(verifyToken, checkRoleAndStatus(roles.pages.getAll), page.getAllPages);
MainPagesRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.pages.getId), page.getPageById)
    .delete(verifyToken, checkRoleAndStatus(roles.pages.delete), page.deletePage)
    .put(verifyToken, checkRoleAndStatus(roles.pages.update), page.updatePage);
MainPagesRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.pages.update), page.activate);
MainPagesRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.pages.update), page.deactivate);

module.exports = MainPagesRouter;