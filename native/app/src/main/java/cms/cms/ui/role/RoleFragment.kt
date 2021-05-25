package cms.cms.ui.role

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import cms.cms.R

class RoleFragment : Fragment() {

    private lateinit var roleViewModel: RoleViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        roleViewModel =
                ViewModelProviders.of(this).get(RoleViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_role, container, false)
        val textView: TextView = root.findViewById(R.id.text_role)
        roleViewModel.text.observe(this, Observer {
            textView.text = it
        })
        return root
    }
}