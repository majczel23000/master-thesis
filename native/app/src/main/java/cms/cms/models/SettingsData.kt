package cms.cms.models

data class SettingsResponse(
        val code: Integer,
        val status: Boolean,
        val message: String,
        val data: Array<Setting>
) {}

data class SettingResponse(
        val code: Integer,
        val message: String,
        val status: Boolean,
        val data: Setting
) {}

data class Setting(
        val createdAt: String,
        val updatedAt: String,
        val code: String,
        val description: String,
        val name: String,
        var status: String,
        var value: String,
        var type: String,
        val _id: String
) {}