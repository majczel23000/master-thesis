package cms.cms.ui.dictionary

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
import cms.cms.models.DictionaryElement
import cms.cms.models.DictionaryLanguage
import cms.cms.models.DictionaryResponse
import cms.cms.models.MenuElement
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

class DictionaryDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var dictionaryData: DictionaryResponse
    private lateinit var modifyDictionaryBtn: Button
    private lateinit var removeDictionaryBtn: Button
    private lateinit var addLanguageBtn: Button
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
    private lateinit var languages: Array<DictionaryLanguage>

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
            val response = service.getDictionary(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    dictionaryData = Gson().fromJson<DictionaryResponse>(jsonResponse, DictionaryResponse::class.java)
                    code.setText(dictionaryData.data.code)
                    name.setText(dictionaryData.data.name)
                    description.setText(dictionaryData.data.description)
                    createdAt.text = dictionaryData.data.createdAt
                    updatedAt.text = dictionaryData.data.updatedAt
                    status.text = dictionaryData.data.status
                    locationText.text = "Location: dictionaries > ${dictionaryData.data.code}"
                    title.text = "Dictionary details: ${dictionaryData.data.code}"
                    languages = dictionaryData.data.dictionary
                    spinner.visibility = View.GONE
                    ll.visibility = View.VISIBLE
                    displayLanguages()
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
        val root = inflater.inflate(R.layout.fragment_dictionary_details, container, false)
        cl = root.findViewById(R.id.dictionary_details_parent)
        sv = root.findViewById(R.id.dictionary_details_scrollview)
        ll = root.findViewById(R.id.dictionary_details_layout)
        elementsll = root.findViewById(R.id.elements_ll_menu)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.dictionary_details_location_text)
        title = root.findViewById(R.id.dictionary_details_title)
        code = root.findViewById(R.id.dictionary_details_code)
        name = root.findViewById(R.id.dictionary_details_name)
        description = root.findViewById(R.id.dictionary_details_description)
        createdAt = root.findViewById(R.id.dictionary_details_created_at)
        updatedAt = root.findViewById(R.id.dictionary_details_updated_at)
        status = root.findViewById(R.id.dictionary_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifyDictionaryBtn = root.findViewById(R.id.modify_dictionary_btn)
        modifyDictionaryBtn.setOnClickListener{
            modifyDictionary()
        }
        removeDictionaryBtn = root.findViewById(R.id.remove_dictionary_btn)
        removeDictionaryBtn.setOnClickListener{
            removeDictionary()
        }
        addLanguageBtn = root.findViewById(R.id.add_language_btn_dictionary)
        addLanguageBtn.setOnClickListener{
            addLanguage()
        }
        val DictionaryListBtn: Button = root.findViewById(R.id.dictionary_list_btn)
        DictionaryListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_dictionaries)
        }
        val dictionaryAddBtn: Button = root.findViewById(R.id.dictionary_add_btn)
        dictionaryAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_dictionaries_add)
        }
        return root
    }

    fun modifyDictionary() {
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
        for (lang in languages) {
            val jsonLang = JSONObject()
            var arrEl: Array<JSONObject> = emptyArray()
            for (el in lang.elements) {
                val jsonEl = JSONObject()
                jsonEl.put("value", el.value)
                val listEl = arrEl.toMutableList()
                listEl.add(jsonEl)
                arrEl = listEl.toTypedArray()
            }
            jsonLang.put("language", lang.language)
            jsonLang.put("elements", JSONArray(arrEl))
            var listLang = arr.toMutableList()
            listLang.add(jsonLang)
            arr = listLang.toTypedArray()
        }
        val jsonElements = JSONArray(arr)
        jsonObject.put("name", name.text.toString())
        jsonObject.put("description", description.text.toString())
        jsonObject.put("dictionary", jsonElements)
        Log.d("JSON", jsonObject.toString())
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.modifyDictionary(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val dictResData = Gson().fromJson<DictionaryResponse>(jsonResponse, DictionaryResponse::class.java)
                    val snack = Snackbar.make(cl, dictResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    name.setText(dictResData.data.name)
                    description.setText(dictResData.data.description)
                    createdAt.text = dictResData.data.createdAt
                    updatedAt.text = dictResData.data.updatedAt
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
            setMessage("Are you sure you want to change status of this dictionary?")
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
            if (dictionaryData.data.status == "ACTIVE") {
                response = service.deactivateDictionary(id, "Bearer " + token)
            } else {
                response = service.activateDictionary(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val dictResData = Gson().fromJson<DictionaryResponse>(jsonResponse, DictionaryResponse::class.java)
                    val snack = Snackbar.make(cl, dictResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (dictionaryData.data.status === "ACTIVE") {
                        dictionaryData.data.status = "INACTIVE"
                    } else {
                        dictionaryData.data.status = "ACTIVE"
                    }
                    status.text = dictionaryData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeDictionaryApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeDictionary(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_dictionaries)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeDictionary() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeDictionaryApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove dictionary")
            setMessage("Are you sure you want to remove this dictionary?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

    fun displayLanguages() {
        elementsll.removeAllViews()
        for (lang in languages) {
            val languageT = TextView(activity)
            languageT.text = "Language ${languages.indexOf(lang)+1}"
            val languageE = EditText(activity)
            languageE.setText(lang.language)
            languageE.addTextChangedListener(object : TextWatcher {
                override fun afterTextChanged(s: Editable?) {
                }
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    lang.language = s.toString()
                }
            })
            val removeLanguageBtn = Button(activity)
            removeLanguageBtn.text = "Remove language"
            removeLanguageBtn.setOnClickListener{
                val res = languages.toMutableList()
                res.removeAt(languages.indexOf(lang))
                languages = res.toTypedArray()
                displayLanguages()
            }
            val addLanguageBtn = Button(activity)
            addLanguageBtn.text = "Add element"
            addLanguageBtn.setOnClickListener{
                val res = lang.elements.toMutableList()
                res.add(DictionaryElement("id", "Value"))
                lang.elements = res.toTypedArray()
                displayLanguages()
            }
            elementsll.addView(languageT)
            elementsll.addView(languageE)
            elementsll.addView(removeLanguageBtn)
            elementsll.addView(addLanguageBtn)

            for(el in lang.elements) {
                val elT = TextView(activity)
                elT.text = "Element ${languages.indexOf(lang)+1}.${lang.elements.indexOf(el)+1}"
                val elE = EditText(activity)
                elE.setText(el.value)
                val removeElementBtn = Button(activity)
                removeElementBtn.text = "Remove element"
                removeElementBtn.setOnClickListener{
                    val res = lang.elements.toMutableList()
                    res.removeAt(lang.elements.indexOf(el))
                    lang.elements = res.toTypedArray()
                    displayLanguages()
                }
                elementsll.addView(elT)
                elementsll.addView(elE)
                elementsll.addView(removeElementBtn)
            }
        }
    }

    fun addLanguage() {
        val list = languages.toMutableList()
        val el = DictionaryLanguage("a", "Lan", emptyArray())
        list.add(el)
        languages = list.toTypedArray()
        displayLanguages()
    }

}