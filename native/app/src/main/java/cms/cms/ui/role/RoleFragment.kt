package cms.cms.ui.role

import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
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
import cms.cms.models.Role
import cms.cms.models.RolesResponse
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit

class RoleFragment : Fragment() {

    private lateinit var rolesData: RolesResponse
    private lateinit var table: TableLayout
    private lateinit var paginationText: TextView
    private lateinit var nextBtn: Button
    private lateinit var prevBtn: Button
    private var page: Int = 1
    private var itemsPerPage: Int = 5
    private var rows: ArrayList<TableRow> = arrayListOf<TableRow>()
    private lateinit var spinner: ProgressBar
    private lateinit var filter: EditText
    private lateinit var filteredRoles: List<Role>

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
            val response = service.getRoles("Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    rolesData = Gson().fromJson<RolesResponse>(jsonResponse, RolesResponse::class.java)
                    displayData(rolesData.data.toMutableList())
                    filteredRoles = rolesData.data.toMutableList()
                    spinner.visibility = View.GONE
                    table.visibility = View.VISIBLE
                    filter.visibility = View.VISIBLE
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
        val root = inflater.inflate(R.layout.fragment_role, container, false)
        table = root.findViewById(R.id.roles_table)
        spinner = root.findViewById(R.id.loading_spinner)
        paginationText = root.findViewById(R.id.roles_pagination)
        nextBtn = root.findViewById(R.id.roles_pagination_next_btn)
        prevBtn = root.findViewById(R.id.roles_pagination_prev_btn)
        filter = root.findViewById(R.id.roles_filter_edittext)
        filter.addTextChangedListener(object: TextWatcher {
            override fun afterTextChanged(s: Editable?) {
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                for (row in rows) {
                    table!!.removeView(row)
                }
                rows.clear()
                filteredRoles = rolesData.data.filter { it.code.contains(s.toString()) || it.status.contains(s.toString()) }
                displayData(filteredRoles)
            }
        })
        nextBtn.setOnClickListener{
            page += 1;
            for (row in rows) {
                table!!.removeView(row)
            }
            rows.clear()
            displayData(filteredRoles)
        }
        prevBtn.setOnClickListener{
            if (page > 1) {
                page -= 1
                for (row in rows) {
                    table!!.removeView(row)
                }
                rows.clear()
                displayData(filteredRoles)
            }
        }
        return root
    }

    fun displayData(data: List<Role>) {
        var to = (page-1)*itemsPerPage + itemsPerPage - 1
        if (to > data.size) {
            to = data.size - 1
        }
        for (role in data.slice((page-1)*itemsPerPage..to)) {
            val row = TableRow(activity)
            row.setPadding(0, 25, 0, 25)
            val textEmail = TextView(activity)
            textEmail.setText(role.code)
            val textStatus = TextView(activity)
            textStatus.setText(role.status)
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
                val id: String = role._id
                bundle.putString("id", id)
                navController?.navigate(R.id.nav_roles_details, bundle)
            }
        }
        paginationText.setText("${(page-1)*itemsPerPage + 1} - ${(page-1)*itemsPerPage + itemsPerPage} of ${data.size}")
    }
}