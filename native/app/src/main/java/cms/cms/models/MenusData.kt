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
        var status: String,
        val elements: Array<MenuElement>,
        val _id: String
) {}

data class MenuElement(
        val _id: String,
        var text: String,
        val url: String
) {}
