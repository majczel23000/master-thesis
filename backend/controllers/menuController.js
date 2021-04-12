import Menu from '../models/menuModel';
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let validateMenuElements = require('../middlewares/validators').validateMenuElements;
let checkMenuCode = require('../middlewares/validators').checkMenuCode;

// CREATE: Create new MENU and return new MENU node
exports.createMenu = async (req, res) => {
    if (req.body.elements)
        delete req.body.elements;
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Menu.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    if (req.body.code.length < 5) {
        res.status(409).send(errorResponse(409, messages.menus.errors.codeLength));
        return;
    } else if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.code))) {
        res.status(409).send(errorResponse(409, messages.menus.errors.codeRegexp));
        return;
    }
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.menus.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.menus.errors.nameRegexp));
        return;
    }

    const menuCode = await checkMenuCode(req.body.code);
    if (menuCode) {
        res.status(404).json(errorResponse(409, messages.menus.errors.codeExists));
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newMenu = new Menu(req.body);
        newMenu.save((err, menu) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.menus.success.created, menu));
            }
        })
    }
};

// GET ALL: Return all menus nodes
exports.getAllMenus = (req, res) => {
    Menu.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status', (err, menus) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.menus.success.fetched, menus));
        }
    })
};

// GET ID: Return menu with specified id
exports.getMenuById = (req, res) => {
    Menu.findById(req.params.id, (err, menu) => {
        if (err) {
            res.send(err);
        } else if (menu) {
            res.status(200).json(successResponse(200, messages.menus.success.fetched, menu));
        } else {
            res.status(404).json(errorResponse(404, messages.menus.errors.idNotFound));
        }
    })
};

// REMOVE: Remove menu (change status flag to deleted)
exports.deleteMenu = (req, res) => {
    Menu.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true }, (err, menu) => {
        if (err) {
            res.send(err);
        } else if (menu) {
            res.status(200).json(successResponse(200, messages.menus.success.removed, menu));
        } else {
            res.status(404).json(errorResponse(404, messages.menus.errors.idNotFound));
        }
    })
};

// ACTIVATE: Activate menu in database
exports.activate = (req, res) => {
    Menu.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, menu) => {
        if (err) {
            res.send(err);
        } else if (menu) {
            res.status(200).json(successResponse(200, messages.menus.success.activated, menu));
        } else {
            res.status(404).json(errorResponse(404, messages.menus.errors.idNotFound));
        }
    })
};

// DEACTIVATE: Deactivate menu in database
exports.deactivate = (req, res) => {
    Menu.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, menu) => {
        if (err) {
            res.send(err);
        } else if (menu) {
            res.status(200).json(successResponse(200, messages.menus.success.deactivated, menu));
        } else {
            res.status(404).json(errorResponse(404, messages.menus.errors.idNotFound));
        }
    })
};

// UPDATE: Updates menu and return updated menu node
exports.updateMenu = (req, res) => {
    if (req.body.code)
        delete req.body.code;
    if (req.body.createdAt)
        delete req.body.createdAt;
    req.body.updatedAt = new Date();
    if (req.body.status)
        delete req.body.status;
    if (!req.body.elements) {
        delete req.body.elements;
    }
    if (validateMenuElements(req.body.elements)){
        Menu.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, menu) => {
            if (err) {
                res.send(err);
            } else if (menu){
                res.status(200).json(successResponse(200, messages.menus.success.updated, menu));
            } else {
                res.status(404).json(errorResponse(404, messages.menus.errors.idNotFound));
            }
        })
    } else {
        res.status(406).json(errorResponse(406, messages.global.errors.incorrectArrayElements));
    }
};
