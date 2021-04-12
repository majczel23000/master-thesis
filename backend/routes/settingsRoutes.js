import settings from '../controllers/settingsController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainSettingsRouter = require('express').Router();

MainSettingsRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.settings.create), settings.createSettings)
    .get(verifyToken, checkRoleAndStatus(roles.settings.getAll), settings.getAllSettings);
MainSettingsRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.settings.getId), settings.getSettingById)
    .delete(verifyToken, checkRoleAndStatus(roles.settings.delete), settings.deleteSetting)
    .put(verifyToken, checkRoleAndStatus(roles.settings.update), settings.update);
MainSettingsRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.settings.update), settings.activate);
MainSettingsRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.settings.update), settings.deactivate);

module.exports = MainSettingsRouter;