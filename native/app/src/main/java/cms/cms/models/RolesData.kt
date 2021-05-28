package cms.cms.models

data class RolesResponse(
    val code: Integer,
    val status: Boolean,
    val data: Array<Role>
) {}

data class Role(
    val createdAt: String,
    val code: String,
    val description: String,
    val name: String,
    val status: String,
    val _id: String
) {}