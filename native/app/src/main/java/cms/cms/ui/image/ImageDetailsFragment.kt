package cms.cms.ui.image

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
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
import cms.cms.models.ImageResponse
import com.google.android.material.snackbar.Snackbar
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.Retrofit

class ImageDetailsFragment: Fragment() {
    private var id: String? = ""
    private var token: String? = ""
    private lateinit var imageData: ImageResponse
    private lateinit var removeImageBtn: Button
    private lateinit var name: TextView
    private lateinit var code: TextView
    private lateinit var createdAt: TextView
    private lateinit var updatedAt: TextView
    private lateinit var status: TextView
    private lateinit var locationText: TextView
    private lateinit var title: TextView
    private lateinit var cl: ConstraintLayout
    private lateinit var sv: ScrollView
    private lateinit var ll: LinearLayout
    private lateinit var spinner: ProgressBar
    private lateinit var imageviewdata: ImageView

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
            val response = service.getImage(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    imageData = Gson().fromJson<ImageResponse>(jsonResponse, ImageResponse::class.java)
                    code.text = imageData.data.code
                    name.text = imageData.data.name
                    createdAt.text = imageData.data.createdAt
                    updatedAt.text = imageData.data.updatedAt
                    status.text = imageData.data.status
                    locationText.text = "Location: images > ${imageData.data.code}"
                    title.text = "Image details: ${imageData.data.code}"

                    var str: String
                    if (imageData.data.image.contains(',')) {
                        str = imageData.data.image.split(',')[1]
                    } else {
                        str = imageData.data.image
                    }
                    val decodedString = Base64.decode(str, Base64.DEFAULT)
                    val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                    imageviewdata.setImageBitmap(decodedByte)
                    imageviewdata.layoutParams.height = 1000
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
        val root = inflater.inflate(R.layout.fragment_image_details, container, false)
        cl = root.findViewById(R.id.image_details_parent)
        sv = root.findViewById(R.id.image_details_scrollview)
        ll = root.findViewById(R.id.image_details_layout)
        spinner = root.findViewById(R.id.loading_spinner)
        locationText = root.findViewById(R.id.image_details_location_text)
        title = root.findViewById(R.id.image_details_title)
        code = root.findViewById(R.id.image_details_code)
        name = root.findViewById(R.id.image_details_name)
        createdAt = root.findViewById(R.id.image_details_created_at)
        updatedAt = root.findViewById(R.id.image_details_updated_at)
        imageviewdata = root.findViewById(R.id.imageview_data)
        status = root.findViewById(R.id.image_details_status)
        status.setOnClickListener{
            changeStatus()
        }
        removeImageBtn = root.findViewById(R.id.remove_image_btn)
        removeImageBtn.setOnClickListener{
            removeImage()
        }
        val imageListBtn: Button = root.findViewById(R.id.images_list_btn)
        imageListBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_images)
        }
        val imageAddBtn: Button = root.findViewById(R.id.images_add_btn)
        imageAddBtn.setOnClickListener{
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_images_add)
        }
        return root
    }

    fun changeStatus() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            changeStatusApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Change status")
            setMessage("Are you sure you want to change status of this Image?")
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
            if (imageData.data.status == "ACTIVE") {
                response = service.deactivateImage(id, "Bearer " + token)
            } else {
                response = service.activateImage(id, "Bearer " + token)
            }
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    val imageResData = Gson().fromJson<ImageResponse>(jsonResponse, ImageResponse::class.java)
                    val snack = Snackbar.make(cl, imageResData.message, Snackbar.LENGTH_LONG)
                    snack.show()
                    if (imageData.data.status === "ACTIVE") {
                        imageData.data.status = "INACTIVE"
                    } else {
                        imageData.data.status = "ACTIVE"
                    }
                    status.text = imageData.data.status
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeImageApi() {
        // API CALL
        val retrofit = Retrofit.Builder()
            .baseUrl(constants.API_URL)
            .build()
        val service = retrofit.create(APIService::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            var response: Response<ResponseBody> = service.removeImage(id, "Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val navController = activity?.findNavController(R.id.nav_host_fragment)
                    navController?.navigateUp()
                    navController?.navigate(R.id.nav_images)
                } else {
                    Log.d("ERR", response.toString())
                    val snack = Snackbar.make(cl, constants.GLOBAL_ERROR, Snackbar.LENGTH_LONG)
                    snack.show()
                }
            }
        }
    }

    fun removeImage() {
        val positiveButtonClick = { dialog: DialogInterface, which: Int ->
            removeImageApi()
        }

        val builder = AlertDialog.Builder(activity)
        with(builder) {
            setTitle("Remove image")
            setMessage("Are you sure you want to remove this image?")
            setPositiveButton("YES", DialogInterface.OnClickListener(function = positiveButtonClick))
            setNegativeButton("NO", null)
        }
        val alertDialog = builder.create()
        alertDialog.show()
    }

}