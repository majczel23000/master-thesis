package cms.cms.ui.role

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

class RoleDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var roleData: RoleResponse
    private lateinit var modifyRoleBtn: Button
    private lateinit var name: EditText
    private lateinit var description: EditText
    private lateinit var createdAt: TextView
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
            val response = service.getRole(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    roleData = Gson().fromJson<RoleResponse>(jsonResponse, RoleResponse::class.java)
                    code.setText(roleData.data.code)
                    name.setText(roleData.data.name)
                    description.setText(roleData.data.description)
                    createdAt.text = roleData.data.createdAt
                    status.text = roleData.data.status
                    locationText.text = "Location: roles > ${roleData.data.code}"
                    title.text = "Role details: ${roleData.data.code}"
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
        val root = inflater.inflate(R.layout.fragment_role_details, container, false)
        cl = root.findViewById(R.id.role_details_parent)
        sv = root.findViewById(R.id.role_details_scrollview)
        ll = root.findViewById(R.id.role_details_layout)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.role_details_location_text)
        title = root.findViewById(R.id.role_details_title)
        code = root.findViewById(R.id.role_details_code)
        name = root.findViewById(R.id.role_details_name)
        description = root.findViewById(R.id.role_details_description)
        createdAt = root.findViewById(R.id.role_details_created_at)
        status = root.findViewById(R.id.role_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifyRoleBtn = root.findViewById(R.id.modify_role_btn)
        modifyRoleBtn.setOnClickListener{
            modifyRole()
        }
        val roleListBtn: Button = root.findViewById(R.id.roles_list_btn)
        roleListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_roles)
        }
        return root
    }

    fun modifyRole() {
        if (name.text.toString().isEmpty() || description.text.toString().isEmpty()) {
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
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.modifyRole(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val roleResData = Gson().fromJson<RoleResponse>(jsonResponse, RoleResponse::class.java)
                    val snack = Snackbar.make(cl, roleResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    name.setText(roleResData.data.name)
                    description.setText(roleResData.data.description)
                    createdAt.text = roleResData.data.createdAt
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
            setMessage("Are you sure you want to change status of this role?")
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
            val jsonObject = JSONObject()
            jsonObject.put("code", code.text.toString())
            val jsonObjectString = jsonObject.toString()
            val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
            if (roleData.data.status == "ACTIVE") {
                response = service.deactivateRole(id, "Bearer " + token, requestBody)
            } else {
                response = service.activateRole(id, "Bearer " + token, requestBody)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val roleResData = Gson().fromJson<RoleResponse>(jsonResponse, RoleResponse::class.java)
                    val snack = Snackbar.make(cl, roleResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (roleData.data.status === "ACTIVE") {
                        roleData.data.status = "INACTIVE"
                    } else {
                        roleData.data.status = "ACTIVE"
                    }
                    status.text = roleData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

}