import User from "../models/userModel";

let errorResponse = require('../models/errorResponseModel').error;
let messages = require('../environments/environments').messages;
let roleController = require('../controllers/roleController');
import Role from '../models/roleModel.js';
let jwt = require('jsonwebtoken');

module.exports = {
    checkRoleAndStatus: function(roleName) {
        return (request, response, next) => {
            User.findById(request.user._id, (err, user) => {
                if (user) {
                    jwt.sign({ subject: user }, 'secretKey');
                    if (!user.roles.length) {
                        return response.status(401).json(errorResponse(401, messages.global.errors.permission));
                    } else if (user.status === 'INACTIVE') {
                        return response.status(401).json(errorResponse(401, messages.global.errors.userInactive));
                    } else if (user.status === 'DELETED') {
                        return response.status(401).json(errorResponse(401, messages.global.errors.userDeleted));
                    } else {
                        let status = false;
                        for (let i = 0; i < user.roles.length; i++) {
                            if (user.roles[i] === roleName) {
                                status = true;
                                Role.find({code: roleName}, (err, role) => {
                                    if (role[0].status === 'ACTIVE') {
                                        next()
                                    } else if (role[0].status === 'INACTIVE') {
                                        return response.status(401).json(errorResponse(401, messages.global.errors.roleInactive));
                                    }
                                });
                            }
                        }
                        if (!status) {
                            return response.status(401).json(errorResponse(401, messages.global.errors.permission));
                        }
                    }
                } else {
                    return response.status(401).json(errorResponse(401, messages.global.errors.permission));
                }
            });
        }
    }
}