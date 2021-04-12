import Dictionary from '../models/dictionaryModel';
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let checkDictionaryCode = require('../middlewares/validators').checkDictionaryCode;

exports.createDictionary = async (req, res) => {
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Dictionary.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    if (req.body.code.length < 5) {
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.codeLength));
        return;
    } else if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_ ,.'-]+$/u.test(req.body.code))) {
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.codeRegexp));
        return;
    }
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.nameRegexp));
        return;
    }

    // for (let i = 0; i < req.body.dictionary.length; i++) {
    //     if (req.body.dictionary[i].language.length > 3) {
    //         res.status(409).send(errorResponse(409, messages.dictionaries.errors.languageLength));
    //         return;
    //     }
    //     for (let j = 0; j < req.body.dictionary[i].elements; j++) {
    //         if (req.body.dictionary[i].elements[j].length < 1) {
    //             res.status(409).send(errorResponse(409, messages.dictionaries.errors.elementsLength));
    //             return;
    //         }
    //     }
    // }

    const dictionaryCode = await checkDictionaryCode(req.body.code);
    if (dictionaryCode) {
        res.status(404).json(errorResponse(409, messages.dictionaries.errors.codeExists));
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newDictionary = new Dictionary(req.body);
        newDictionary.save((err, dict) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.dictionaries.success.created, dict));
            }
        })
    }
};

exports.getAllDictionaries = (req, res) => {
    Dictionary.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status', (err, dict) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.dictionaries.success.fetched, dict));
        }
    })
};

exports.getDictionaryById = (req, res) => {
    Dictionary.findById(req.params.id, (err, dict) => {
        if (err) {
            res.send(err);
        } else if (dict) {
            res.status(200).json(successResponse(200, messages.dictionaries.success.fetched, dict));
        } else {
            res.status(404).json(errorResponse(404, messages.dictionaries.errors.idNotFound));
        }
    })
};

exports.deleteDictionary = (req, res) => {
    Dictionary.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true }, (err, dict) => {
        if (err) {
            res.send(err);
        } else if (dict) {
            res.status(200).json(successResponse(200, messages.dictionaries.success.removed, dict));
        } else {
            res.status(404).json(errorResponse(404, messages.dictionaries.errors.idNotFound));
        }
    })
};

exports.activate = (req, res) => {
    Dictionary.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, dict) => {
        if (err) {
            res.send(err);
        } else if (dict) {
            res.status(200).json(successResponse(200, messages.dictionaries.success.activated, dict));
        } else {
            res.status(404).json(errorResponse(404, messages.dictionaries.errors.idNotFound));
        }
    })
};

exports.deactivate = (req, res) => {
    Dictionary.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, dict) => {
        if (err) {
            res.send(err);
        } else if (dict) {
            res.status(200).json(successResponse(200, messages.dictionaries.success.deactivated, dict));
        } else {
            res.status(404).json(errorResponse(404, messages.dictionaries.errors.idNotFound));
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
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.dictionaries.errors.nameRegexp));
        return;
    }

    if (req.body.dictionary && req.body.dictionary.length) {
        for (let i = 0; i < req.body.dictionary.length; i++) {
            if (req.body.dictionary[i].language.length > 3) {
                res.status(409).send(errorResponse(409, messages.dictionaries.errors.languageLength));
                return;
            }
            for (let j = 0; j < req.body.dictionary[i].elements; j++) {
                if (req.body.dictionary[i].elements[j].value.length < 1) {
                    res.status(409).send(errorResponse(409, messages.dictionaries.errors.elementsLength));
                    return;
                }
            }
        }
    }

    Dictionary.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, dict) => {
        if (err) {
            res.send(err);
        } else if (dict) {
            res.status(200).json(successResponse(200, messages.dictionaries.success.updated, dict));
        } else {
            res.status(409).json(errorResponse(409, messages.dictionaries.errors.idNotFound));
        }
    })
}