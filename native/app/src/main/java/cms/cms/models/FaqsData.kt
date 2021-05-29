package cms.cms.models

data class FaqsResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: Array<FaqData>
) {}

data class FaqResponse(
        val code: Integer,
        val status: Boolean,
        val message: String,
        val data: FaqData
) {}

data class FaqData(
        val createdAt: String,
        val updatedAt: String,
        val code: String,
        val name: String,
        val description: String,
        val status: String,
        val elements: Array<FaqElement>,
        val _id: String
) {}

data class FaqElement(
        val _id: String,
        val question: String,
        val answear: String
)