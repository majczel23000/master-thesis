module.exports = {
    error: function(code, message) {
        return {
            code: code,
            status: false,
            message: message
        }
    }
}