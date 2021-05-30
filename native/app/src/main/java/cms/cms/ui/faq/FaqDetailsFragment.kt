package cms.cms.ui.faq

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
import cms.cms.models.FaqElement
import cms.cms.models.FaqResponse
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

class FaqDetailsFragment : Fragment() {

    private var id: String? = ""
    private var token: String? = ""
    private lateinit var faqData: FaqResponse
    private lateinit var modifyFaqBtn: Button
    private lateinit var removeFaqBtn: Button
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
    private lateinit var elementsll: LinearLayout
    private lateinit var spinner: ProgressBar
    private lateinit var elements: Array<FaqElement>

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
            val response = service.getFaq(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    faqData = Gson().fromJson<FaqResponse>(jsonResponse, FaqResponse::class.java)
                    code.setText(faqData.data.code)
                    name.setText(faqData.data.name)
                    description.setText(faqData.data.description)
                    createdAt.text = faqData.data.createdAt
                    updatedAt.text = faqData.data.updatedAt
                    status.text = faqData.data.status
                    locationText.text = "Location: faqs > ${faqData.data.code}"
                    title.text = "Faq details: ${faqData.data.code}"
                    elements = faqData.data.elements
                    displayElements()
                    spinner.visibility = View.GONE
                    ll.visibility = View.VISIBLE
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
        val root = inflater.inflate(R.layout.fragment_faq_details, container, false)
        cl = root.findViewById(R.id.faq_details_parent)
        sv = root.findViewById(R.id.faq_details_scrollview)
        ll = root.findViewById(R.id.faq_details_layout)
        elementsll = root.findViewById(R.id.elements_ll)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.faq_details_location_text)
        title = root.findViewById(R.id.faq_details_title)
        code = root.findViewById(R.id.faq_details_code)
        name = root.findViewById(R.id.faq_details_name)
        description = root.findViewById(R.id.faq_details_description)
        createdAt = root.findViewById(R.id.faq_details_created_at)
        updatedAt = root.findViewById(R.id.faq_details_updated_at)
        status = root.findViewById(R.id.faq_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        modifyFaqBtn = root.findViewById(R.id.modify_faq_btn)
        modifyFaqBtn.setOnClickListener{
            modifyFaq()
        }
        removeFaqBtn = root.findViewById(R.id.remove_faq_btn)
        removeFaqBtn.setOnClickListener{
            removeFaq()
        }
        addElementBtn = root.findViewById(R.id.add_element_btn)
        addElementBtn.setOnClickListener{
            addElement()
        }
        val FaqListBtn: Button = root.findViewById(R.id.faqs_list_btn)
        FaqListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_faqs)
        }
        val faqAddBtn: Button = root.findViewById(R.id.faqs_add_btn)
        faqAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_faqs_add)
        }
        return root
    }

    fun modifyFaq() {
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
            jsonEl.put("question", el.question)
            jsonEl.put("answear", el.answear)
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
            val response = service.modifyFaq(requestBody, id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val faqResData = Gson().fromJson<FaqResponse>(jsonResponse, FaqResponse::class.java)
                    val snack = Snackbar.make(cl, faqResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    name.setText(faqResData.data.name)
                    description.setText(faqResData.data.description)
                    createdAt.text = faqResData.data.createdAt
                    updatedAt.text = faqResData.data.updatedAt
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
            setMessage("Are you sure you want to change status of this faq?")
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
            if (faqData.data.status == "ACTIVE") {
                response = service.deactivateFaq(id, "Bearer " + token)
            } else {
                response = service.activateFaq(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val faqResData = Gson().fromJson<FaqResponse>(jsonResponse, FaqResponse::class.java)
                    val snack = Snackbar.make(cl, faqResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (faqData.data.status === "ACTIVE") {
                        faqData.data.status = "INACTIVE"
                    } else {
                        faqData.data.status = "ACTIVE"
                    }
                    status.text = faqData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeFaqApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
                .baseUrl(constants.API_URL)
                .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeFaq(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_faqs)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeFaq() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeFaqApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove faq")
            setMessage("Are you sure you want to remove this faq?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

    fun displayElements() {
        elementsll.removeAllViews()
        for (el in elements) {
            val questionT = TextView(activity)
            questionT.text = "Question ${elements.indexOf(el)}"
            val answerT = TextView(activity)
            answerT.text = "Answer ${elements.indexOf(el)}"
            val questionE = EditText(activity)
            questionE.setText(el.question)
            questionE.addTextChangedListener(object : TextWatcher {
                override fun afterTextChanged(s: Editable?) {
                }
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    el.question = s.toString()
                }
            })
            val answerE = EditText(activity)
            answerE.setText(el.answear)
            answerE.addTextChangedListener(object : TextWatcher {
                override fun afterTextChanged(s: Editable?) {
                }
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                }
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    el.answear = s.toString()
                }
            })
            val removeBtn = Button(activity)
            removeBtn.text = "Remove element"
            elementsll.addView(questionT)
            elementsll.addView(questionE)
            elementsll.addView(answerT)
            elementsll.addView(answerE)
            elementsll.addView(removeBtn)
            removeBtn.setOnClickListener{
                elementsll.removeView(questionT)
                elementsll.removeView(questionE)
                elementsll.removeView(answerT)
                elementsll.removeView(answerE)
                elementsll.removeView(removeBtn)
                val res = elements.toMutableList()
                res.removeAt(elements.indexOf(el))
                elements = res.toTypedArray()
            }
        }
    }

    fun addElement() {
        val list = elements.toMutableList()
        val el = FaqElement("a", "Question", "Answer")
        list.add(el)
        elements = list.toTypedArray()
        displayElements()
    }

}