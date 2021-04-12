import menu from '../controllers/menuController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainMenusRouter = require('express').Router();

MainMenusRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.menus.create), menu.createMenu)
    .get(verifyToken, checkRoleAndStatus(roles.menus.getAll), menu.getAllMenus);
MainMenusRouter.route('/:id')
    .put(verifyToken, checkRoleAndStatus(roles.menus.update), menu.updateMenu)
    .get(verifyToken, checkRoleAndStatus(roles.menus.getId), menu.getMenuById)
    .delete(verifyToken, checkRoleAndStatus(roles.menus.delete), menu.deleteMenu);
MainMenusRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.menus.update), menu.activate);
MainMenusRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.menus.update), menu.deactivate);

module.exports = MainMenusRouter;