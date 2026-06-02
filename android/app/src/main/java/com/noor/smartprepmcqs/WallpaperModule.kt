package com.noor.smartprepmcqs

import android.app.WallpaperManager
import android.graphics.BitmapFactory
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class WallpaperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WallpaperModule"
    }

    @ReactMethod
    fun setWallpaper(filePath: String, target: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val wallpaperManager = WallpaperManager.getInstance(context)

            var cleanPath = filePath
            if (cleanPath.startsWith("file://")) {
                cleanPath = cleanPath.substring(7)
            }
            val file = File(cleanPath)
            if (!file.exists()) {
                promise.reject("FILE_NOT_FOUND", "The specified image file was not found: $cleanPath")
                return
            }

            val bitmap = BitmapFactory.decodeFile(file.absolutePath)
            if (bitmap == null) {
                promise.reject("DECODE_FAILED", "Failed to decode the image file into a bitmap")
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                val which = when (target) {
                    "system" -> WallpaperManager.FLAG_SYSTEM
                    "lock" -> WallpaperManager.FLAG_LOCK
                    else -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
                }
                wallpaperManager.setBitmap(bitmap, null, true, which)
            } else {
                wallpaperManager.setBitmap(bitmap)
            }

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }
}
