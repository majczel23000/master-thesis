package cms.cms.ui.image

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import cms.cms.R

class ImageFragment : Fragment() {

    private lateinit var imageViewModel: ImageViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        imageViewModel =
                ViewModelProviders.of(this).get(ImageViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_image, container, false)
        val textView: TextView = root.findViewById(R.id.text_image)
        imageViewModel.text.observe(this, Observer {
            textView.text = it
        })
        return root
    }
}