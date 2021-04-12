import Carousel from '../models/carouselModel';
import Dictionary from "../models/dictionaryModel";
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let checkCarouselCode = require('../middlewares/validators').checkCarouselCode;

exports.createCarousel = async (req, res) => {
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Carousel.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    if (req.body.code.length < 5) {
        res.status(409).send(errorResponse(409, messages.carousels.errors.codeLength));
        return;
    } else if (!(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_ ,.'-]+$/u.test(req.body.code))) {
        res.status(409).send(errorResponse(409, messages.carousels.errors.codeRegexp));
        return;
    }
    if (req.body.name.length < 5) {
        res.status(409).send(errorResponse(409, messages.carousels.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.carousels.errors.nameRegexp));
        return;
    }

    const carouselCode = await checkCarouselCode(req.body.code);
    if (carouselCode) {
        res.status(404).json(errorResponse(409, messages.carousels.errors.codeExists));
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newCarousel = new Carousel(req.body);
        newCarousel.save((err, car) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.carousels.success.created, car));
            }
        })
    }
};

exports.getAllCarousels = (req, res) => {
    Carousel.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status', (err, car) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.carousels.success.fetched, car));
        }
    })
};

exports.getCarouselById = (req, res) => {
    Carousel.findById(req.params.id, (err, car) => {
        if (err) {
            res.send(err);
        } else if (car) {
            res.status(200).json(successResponse(200, messages.carousels.success.fetched, car));
        } else {
            res.status(404).json(errorResponse(404, messages.carousels.errors.idNotFound));
        }
    })
};

exports.deleteCarousel = (req, res) => {
    Carousel.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true }, (err, car) => {
        if (err) {
            res.send(err);
        } else if (car) {
            res.status(200).json(successResponse(200, messages.carousels.success.removed, car));
        } else {
            res.status(404).json(errorResponse(404, messages.carousels.errors.idNotFound));
        }
    })
};

exports.activate = (req, res) => {
    Carousel.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, car) => {
        if (err) {
            res.send(err);
        } else if (car) {
            res.status(200).json(successResponse(200, messages.carousels.success.activated, car));
        } else {
            res.status(404).json(errorResponse(404, messages.carousels.errors.idNotFound));
        }
    })
};

exports.deactivate = (req, res) => {
    Carousel.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, car) => {
        if (err) {
            res.send(err);
        } else if (car) {
            res.status(200).json(successResponse(200, messages.carousels.success.deactivated, car));
        } else {
            res.status(404).json(errorResponse(404, messages.carousels.errors.idNotFound));
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
        res.status(409).send(errorResponse(409, messages.carousels.errors.codeLength));
        return;
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(req.body.name))) {
        res.status(409).send(errorResponse(409, messages.carousels.errors.nameRegexp));
        return;
    }

    Carousel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, car) => {
        if (err) {
            res.send(err);
        } else if (car) {
            res.status(200).json(successResponse(200, messages.carousels.success.updated, car));
        } else {
            res.status(409).json(errorResponse(409, messages.carousels.errors.idNotFound));
        }
    })
}