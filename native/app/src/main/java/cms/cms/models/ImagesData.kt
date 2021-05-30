package cms.cms.models

data class ImagesResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: Array<ImageData>
) {}

data class ImageResponse(
        val code: Integer,
        val status: Boolean,
        val message: String,
        val data: ImageData
) {}

data class ImageData(
        val createdAt: String,
        val updatedAt: String,
        val code: String,
        val name: String,
        val image: String,
        var status: String,
        val _id: String
) {}