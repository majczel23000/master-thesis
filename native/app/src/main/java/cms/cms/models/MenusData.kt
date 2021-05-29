package cms.cms.models

data class MenusResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: Array<MenuData>
) {}

data class MenuResponse(
        val code: Integer,
        val status: Boolean,
        val message: String,
        val data: MenuData
) {}

data class MenuData(
        val createdAt: String,
        val updatedAt: String,
        val code: String,
        val name: String,
        val description: String,
        val status: String,
        val dictionary: Array<MenuLanguage>,
        val _id: String
) {}

data class MenuLanguage(
        val _id: String,
        val language: String,
        val elements: Array<MenuElement>
)

data class MenuElement(
        val _id: String,
        val value: String
)