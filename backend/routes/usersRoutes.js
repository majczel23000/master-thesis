import user from '../controllers/userController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainUserRouter = require('express').Router();

MainUserRouter.route('/')
    .get(user.getAllUsers)
    .post(user.createUser);

MainUserRouter.route('/:id')
        .get(verifyToken, checkRoleAndStatus(roles.users.getId), user.getUserById)
        .put(verifyToken, checkRoleAndStatus(roles.users.update), user.updateUser)
        .delete(verifyToken, checkRoleAndStatus(roles.users.delete), user.deleteUser);
MainUserRouter.route('/:id/activate')
        .post(verifyToken, checkRoleAndStatus(roles.users.update), user.activate);
MainUserRouter.route('/:id/deactivate')
        .post(verifyToken, checkRoleAndStatus(roles.users.update), user.deactivate);
MainUserRouter.route('/login')
        .post(user.login);

module.exports = MainUserRouter;

