package cms.cms.ui.image

import android.content.Context
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
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
import cms.cms.models.ImagesResponse
import com.google.gson.Gson
import com.google.gson.JsonParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit

class ImageFragment : Fragment() {

    private lateinit var imagesData: ImagesResponse
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
            val response = service.getImages("Bearer " + token)
            withContext(Dispatchers.Main) {
                if (response.isSuccessful) {
                    val jsonResponse = JsonParser.parseString(response.body()?.string()).toString()
                    imagesData = Gson().fromJson<ImagesResponse>(jsonResponse, ImagesResponse::class.java)
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
        val root = inflater.inflate(R.layout.fragment_image, container, false)
        table = root.findViewById(R.id.images_table)
        spinner = root.findViewById(R.id.loading_spinner)
        paginationText = root.findViewById(R.id.images_pagination)
        nextBtn = root.findViewById(R.id.images_pagination_next_btn)
        prevBtn = root.findViewById(R.id.images_pagination_prev_btn)
        nextBtn.setOnClickListener {
            page += 1;
            for (row in rows) {
                table!!.removeView(row)
            }
            rows.clear()
            displayData()
        }
        prevBtn.setOnClickListener {
            if (page > 1) {
                page -= 1
                for (row in rows) {
                    table!!.removeView(row)
                }
                rows.clear()
                displayData()
            }
        }
        val addImageBtn: Button = root.findViewById(R.id.add_image_btn)
        addImageBtn.setOnClickListener {
            val navController = activity?.findNavController(R.id.nav_host_fragment)
            navController?.navigateUp()
            navController?.navigate(R.id.nav_images_add)
        }
        return root
    }

    fun displayData() {
        var to = (page - 1) * itemsPerPage + itemsPerPage - 1
        if (to > imagesData.data.size) {
            to = imagesData.data.size - 1
        }
        for (image in imagesData.data.slice((page - 1) * itemsPerPage..to)) {
            val row = TableRow(activity)
            row.setPadding(0, 25, 0, 25)
            val textCode = TextView(activity)
            textCode.setText(image.code)
            val imageView = ImageView(activity)
            var str: String
            if (image.image.contains(',')) {
                str = image.image.split(',')[1]
            } else {
                str = image.image
            }
            val decodedString = Base64.decode(str, Base64.DEFAULT)
            val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            imageView.setImageBitmap(decodedByte)
            val params: TableRow.LayoutParams = TableRow.LayoutParams(0, TableRow.LayoutParams.WRAP_CONTENT, 1f)
            imageView.setLayoutParams(params)
            imageView.layoutParams.height = 300
            textCode.setLayoutParams(params)
            row.addView(textCode)
            row.addView(imageView)
            table?.addView(row, 2)
            rows.add(row)
            row.setOnClickListener {
                // TODO: przejscie na detale wedlug tego _id
                val navController = activity?.findNavController(R.id.nav_host_fragment)
                navController?.navigateUp()
                val bundle = Bundle()
                val id: String = image._id
                bundle.putString("id", id)
                navController?.navigate(R.id.nav_images_details, bundle)
            }
        }
        paginationText.setText("${(page - 1) * itemsPerPage + 1} - ${(page - 1) * itemsPerPage + itemsPerPage} of ${imagesData.data.size}")
    }
}