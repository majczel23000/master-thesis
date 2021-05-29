package cms.cms.models

data class RolesResponse(
    val code: Integer,
    val status: Boolean,
    val data: Array<Role>
) {}

data class RoleResponse(
    val code: Integer,
    val message: String,
    val status: Boolean,
    val data: Role
) {}

data class Role(
        val createdAt: String,
        val code: String,
        val description: String,
        val name: String,
        var status: String,
        val _id: String
) {}