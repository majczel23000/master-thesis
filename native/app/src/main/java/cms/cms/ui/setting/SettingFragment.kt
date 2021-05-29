package cms.cms.ui.setting

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import cms.cms.APIService
import cms.cms.R
import cms.cms.constants
import cms.cms.models.SettingsResponse
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit

class SettingFragment : Fragment() {

    private lateinit var settingsData: SettingsResponse
    private lateinit var table: TableLayout
    private lateinit var paginationText: TextView
    private lateinit var nextBtn: Button
    private lateinit var prevBtn: Button
    private var page: Int = 1
    private var itemsPerPage: Int = 5
    private var rows: ArrayList<TableRow> = arrayListOf<TableRow>()
    private lateinit var spinner: ProgressBar

    override fun onResume() {
        super.onResume()
        page = 1
        itemsPerPage = 5
        var sp = activity?.getSharedPreferences("SP", Context.MODE_PRIVATE)
        var token = sp?.getString("TOKEN", "Empty")
        // Create Retrofit
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        // Create Service
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.getSettings("Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    settingsData = Gson().fromJson<SettingsResponse>(jsonResponse, SettingsResponse::class.java)
                    displayData()
                    spinner.visibility = View.GONE
                    table.visibility = View.VISIBLE
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
        val root = inflater.inflate(R.layout.fragment_setting, container, false)
        table = root.findViewById(R.id.settings_table)
        spinner = root.findViewById(R.id.loading_spinner)
        paginationText = root.findViewById(R.id.settings_pagination)
        nextBtn = root.findViewById(R.id.settings_pagination_next_btn)
        prevBtn = root.findViewById(R.id.settings_pagination_prev_btn)
        nextBtn.setOnClickListener{
            page += 1;
            for (row in rows) {
                table!!.removeView(row)
            }
            rows.clear()
            displayData()
        }
        prevBtn.setOnClickListener{
            if (page > 1) {
                page -= 1
                for (row in rows) {
                    table!!.removeView(row)
                }
                rows.clear()
                displayData()
            }
        }
        val addSettingBtn: Button = root.findViewById(R.id.add_setting_btn)
        addSettingBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_settings_add)
        }
        return root
    }

    fun displayData() {
        var to = (page-1)*itemsPerPage + itemsPerPage - 1
        if (to > settingsData.data.size) {
            to = settingsData.data.size - 1
        }
        for (setting in settingsData.data.slice((page-1)*itemsPerPage..to)) {
            val row = TableRow(activity)
            row.setPadding(0, 25, 0, 25)
            val textEmail = TextView(activity)
            textEmail.setText(setting.code)
            val textStatus = TextView(activity)
            textStatus.setText(setting.status)
            val params: TableRow.LayoutParams = TableRow.LayoutParams(0, TableRow.LayoutParams.WRAP_CONTENT, 1f)
            textStatus.setLayoutParams(params)
            textEmail.setLayoutParams(params)
            row.addView(textEmail)
            row.addView(textStatus)
            table?.addView(row, 2)
            rows.add(row)
            row.setOnClickListener{
                // TODO: przejscie na detale wedlug tego _id
                val navController = activity?.findNavController(R.id.nav_host_fragment)
                navController?.navigateUp()
                val bundle = Bundle()
                val id: String = setting._id
                bundle.putString("id", id)
                navController?.navigate(R.id.nav_settings_details, bundle)
            }
        }
        paginationText.setText("${(page-1)*itemsPerPage + 1} - ${(page-1)*itemsPerPage + itemsPerPage} of ${settingsData.data.size}")
    }

}