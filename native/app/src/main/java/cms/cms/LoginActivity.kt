package cms.cms

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.snackbar.Snackbar


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
            return;
        }
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
    }
}
