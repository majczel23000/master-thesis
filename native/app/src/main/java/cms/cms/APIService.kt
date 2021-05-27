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

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/users")
    suspend fun getUsers(@Header("Authorization") authorization: String?): Response<ResponseBody>

    @Headers(value = ["Accept: application/json",
        "Content-type: application/json"])
    @GET("/roles")
    suspend fun getRoles(@Header("Authorization") authorization: String?): Response<ResponseBody>
}