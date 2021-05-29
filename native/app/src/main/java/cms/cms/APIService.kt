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
}