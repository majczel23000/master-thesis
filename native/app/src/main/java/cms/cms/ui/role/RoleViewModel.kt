package cms.cms.ui.role

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class RoleViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is Role view"
    }
    val text: LiveData<String> = _text
}