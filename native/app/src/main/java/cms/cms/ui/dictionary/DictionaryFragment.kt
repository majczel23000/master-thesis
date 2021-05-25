package cms.cms.ui.dictionary

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import cms.cms.R

class DictionaryFragment : Fragment() {

    private lateinit var dictionaryViewModel: DictionaryViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        dictionaryViewModel =
                ViewModelProviders.of(this).get(DictionaryViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_dictionary, container, false)
        val textView: TextView = root.findViewById(R.id.text_dictionary)
        dictionaryViewModel.text.observe(this, Observer {
            textView.text = it
        })
        return root
    }
}