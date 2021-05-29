package cms.cms.models

data class LoginResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: LoginData
) {}

data class LoginData(
    val token: String,
    val user: UserData
) {}

data class UserData(
        val createdAt: String,
        val updatedAt: String,
        val email: String,
        val firstName: String,
        val lastName: String,
        val password: String,
        val roles: Array<String>,
        var status: String,
        val _id: String
) {}