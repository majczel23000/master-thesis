package cms.cms.models

data class UsersResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: Array<UserData>
) {}