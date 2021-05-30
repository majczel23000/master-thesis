package cms.cms.ui.menu

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
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
import cms.cms.models.MenuElement
import cms.cms.models.MenuResponse
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Response
import retrofit2.Retrofit

class MenuDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var menuData: MenuResponse
    private lateinit var modifyMenuBtn: Button
    private lateinit var removeMenuBtn: Button
    private lateinit var addElementBtn: Button
    private lateinit var name: EditText
    private lateinit var description: EditText
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
    private lateinit var elementsll: LinearLayout
    private lateinit var elements: Array<MenuElement>

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
            val response = service.getMenu(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    menuData = Gson().fromJson<MenuResponse>(jsonResponse, MenuResponse::class.java)
                    code.setText(menuData.data.code)
                    name.setText(menuData.data.name)
                    description.setText(menuData.data.description)
                    createdAt.text = menuData.data.createdAt
                    updatedAt.text = menuData.data.updatedAt
                    status.text = menuData.data.status
                    locationText.text = "Location: menus > ${menuData.data.code}"
                    title.text = "Menu details: ${menuData.data.code}"
                    spinner.visibility = View.GONE
                    ll.visibility = View.VISIBLE
                    elements = menuData.data.elements
                    displayElements()
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
        val root = inflater.inflate(R.layout.fragment_menu_details, container, false)
        cl = root.findViewById(R.id.menu_details_parent)
        sv = root.findViewById(R.id.menu_details_scrollview)
        ll = root.findViewById(R.id.menu_details_layout)
        elementsll = root.findViewById(R.id.elements_ll_menu)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.menu_details_location_text)
        title = root.findViewById(R.id.menu_details_title)
        code = root.findViewById(R.id.menu_details_code)
        name = root.findViewById(R.id.menu_details_name)
        description = root.findViewById(R.id.menu_details_description)
        createdAt = root.findViewById(R.id.menu_details_created_at)
        updatedAt = root.findViewById(R.id.menu_details_updated_at)
        status = root.findViewById(R.id.menu_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifyMenuBtn = root.findViewById(R.id.modify_menu_btn)
        modifyMenuBtn.setOnClickListener{
            modifyMenu()
        }
        removeMenuBtn = root.findViewById(R.id.remove_menu_btn)
        removeMenuBtn.setOnClickListener{
            removeMenu()
        }
        addElementBtn = root.findViewById(R.id.add_element_btn_menu)
        addElementBtn.setOnClickListener{
            addElement()
        }
        val menuListBtn: Button = root.findViewById(R.id.menus_list_btn)
        menuListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_menus)
        }
        val menuAddBtn: Button = root.findViewById(R.id.menus_add_btn)
        menuAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_menus_add)
        }
        return root
    }

    fun modifyMenu() {
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
        var arr: Array<JSONObject> = emptyArray()
        for (el in elements) {
            val jsonEl = JSONObject()
            jsonEl.put("url", el.url)
            jsonEl.put("text", el.text)
            val list = arr.toMutableList()
            list.add(jsonEl)
            arr = list.toTypedArray()
        }
        val jsonElements = JSONArray(arr)
        jsonObject.put("name", name.text.toString())
        jsonObject.put("description", description.text.toString())
        jsonObject.put("elements", jsonElements)
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.modifyMenu(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val menuResData = Gson().fromJson<MenuResponse>(jsonResponse, MenuResponse::class.java)
                    val snack = Snackbar.make(cl, menuResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    name.setText(menuResData.data.name)
                    description.setText(menuResData.data.description)
                    createdAt.text = menuResData.data.createdAt
                    updatedAt.text = menuResData.data.updatedAt
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
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
            setMessage("Are you sure you want to change status of this menu?")
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
            if (menuData.data.status == "ACTIVE") {
                response = service.deactivateMenu(id, "Bearer " + token)
            } else {
                response = service.activateMenu(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val menuResData = Gson().fromJson<MenuResponse>(jsonResponse, MenuResponse::class.java)
                    val snack = Snackbar.make(cl, menuResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (menuData.data.status === "ACTIVE") {
                        menuData.data.status = "INACTIVE"
                    } else {
                        menuData.data.status = "ACTIVE"
                    }
                    status.text = menuData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeMenuApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeMenu(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_menus)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeMenu() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeMenuApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove menu")
            setMessage("Are you sure you want to remove this menu?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

    fun displayElements() {
        elementsll.removeAllViews()
        for (el in elements) {
            val urlT = TextView(activity)
            urlT.text = "Url ${elements.indexOf(el)}"
            val textT = TextView(activity)
            textT.text = "Text ${elements.indexOf(el)}"
            val urlE = EditText(activity)
            urlE.setText(el.url)
            urlE.addTextChangedListener(object : TextWatcher {
                override fun afterTextChanged(s: Editable?) {
                }
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    el.text = s.toString()
                }
            })
            val textE = EditText(activity)
            textE.setText(el.text)
            textE.addTextChangedListener(object : TextWatcher {
                override fun afterTextChanged(s: Editable?) {
                }
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    el.text = s.toString()
                }
            })
            val removeBtn = Button(activity)
            removeBtn.text = "Remove element"
            elementsll.addView(urlT)
            elementsll.addView(urlE)
            elementsll.addView(textT)
            elementsll.addView(textE)
            elementsll.addView(removeBtn)
            removeBtn.setOnClickListener{
                elementsll.removeView(urlT)
                elementsll.removeView(urlE)
                elementsll.removeView(textT)
                elementsll.removeView(textE)
                elementsll.removeView(removeBtn)
                val res = elements.toMutableList()
                res.removeAt(elements.indexOf(el))
                elements = res.toTypedArray()
            }
        }
    }

    fun addElement() {
        val list = elements.toMutableList()
        val el = MenuElement("a", "Url", "Text")
        list.add(el)
        elements = list.toTypedArray()
        displayElements()
    }


}