import Settings from '../models/settingsModel';
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let checkSettingsCode = require('../middlewares/validators').checkSettingsCode;

exports.createSettings = async (req, res) => {
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Settings.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    if (req.body.code.length < 5) {
        res.status(409).send(errorResponse(409, messages.settings.errors.codeLength));
        return;
    } else if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_ ,.'-]+$/u.test(req.body.code))) {
        res.status(409).send(errorResponse(409, messages.settings.errors.codeRegexp));
        return;
    }
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.settings.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.settings.errors.nameRegexp));
        return;
    }

    if (!['Boolean', 'Number', 'String'].includes(req.body.type)) {
        res.status(409).send(errorResponse(409, messages.settings.errors.invalidType));
        return;
    }

    if (req.body.type === 'Boolean') {
        if (!['true', 'false', '0', '1'].includes(req.body.value)) {
            res.status(409).send(errorResponse(409, messages.settings.errors.invalidBooleanValue));
            return;
        }
    } else if (req.body.type === 'Number') {
        if (isNaN(req.body.value)) {
            res.status(409).send(errorResponse(409, messages.settings.errors.invalidNumberValue));
            return;
        }
    }

    const settingsCode = await checkSettingsCode(req.body.code);
    if (settingsCode) {
        res.status(404).json(errorResponse(409, messages.settings.errors.codeExists));
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newSettings = new Settings(req.body);
        newSettings.save((err, setting) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.settings.success.created, setting));
            }
        })
    }
};

exports.getAllSettings = (req, res) => {
    Settings.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status', (err, settings) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.settings.success.fetched, settings));
        }
    })
};

exports.getSettingById = (req, res) => {
    Settings.findById(req.params.id, (err, setting) => {
        if (err) {
            res.send(err);
        } else if (setting) {
            res.status(200).json(successResponse(200, messages.settings.success.fetched, setting));
        } else {
            res.status(404).json(errorResponse(404, messages.settings.errors.idNotFound));
        }
    })
};

exports.deleteSetting = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true }, (err, setting) => {
        if (err) {
            res.send(err);
        } else if (setting) {
            res.status(200).json(successResponse(200, messages.settings.success.removed, setting));
        } else {
            res.status(404).json(errorResponse(404, messages.settings.errors.idNotFound));
        }
    })
};

exports.activate = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, setting) => {
        if (err) {
            res.send(err);
        } else if (setting) {
            res.status(200).json(successResponse(200, messages.settings.success.activated, setting));
        } else {
            res.status(404).json(errorResponse(404, messages.settings.errors.idNotFound));
        }
    })
};

exports.deactivate = (req, res) => {
    Settings.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, setting) => {
        if (err) {
            res.send(err);
        } else if (setting) {
            res.status(200).json(successResponse(200, messages.settings.success.deactivated, setting));
        } else {
            res.status(404).json(errorResponse(404, messages.settings.errors.idNotFound));
        }
    })
};

exports.update = (req, res) => {
    if (req.body.code)
        delete req.body.code;
    if (req.body.createdAt)
        delete req.body.createdAt;
    if (req.body.updatedAt)
        delete req.body.updatedAt;
    req.body.updatedAt = new Date();
    if (req.body.status)
        delete req.body.status;
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.settings.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.settings.errors.nameRegexp));
        return;
    }

    if (!['Boolean', 'Number', 'String'].includes(req.body.type)) {
        res.status(409).send(errorResponse(409, messages.settings.errors.invalidType));
        return;
    }

    if (req.body.type === 'Boolean') {
        if (!['true', 'false', '0', '1'].includes(req.body.value)) {
            res.status(409).send(errorResponse(409, messages.settings.errors.invalidBooleanValue));
            return;
        }
    } else if (req.body.type === 'Number') {
        if (isNaN(req.body.value)) {
            res.status(409).send(errorResponse(409, messages.settings.errors.invalidNumberValue));
            return;
        }
    }

    Settings.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, setting) => {
        if (err) {
            res.send(err);
        } else if (setting) {
            res.status(200).json(successResponse(200, messages.settings.success.updated, setting));
        } else {
            res.status(409).json(errorResponse(409, messages.settings.errors.idNotFound));
        }
    })
}