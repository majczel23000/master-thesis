import role from '../controllers/roleController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainRolesRouter = require('express').Router();

MainRolesRouter.route('/')
    .get(role.getAllRoles);
MainRolesRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.roles.getId), role.getRoleById)
    .put(verifyToken, checkRoleAndStatus(roles.roles.update), role.updateRole);
MainRolesRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.users.update), role.activate);
MainRolesRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.users.update), role.deactivate);

module.exports = MainRolesRouter;