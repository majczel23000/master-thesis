package cms.cms.ui.setting

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import cms.cms.APIService
import cms.cms.R
import cms.cms.constants
import cms.cms.models.SettingResponse
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import retrofit2.Retrofit
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody

class SettingAddFragment : Fragment() {

    private var token: String? = ""
    private lateinit var addSettingBtn: Button
    private lateinit var code: EditText
    private lateinit var name: EditText
    private lateinit var description: EditText
    private lateinit var type: EditText
    private lateinit var value: EditText
    private lateinit var cl: ConstraintLayout
    private lateinit var sv: ScrollView

    override fun onResume() {
        super.onResume()
        var sp = activity?.getSharedPreferences("SP", Context.MODE_PRIVATE)
        token = sp?.getString("TOKEN", "Empty")
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_setting_add, container, false)
        cl = root.findViewById(R.id.setting_add_parent)
        sv = root.findViewById(R.id.setting_add_scrollview)
        code = root.findViewById(R.id.add_setting_code)
        name = root.findViewById(R.id.add_setting_name)
        description = root.findViewById(R.id.add_setting_description)
        type = root.findViewById(R.id.add_setting_type)
        value = root.findViewById(R.id.add_setting_value)
        addSettingBtn = root.findViewById(R.id.add_setting_btn)
        addSettingBtn.setOnClickListener{
            addSetting()
        }
        val settingsListBtn: Button = root.findViewById(R.id.settings_list_btn)
        settingsListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_settings)
        }
        return root
    }

    fun addSetting() {
        if (code.text.toString().isEmpty() || name.text.toString().isEmpty() ||
                description.text.toString().isEmpty() || type.text.toString().isEmpty() || value.text.toString().isEmpty()) {
            val snack = Snackbar.make(cl,"Please fill all fields", Snackbar.LENGTH_LONG)
            snack.show()
            return
        }

        // API CALL
        val retrofit = Retrofit.Builder()
            .baseUrl(constants.API_URL)
            .build()
        val service = retrofit.create(APIService::class.java)
        val jsonObject = JSONObject()
        jsonObject.put("code", code.text.toString())
        jsonObject.put("name", name.text.toString())
        jsonObject.put("description", description.text.toString())
        jsonObject.put("type", type.text.toString())
        jsonObject.put("value", value.text.toString())
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.addSetting(requestBody, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val addData = Gson().fromJson<SettingResponse>(jsonResponse, SettingResponse::class.java)
                    val snack = Snackbar.make(cl, addData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    code.setText("")
                    name.setText("")
                    description.setText("")
                    type.setText("")
                    value.setText("")
                } else {
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

}