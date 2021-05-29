package cms.cms.ui.user

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
import cms.cms.models.RolesResponse
import cms.cms.models.UserResponse
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
import org.json.JSONArray
import retrofit2.Response

class UserDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var rolesData: RolesResponse
    private lateinit var userData: UserResponse
    private var tableRoles: TableLayout? = null
    private lateinit var modifyUserBtn: Button
    private lateinit var removeUserBtn: Button
    private var selectedRoles = ArrayList<String>()
    private lateinit var email: EditText
    private lateinit var password: EditText
    private lateinit var firstName: EditText
    private lateinit var lastName: EditText
    private lateinit var createdAt: TextView
    private lateinit var updatedAt: TextView
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
            val response = service.getUser(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    userData = Gson().fromJson<UserResponse>(jsonResponse, UserResponse::class.java)
                    firstName.setText(userData.data.firstName)
                    lastName.setText(userData.data.lastName)
                    email.setText(userData.data.email)
                    createdAt.text = userData.data.createdAt
                    updatedAt.text = userData.data.updatedAt
                    status.text = userData.data.status
                    locationText.text = "Location: users > ${userData.data.email}"
                    title.text = "User details: ${userData.data.firstName} ${userData.data.lastName}"

                    val response2 = service.getRoles("Bearer " + token)
                    withContext(Dispatchers.Main) {
                        if (response2.isSuccessful) {
                            val jsonResponse = JsonParser.parseString(response2.body()?.string()).toString()
                            rolesData = Gson().fromJson<RolesResponse>(jsonResponse, RolesResponse::class.java)
                            displayRoles()
                            spinner.visibility = View.GONE
                            ll.visibility = View.VISIBLE
                        } else {
                            Log.e("RETROFIT_ERROR", response2.toString())
                        }
                    }

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
        val root = inflater.inflate(R.layout.fragment_user_details, container, false)
        cl = root.findViewById(R.id.user_details_parent)
        sv = root.findViewById(R.id.user_details_scrollview)
        ll = root.findViewById(R.id.user_details_layout)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.user_details_location_text)
        title = root.findViewById(R.id.user_details_title)
        tableRoles = root.findViewById(R.id.table_roles)
        email = root.findViewById(R.id.user_details_email)
        password = root.findViewById(R.id.user_details_password)
        firstName = root.findViewById(R.id.user_details_first_name)
        lastName = root.findViewById(R.id.user_details_last_name)
        createdAt = root.findViewById(R.id.user_details_created_at)
        updatedAt = root.findViewById(R.id.user_details_updated_at)
        status = root.findViewById(R.id.user_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifyUserBtn = root.findViewById(R.id.modify_user_btn)
        modifyUserBtn.setOnClickListener{
            modifyUser()
        }
        removeUserBtn = root.findViewById(R.id.remove_user_btn)
        removeUserBtn.setOnClickListener{
            removeUser()
        }
        val userListBtn: Button = root.findViewById(R.id.users_list_btn)
        userListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_users)
        }
        val userAddBtn: Button = root.findViewById(R.id.users_add_btn)
        userAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_users_add)
        }
        return root
    }

    fun displayRoles() {
        var i = 0
        var row = TableRow(activity)
        for (role in rolesData.data) {
            val checkbox = CheckBox(activity)
            checkbox.setText(role.code)
            val params: TableRow.LayoutParams = TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.WRAP_CONTENT, 1f)
            checkbox.setLayoutParams(params)
            if (userData.data.roles.contains(role.code)) {
                checkbox.isChecked = true
                selectedRoles.add(role.code)
            }
            checkbox.setOnCheckedChangeListener{ _, isChecked ->
                if (isChecked) {
                    selectedRoles.add(role.code)
                } else {
                    selectedRoles.remove(role.code)
                }
            }
            if (i == 0) {
                row = TableRow(activity)
                row.setPadding(0, 10, 0, 10)
                row.addView(checkbox)
                i++
            } else {
                row.addView(checkbox)
                tableRoles?.addView(row)
                i--
            }
        }
    }

    fun modifyUser() {
        if (email.text.toString().isEmpty() || firstName.text.toString().isEmpty() ||
                lastName.text.toString().isEmpty() || password.text.toString().isEmpty()) {
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
        val jsonRoles = JSONArray(selectedRoles)
        jsonObject.put("firstName", firstName.text.toString())
        jsonObject.put("lastName", lastName.text.toString())
        jsonObject.put("password", password.text.toString())
        jsonObject.put("roles", jsonRoles)
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.modifyUser(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val userResData = Gson().fromJson<UserResponse>(jsonResponse, UserResponse::class.java)
                    val snack = Snackbar.make(cl, userResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    email.setText(userResData.data.email)
                    firstName.setText(userResData.data.firstName)
                    lastName.setText(userResData.data.lastName)
                    createdAt.text = userResData.data.createdAt
                    updatedAt.text = userResData.data.updatedAt
                    password.setText("")
                    selectedRoles.clear()
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeUserApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeUser(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_users)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeUser() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeUserApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove user")
            setMessage("Are you sure you want to remove this user?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

    fun changeStatus() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            changeStatusApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Change status")
            setMessage("Are you sure you want to change status of this user?")
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
            if (userData.data.status == "ACTIVE") {
                response = service.deactivateUser(id, "Bearer " + token)
            } else {
                response = service.activateUser(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val userResData = Gson().fromJson<UserResponse>(jsonResponse, UserResponse::class.java)
                    val snack = Snackbar.make(cl, userResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (userData.data.status === "ACTIVE") {
                        userData.data.status = "INACTIVE"
                    } else {
                        userData.data.status = "ACTIVE"
                    }
                    status.text = userData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

}