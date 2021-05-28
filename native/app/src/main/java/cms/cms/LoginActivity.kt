package cms.cms

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import cms.cms.models.LoginResponse
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import retrofit2.Retrofit


class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // try block to hide Action bar
        try {
            this.supportActionBar!!.hide()
        } // catch block to handle NullPointerException
        catch (e: NullPointerException) {
        }
        setContentView(R.layout.activity_login)
        val btn: Button = findViewById(R.id.login_btn)
        btn.setOnClickListener{
            this.loginUser()
        }
    }

    fun loginUser() {
        val email: EditText = findViewById(R.id.editTextTextEmailAddress);
        val password: EditText = findViewById(R.id.editTextTextPassword);
        if (email.text.toString().length === 0 || password.text.toString().length === 0) {
            val cl: ConstraintLayout = findViewById(R.id.login_parent)
            val snack = Snackbar.make(cl,"Please fill all fields", Snackbar.LENGTH_LONG)
            snack.show()
            return
        }
        // Make api call
        // Create Retrofit
        val retrofit = Retrofit.Builder()
            .baseUrl(constants.API_URL)
            .build()

        // Create Service
        val service = retrofit.create(APIService::class.java)

        // Create JSON using JSONObject
        val jsonObject = JSONObject()
        jsonObject.put("email", email.text.toString())
        jsonObject.put("password", password.text.toString())
        Log.d("JSON", jsonObject.toString())

        // Convert JSONObject to String
        val jsonObjectString = jsonObject.toString()

        // Create RequestBody
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())

        CoroutineScope(Dispatchers.IO).launch {
            // Do the POST request and get response
            val response = service.loginUser(requestBody)

            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    Log.d("t", jsonResponse)
                    val loginData = Gson().fromJson<LoginResponse>(jsonResponse, LoginResponse::class.java)
                    var sp = getSharedPreferences("SP", Context.MODE_PRIVATE)
                    sp.edit()
                        .putBoolean("LOGGED_IN", true)
                        .putString("TOKEN", loginData.data.token)
                        .commit()
                    changeView()

                } else {
                    val cl: ConstraintLayout = findViewById(R.id.login_parent)
                    val snack = Snackbar.make(cl,constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun changeView() {
        var sp = getSharedPreferences("SP", Context.MODE_PRIVATE)
        var token = sp.getString("TOKEN", "Empty")
        Log.d("TOKEN", token)
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }
}
