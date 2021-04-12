module.exports = {
    success: function(code, message, data) {
        return {
            code: code,
            status: true,
            message: message,
            data: data
        }
    }
}