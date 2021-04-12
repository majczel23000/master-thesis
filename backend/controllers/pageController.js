import Page from '../models/pageModel';
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;
let validateFields = require('../middlewares/validators').validateFields;
let checkPageCode = require('../middlewares/validators').checkPageCode;
let validateNameAndCode = require('../middlewares/validators').validateNameAndCode;
let validatePageFields = require('../middlewares/validators').validatePageFields;

exports.createPage = async (req, res) => {
    if (req.body.metaTags)
        delete req.body.metaTags;
    if (req.body.styles)
        delete req.body.styles;
    if (req.body.contents)
        delete req.body.contents;
    req.body.status = "INACTIVE";
    const validateFieldsResult = validateFields(Page.schema.obj, req.body);
    if (!validateFieldsResult.status) {
        res.status(409).send(errorResponse(409, validateFieldsResult.message));
        return;
    }
    const validateNameAndCodeResult = validateNameAndCode(req.body.name, req.body.code, messages.pages.errors);
    if (validateNameAndCodeResult.length) {
        res.status(409).send(errorResponse(409, messages.pages.errors.nameRegexp));
        return;
    }
    const pageCode = await checkPageCode(req.body.code);
    if (pageCode) {
        res.status(404).json(errorResponse(409, messages.pages.errors.codeExists));
        return;
    } else {
        const date = new Date();
        req.body.createdAt = date;
        req.body.updatedAt = date;
        const newPage = new Page(req.body);
        newPage.save((err, page) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(successResponse(200, messages.pages.success.created, page));
            }
        })
    }
};

exports.getAllPages = (req, res) => {
    Page.find({status: { $in: ['ACTIVE', 'INACTIVE', 'DELETED'] }}, 'code name status', (err, pages) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(successResponse(200, messages.pages.success.fetched, pages));
        }
    })
};

exports.getPageById = (req, res) => {
    Page.findById(req.params.id, (err, page) => {
        if (err) {
            res.send(err);
        } else if (page) {
            res.status(200).json(successResponse(200, messages.pages.success.fetched, page));
        } else {
            res.status(404).json(errorResponse(404, messages.pages.errors.idNotFound));
        }
    })
};

exports.deletePage = (req, res) => {
    Page.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true }, (err, page) => {
        if (err) {
            res.send(err);
        } else if (page) {
            res.status(200).json(successResponse(200, messages.pages.success.removed, page));
        } else {
            res.status(404).json(errorResponse(404, messages.pages.errors.idNotFound));
        }
    })
};

exports.activate = (req, res) => {
    Page.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, page) => {
        if (err) {
            res.send(err);
        } else if (page) {
            res.status(200).json(successResponse(200, messages.pages.success.activated, page));
        } else {
            res.status(404).json(errorResponse(404, messages.pages.errors.idNotFound));
        }
    })
};

exports.deactivate = (req, res) => {
    Page.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, page) => {
        if (err) {
            res.send(err);
        } else if (page) {
            res.status(200).json(successResponse(200, messages.pages.success.deactivated, page));
        } else {
            res.status(404).json(errorResponse(404, messages.pages.errors.idNotFound));
        }
    })
};

exports.updatePage = (req, res) => {
    if (req.body.code)
        delete req.body.code;
    if (req.body.createdAt)
        delete req.body.createdAt;
    req.body.updatedAt = new Date();
    if (req.body.status)
        delete req.body.status;
    if (!req.body.metaTags) {
        delete req.body.metaTags;
    }
    if (!req.body.styles) {
        delete req.body.styles;
    }
    if (!req.body.contents) {
        delete req.body.contents;
    }
    const validatePageFieldsResult = validatePageFields(req.body.metaTags, req.body.styles, req.body.contents, messages.pages.errors);
    if (!validatePageFieldsResult.length){
        Page.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, page) => {
            if (err) {
                res.send(err);
            } else if (page){
                console.log(page.name);
                res.status(200).json(successResponse(200, messages.pages.success.updated, page));
            } else {
                res.status(404).json(errorResponse(404, messages.pages.errors.idNotFound));
            }
        })
    } else {
        res.status(409).json(errorResponse(409, validatePageFieldsResult));
    }
};