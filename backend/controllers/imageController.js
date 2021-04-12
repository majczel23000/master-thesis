import Image from '../models/imageModel';
import Menu from "../models/menuModel";
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let checkImageCode = require('../middlewares/validators').checkImageCode;

exports.addImage = async (req, res) => {
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Image.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    if (req.body.code.length < 5) {
        res.status(409).send(errorResponse(409, messages.images.errors.codeLength));
        return;
    } else if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.code))) {
        console.log('wrong');
        res.status(409).send(errorResponse(409, messages.images.errors.codeRegexp));
        return;
    }
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.images.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.images.errors.nameRegexp));
        return;
    }
    const imageCode = await checkImageCode(req.body.code);
    if (imageCode) {
        res.status(404).json(errorResponse(409, messages.images.errors.codeExists));
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newImage = new Image(req.body);
        newImage.save((err, img) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.images.success.created, img));
            }
        })
    }
}

exports.getAllImages = (req, res) => {
    Image.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status image', (err, images) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.images.success.fetched, images));
        }
    })
};

exports.getImageById = (req, res) => {
    Image.findById(req.params.id, (err, image) => {
        if (err) {
            res.send(err);
        } else if (image) {
            res.status(200).json(successResponse(200, messages.images.success.fetched, image));
        } else {
            res.status(404).json(errorResponse(404, messages.images.errors.idNotFound));
        }
    })
};

exports.deleteImage = (req, res) => {
    Image.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.images.success.removed));
        }
    })
};

exports.activate = (req, res) => {
    Image.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, image) => {
        if (err) {
            res.send(err);
        } else if (image) {
            res.status(200).json(successResponse(200, messages.images.success.activated, image));
        } else {
            res.status(404).json(errorResponse(404, messages.images.errors.idNotFound));
        }
    })
};

exports.deactivate = (req, res) => {
    Image.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, image) => {
        if (err) {
            res.send(err);
        } else if (image) {
            res.status(200).json(successResponse(200, messages.images.success.deactivated, image));
        } else {
            res.status(404).json(errorResponse(404, messages.images.errors.idNotFound));
        }
    })
};