package cms.cms

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class InitialActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_initial)
        try {
            this.supportActionBar!!.hide()
        } // catch block to handle NullPointerException
        catch (e: NullPointerException) {
        }
        // Read logged in state on app start, then navigate to proper activity
        val sharedPref = getPreferences(Context.MODE_PRIVATE) ?: return
        var loggedIn = sharedPref.getBoolean("LOGGED_IN", false)
        // TODO: remove mock data
        loggedIn = true;

        if (!loggedIn) {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        } else {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }
    }
}