package cms.cms

import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.*

interface APIService {
    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/users/login")
    suspend fun loginUser(@Body requestBody: RequestBody): Response<ResponseBody>

    // ============== USERS
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/users")
    suspend fun getUsers(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/users")
    suspend fun addUser(@Body requestBody: RequestBody): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/users/{id}")
    suspend fun getUser(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/users/{id}")
    suspend fun modifyUser(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/users/{id}/activate")
    suspend fun activateUser(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/users/{id}/deactivate")
    suspend fun deactivateUser(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/users/{id}")
    suspend fun removeUser(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    // ============== ROLES
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/roles")
    suspend fun getRoles(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/roles/{id}")
    suspend fun getRole(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/roles/{id}")
    suspend fun modifyRole(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/roles/{id}/activate")
    suspend fun activateRole(@Path("id") id: String?, @Header("Authorization") authorization: String?, @Body requestBody: RequestBody): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/roles/{id}/deactivate")
    suspend fun deactivateRole(@Path("id") id: String?, @Header("Authorization") authorization: String?, @Body requestBody: RequestBody): Response<ResponseBody>

    // ============== SETTINGS
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/settings")
    suspend fun getSettings(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/settings")
    suspend fun addSetting(@Body requestBody: RequestBody, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/settings/{id}")
    suspend fun getSetting(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/settings/{id}")
    suspend fun modifySetting(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/settings/{id}/activate")
    suspend fun activateSetting(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/settings/{id}/deactivate")
    suspend fun deactivateSetting(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/settings/{id}")
    suspend fun removeSetting(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    // ============== FAQS
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/faqs")
    suspend fun getFaqs(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/faqs")
    suspend fun addFaq(@Body requestBody: RequestBody, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/faqs/{id}")
    suspend fun getFaq(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/faqs/{id}")
    suspend fun modifyFaq(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/faqs/{id}/activate")
    suspend fun activateFaq(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/faqs/{id}/deactivate")
    suspend fun deactivateFaq(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/faqs/{id}")
    suspend fun removeFaq(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    // ============== MENUS
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/menus")
    suspend fun getMenus(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/menus")
    suspend fun addMenu(@Body requestBody: RequestBody, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/menus/{id}")
    suspend fun getMenu(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/menus/{id}")
    suspend fun modifyMenu(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/menus/{id}/activate")
    suspend fun activateMenu(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/menus/{id}/deactivate")
    suspend fun deactivateMenu(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/menus/{id}")
    suspend fun removeMenu(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    // ============== IMAGES
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/images")
    suspend fun getImages(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/images")
    suspend fun addImage(@Body requestBody: RequestBody, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/images/{id}")
    suspend fun getImage(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/images/{id}")
    suspend fun modifyImage(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/images/{id}/activate")
    suspend fun activateImage(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/images/{id}/deactivate")
    suspend fun deactivateImage(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/images/{id}")
    suspend fun removImage(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    // ============== DICTIONARIES
    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/dictionaries")
    suspend fun getDictionaries(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/dictionaries")
    suspend fun addDictionary(@Body requestBody: RequestBody, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/dictionaries/{id}")
    suspend fun getDictionary(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @PUT("/dictionaries/{id}")
    suspend fun modifyDictionary(@Body requestBody: RequestBody, @Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/dictionaries/{id}/activate")
    suspend fun activateDictionary(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @POST("/dictionaries/{id}/deactivate")
    suspend fun deactivateDictionary(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-Type: application/json"])
    @DELETE("/dictionaries/{id}")
    suspend fun removDictionary(@Path("id") id: String?, @Header("Authorization") authorization: String?): Response<ResponseBody>
}