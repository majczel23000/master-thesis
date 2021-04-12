import Role from '../models/roleModel.js';
let errorResponse = require('../models/errorResponseModel').error;
let successResponse = require('../models/successResponseModel').success;
let messages = require('../environments/environments').messages;

exports.getAllRoles = (req, res) => {
    Role.find({}, (err, roles) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(
                successResponse(
                    200, messages.roles.success.fetched, roles
                )
            );
        }
    })
}

exports.getRoleById = (req, res) => {
    Role.findById(req.params.id, (err, role) => {
        if (err) {
            res.send(err);
        } else if (role) {
            res.status(200).json(
                successResponse(200, messages.roles.success.fetched, role)
            );
        } else {
            res.status(404).json(
                errorResponse(404, messages.roles.errors.idNotFound)
            );
        }  
    });
};

exports.updateRole = (req, res) => {
    req.body.updatedAt = new Date();
    Role.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, role) => {
        if (err) {
            res.send(err);
        } else if (role) {
            res.status(200).json(
                successResponse(200, messages.roles.success.updated, role)
            );
        } else {
            res.status(404).json(
                errorResponse(404, messages.roles.errors.idNotFound)
            );
        }
    })
};

exports.activate = (req, res) => {
    if (req.body.code.includes('ROLES')) {
        res.status(401).json(errorResponse(401, messages.global.errors.permission));
    } else {
        Role.findByIdAndUpdate(req.params.id, { status: 'ACTIVE', updatedAt: new Date() }, { new: true }, (err, role) => {
            if (err) {
                res.send(err);
            } else if (role) {
                res.status(200).json(successResponse(200, messages.roles.success.activated));
            } else {
                res.status(404).json(errorResponse(404, messages.roles.errors.idNotFound));
            }
        })
    }
}

exports.deactivate = (req, res) => {
    if (req.body.code.includes('ROLES')) {
        res.status(401).json(errorResponse(401, messages.global.errors.permission));
    } else {
        Role.findByIdAndUpdate(req.params.id, { status: 'INACTIVE', updatedAt: new Date() }, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            } else if (user) {
                res.status(200).json(successResponse(200, messages.roles.success.deactivated));
            } else {
                res.status(404).json(errorResponse(404, messages.roles.errors.idNotFound));
            }
        })
    }
}
