package cms.cms.ui.user

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import cms.cms.APIService
import cms.cms.R
import cms.cms.constants
import cms.cms.models.UsersResponse
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit


class UserFragment : Fragment() {

    private lateinit var userViewModel: UserViewModel
    private lateinit var usersData: UsersResponse
    private var table: TableLayout? = null
    private lateinit var paginationText: TextView
    private lateinit var nextBtn: Button
    private lateinit var prevBtn: Button
    private var page: Int = 1
    private var itemsPerPage: Int = 5
    private var rows: ArrayList<TableRow> = arrayListOf<TableRow>()

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
            val response = service.getUsers("Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    usersData = Gson().fromJson<UsersResponse>(jsonResponse, UsersResponse::class.java)
                    displayData()
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
        userViewModel =
                ViewModelProviders.of(this).get(UserViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_user, container, false)
        table = root.findViewById(R.id.users_table)
        paginationText = root.findViewById(R.id.users_pagination)
        nextBtn = root.findViewById(R.id.users_pagination_next_btn)
        prevBtn = root.findViewById(R.id.users_pagination_prev_btn)
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
        return root
    }

    fun displayData() {
        var to = (page-1)*itemsPerPage + itemsPerPage - 1
        if (to > usersData.data.size) {
            to = usersData.data.size - 1
        }
        for (user in usersData.data.slice((page-1)*itemsPerPage..to)) {
            val row = TableRow(activity)
            row.setPadding(0, 25, 0, 25)
            val textEmail = TextView(activity)
            textEmail.setText(user.email)
            val textStatus = TextView(activity)
            textStatus.setText(user.status)
            val params: TableRow.LayoutParams = TableRow.LayoutParams(0, TableRow.LayoutParams.WRAP_CONTENT, 1f)
            textStatus.setLayoutParams(params)
            textEmail.setLayoutParams(params)
            row.addView(textEmail)
            row.addView(textStatus)
            table?.addView(row, 2)
            rows.add(row)
            row.setOnClickListener{
                // TODO: przejscie na detale wedlug tego _id

            }
        }
        paginationText.setText("${(page-1)*itemsPerPage + 1} - ${(page-1)*itemsPerPage + itemsPerPage} of ${usersData.data.size}")
    }

}