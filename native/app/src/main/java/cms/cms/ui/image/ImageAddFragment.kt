package cms.cms.ui.image

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.ScrollView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import cms.cms.APIService
import cms.cms.R
import cms.cms.constants
import cms.cms.models.ImageResponse
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import retrofit2.Retrofit
import android.graphics.BitmapFactory
import android.graphics.Bitmap
import android.util.Base64
import java.io.ByteArrayOutputStream

class ImageAddFragment: Fragment() {
    private var token: String? = ""
    private lateinit var addImageBtn: Button
    private lateinit var chooseImageBtn: Button
    private lateinit var choosenImage: ImageView
    private lateinit var code: EditText
    private lateinit var name: EditText
    private lateinit var cl: ConstraintLayout
    private lateinit var sv: ScrollView
    private lateinit var base64string: String

    override fun onResume() {
        super.onResume()
        var sp = activity?.getSharedPreferences("SP", Context.MODE_PRIVATE)
        token = sp?.getString("TOKEN", "Empty")
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_image_add, container, false)
        cl = root.findViewById(R.id.image_add_parent)
        sv = root.findViewById(R.id.image_add_scrollview)
        code = root.findViewById(R.id.add_image_code)
        name = root.findViewById(R.id.add_image_name)
        choosenImage = root.findViewById(R.id.choosen_image)
        addImageBtn = root.findViewById(R.id.add_image_btn)
        addImageBtn.setOnClickListener{
            addImage()
        }
        chooseImageBtn = root.findViewById(R.id.choose_img_btn)
        chooseImageBtn.setOnClickListener{
            chooseImage()
        }
        val imageListBtn: Button = root.findViewById(R.id.image_list_btn)
        imageListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_images)
        }
        return root
    }

    fun addImage() {
        if (code.text.toString().isEmpty() || name.text.toString().isEmpty() || base64string.isEmpty()) {
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
        jsonObject.put("code", code.text.toString())
        jsonObject.put("name", name.text.toString())
        jsonObject.put("image", base64string)
        val jsonObjectString = jsonObject.toString()
        val requestBody = jsonObjectString.toRequestBody("application/json".toMediaTypeOrNull())
        CoroutineScope(Dispatchers.IO).launch {
            val response = service.addImage(requestBody, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val addData = Gson().fromJson<ImageResponse>(jsonResponse, ImageResponse::class.java)
                    val snack = Snackbar.make(cl, addData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    sv.fullScroll(ScrollView.FOCUS_UP)
                    code.setText("")
                    name.setText("")
                } else {
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun chooseImage() {
        val intent = Intent(Intent.ACTION_PICK)
        intent.type = "image/*"
        startActivityForResult(intent, 100)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == Activity.RESULT_OK && requestCode == 100){
            choosenImage.setImageURI(data?.data) // handle chosen image
            val imageStream = activity?.getContentResolver()?.openInputStream(data?.data!!)
            val selectedImage: Bitmap = BitmapFactory.decodeStream(imageStream)
            base64string  = encodeImage(selectedImage)
        }
    }

    fun encodeImage(bm: Bitmap) : String
    {
        val baos: ByteArrayOutputStream = ByteArrayOutputStream()
        bm.compress(Bitmap.CompressFormat.JPEG,100, baos)
        val b = baos.toByteArray()
        val  encImage = Base64.encodeToString(b, Base64.DEFAULT)
        return encImage
    }
}