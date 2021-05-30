package cms.cms.models

data class DictionariesResponse(
    val code: Integer,
    val status: Boolean,
    val message: String,
    val data: Array<DictionaryData>
) {}

data class DictionaryResponse(
        val code: Integer,
        val status: Boolean,
        val message: String,
        val data: DictionaryData
) {}

data class DictionaryData(
        val createdAt: String,
        val updatedAt: String,
        val code: String,
        val name: String,
        val description: String,
        var status: String,
        val dictionary: Array<DictionaryLanguage>,
        val _id: String
) {}

data class DictionaryLanguage(
        val _id: String,
        var language: String,
        var elements: Array<DictionaryElement>
)

data class DictionaryElement(
        val _id: String,
        val value: String
)