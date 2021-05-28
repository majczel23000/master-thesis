package cms.cms.models

data class UserResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: UserData
) {}