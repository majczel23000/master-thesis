package cms.cms.ui.user

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
import org.json.JSONArray

class UserAddFragment : Fragment() {

    private lateinit var rolesData: RolesResponse
    private var tableRoles: TableLayout? = null
    private lateinit var registerUserBtn: Button
    private var selectedRoles = ArrayList<String>()
    private lateinit var email: EditText
    private lateinit var password: EditText
    private lateinit var firstName: EditText
    private lateinit var lastName: EditText
    private lateinit var cl: ConstraintLayout
    private lateinit var sv: ScrollView

    override fun onResume() {
        super.onResume()
        var sp = activity?.getSharedPreferences("SP", Context.MODE_PRIVATE)
        var token = sp?.getString("TOKEN", "Empty")
        // Create Retrofit
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        // Create Service
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.getRoles("Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    rolesData = Gson().fromJson<RolesResponse>(jsonResponse, RolesResponse::class.java)
                    displayRoles()
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
        val root = inflater.inflate(R.layout.fragment_user_add, container, false)
        cl = root.findViewById(R.id.user_add_parent)
        sv = root.findViewById(R.id.user_add_scrollview)
        tableRoles = root.findViewById(R.id.table_roles)
        email = root.findViewById(R.id.add_user_email)
        firstName = root.findViewById(R.id.add_user_firstname)
        lastName = root.findViewById(R.id.add_user_lastname)
        password = root.findViewById(R.id.add_user_password)
        registerUserBtn = root.findViewById(R.id.register_user_btn)
        registerUserBtn.setOnClickListener{
            registerUser()
        }
        val userListBtn: Button = root.findViewById(R.id.users_list_btn)
        userListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_users)
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

    fun registerUser() {
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
        jsonObject.put("email", email.text.toString())
        jsonObject.put("password", password.text.toString())
        jsonObject.put("firstName", firstName.text.toString())
        jsonObject.put("lastName", lastName.text.toString())
        jsonObject.put("roles", jsonRoles)
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.addUser(requestBody)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val addData = Gson().fromJson<UserResponse>(jsonResponse, UserResponse::class.java)
                    val snack = Snackbar.make(cl, addData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    email.setText("")
                    firstName.setText("")
                    lastName.setText("")
                    password.setText("")
                    selectedRoles.clear()
                } else {
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

}