package cms.cms.ui.setting

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
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
import cms.cms.models.RoleResponse
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
import okhttp3.ResponseBody
import retrofit2.Response

class SettingDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var settingData: SettingResponse
    private lateinit var modifySettingBtn: Button
    private lateinit var removeSettingBtn: Button
    private lateinit var name: EditText
    private lateinit var description: EditText
    private lateinit var type: EditText
    private lateinit var value: EditText
    private lateinit var createdAt: TextView
    private lateinit var updatedAt: TextView
    private lateinit var code: TextView
    private lateinit var status: TextView
    private lateinit var locationText: TextView
    private lateinit var title: TextView
    private lateinit var cl: ConstraintLayout
    private lateinit var sv: ScrollView
    private lateinit var ll: LinearLayout
    private lateinit var spinner: ProgressBar

    override fun onResume() {
        super.onResume()
        id = arguments?.getString("id")
        var sp = activity?.getSharedPreferences("SP", Context.MODE_PRIVATE)
        token = sp?.getString("TOKEN", "Empty")
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.getSetting(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    settingData = Gson().fromJson<SettingResponse>(jsonResponse, SettingResponse::class.java)
                    code.setText(settingData.data.code)
                    name.setText(settingData.data.name)
                    description.setText(settingData.data.description)
                    type.setText(settingData.data.type)
                    value.setText(settingData.data.value)
                    createdAt.text = settingData.data.createdAt
                    updatedAt.text = settingData.data.updatedAt
                    status.text = settingData.data.status
                    locationText.text = "Location: settings > ${settingData.data.code}"
                    title.text = "Setting details: ${settingData.data.code}"
                    spinner.visibility = View.GONE
                    ll.visibility = View.VISIBLE
                } else {
                    Log.e("RETROFIT_ERROR", response.toString())
                }
            }
        }
    }

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_setting_details, container, false)
        cl = root.findViewById(R.id.setting_details_parent)
        sv = root.findViewById(R.id.setting_details_scrollview)
        ll = root.findViewById(R.id.setting_details_layout)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.setting_details_location_text)
        title = root.findViewById(R.id.setting_details_title)
        code = root.findViewById(R.id.setting_details_code)
        name = root.findViewById(R.id.setting_details_name)
        description = root.findViewById(R.id.setting_details_description)
        createdAt = root.findViewById(R.id.setting_details_created_at)
        updatedAt = root.findViewById(R.id.setting_details_updated_at)
        type = root.findViewById(R.id.setting_details_type)
        value = root.findViewById(R.id.setting_details_value)
        status = root.findViewById(R.id.setting_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifySettingBtn = root.findViewById(R.id.modify_setting_btn)
        modifySettingBtn.setOnClickListener{
            modifySetting()
        }
        removeSettingBtn = root.findViewById(R.id.remove_setting_btn)
        removeSettingBtn.setOnClickListener{
            removeSetting()
        }
        val settingListBtn: Button = root.findViewById(R.id.settings_list_btn)
        settingListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_settings)
        }
        val settingAddBtn: Button = root.findViewById(R.id.settings_add_btn)
        settingAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_settings_add)
        }
        return root
    }

    fun modifySetting() {
        if (name.text.toString().isEmpty() || description.text.toString().isEmpty()
                || type.text.toString().isEmpty() || value.text.toString().isEmpty()) {
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
        jsonObject.put("name", name.text.toString())
        jsonObject.put("description", description.text.toString())
        jsonObject.put("type", type.text.toString())
        jsonObject.put("value", value.text.toString())
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.modifySetting(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val settingResData = Gson().fromJson<SettingResponse>(jsonResponse, SettingResponse::class.java)
                    val snack = Snackbar.make(cl, settingResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    name.setText(settingResData.data.name)
                    description.setText(settingResData.data.description)
                    type.setText(settingResData.data.type)
                    value.setText(settingResData.data.value)
                    createdAt.text = settingResData.data.createdAt
                    updatedAt.text = settingResData.data.updatedAt
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun changeStatus() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            changeStatusApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Change status")
            setMessage("Are you sure you want to change status of this setting?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

    fun changeStatusApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody>?
            if (settingData.data.status == "ACTIVE") {
                response = service.deactivateSetting(id, "Bearer " + token)
            } else {
                response = service.activateSetting(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val settingResData = Gson().fromJson<SettingResponse>(jsonResponse, SettingResponse::class.java)
                    val snack = Snackbar.make(cl, settingResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (settingData.data.status === "ACTIVE") {
                        settingData.data.status = "INACTIVE"
                    } else {
                        settingData.data.status = "ACTIVE"
                    }
                    status.text = settingData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeSettingApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeSetting(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_settings)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeSetting() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeSettingApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove setting")
            setMessage("Are you sure you want to remove this setting?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

}