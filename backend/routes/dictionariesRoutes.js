import dictionaries from '../controllers/dictionariesController';
let verifyToken = require('../middlewares/verifyToken').verifyToken;
let checkRoleAndStatus = require('../middlewares/checkRole').checkRoleAndStatus;
let roles = require('../environments/environments').roles;

const MainDictionariesRouter = require('express').Router();

MainDictionariesRouter.route('/')
    .post(verifyToken, checkRoleAndStatus(roles.dictionaries.create), dictionaries.createDictionary)
    .get(verifyToken, checkRoleAndStatus(roles.dictionaries.getAll), dictionaries.getAllDictionaries);
MainDictionariesRouter.route('/:id')
    .get(verifyToken, checkRoleAndStatus(roles.dictionaries.getId), dictionaries.getDictionaryById)
    .delete(verifyToken, checkRoleAndStatus(roles.dictionaries.delete), dictionaries.deleteDictionary)
    .put(verifyToken, checkRoleAndStatus(roles.dictionaries.update), dictionaries.update);
MainDictionariesRouter.route('/:id/activate')
    .post(verifyToken, checkRoleAndStatus(roles.dictionaries.update), dictionaries.activate);
MainDictionariesRouter.route('/:id/deactivate')
    .post(verifyToken, checkRoleAndStatus(roles.dictionaries.update), dictionaries.deactivate);

module.exports = MainDictionariesRouter;