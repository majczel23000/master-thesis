let errorResponse = require('../models/errorResponseModel').error;
let jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: function(req, res, next) {

        if(!req.headers.authorization) {
            return res.status(401).json(errorResponse(401, 'Unauthorized request'));
        }
        let token = req.headers.authorization.split(' ')[1]
        if(token === 'null') {
            return res.status(401).json(errorResponse(401, 'Unauthorized request'));    
        }
        let payload = jwt.verify(token, 'secretKey')
        if(!payload) {
            return res.status(401).json(errorResponse(401, 'Unauthorized request'));    
        }
        req.user = payload.subject;
        next()
    }
}