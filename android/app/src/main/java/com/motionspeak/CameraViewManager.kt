package com.motionspeak

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.SurfaceTexture
import android.hardware.camera2.*
import android.os.Handler
import android.os.HandlerThread
import android.view.Surface
import android.view.TextureView
import android.widget.FrameLayout
import androidx.core.app.ActivityCompat
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class CameraView(context: Context) : FrameLayout(context) {

    private val textureView: TextureView = TextureView(context)
    private var cameraDevice: CameraDevice? = null
    private var captureSession: CameraCaptureSession? = null
    private var backgroundThread: HandlerThread? = null
    private var backgroundHandler: Handler? = null
    var facingFront: Boolean = true
    private var surfaceReady: Boolean = false

    init {
        addView(
            textureView,
            LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        )
        textureView.surfaceTextureListener = object : TextureView.SurfaceTextureListener {
            override fun onSurfaceTextureAvailable(st: SurfaceTexture, w: Int, h: Int) {
                surfaceReady = true
                openCamera()
            }
            override fun onSurfaceTextureSizeChanged(st: SurfaceTexture, w: Int, h: Int) {}
            override fun onSurfaceTextureDestroyed(st: SurfaceTexture): Boolean {
                surfaceReady = false
                closeCamera()
                return true
            }
            override fun onSurfaceTextureUpdated(st: SurfaceTexture) {}
        }
    }

    fun updateFacing(front: Boolean) {
        if (facingFront == front) return
        facingFront = front
        closeCamera()
        if (surfaceReady) openCamera()
    }

    private fun startBackgroundThread() {
        backgroundThread = HandlerThread("CameraThread").also { it.start() }
        backgroundHandler = Handler(backgroundThread!!.looper)
    }

    private fun stopBackgroundThread() {
        backgroundThread?.quitSafely()
        try { backgroundThread?.join() } catch (e: InterruptedException) {}
        backgroundThread = null
        backgroundHandler = null
    }

    fun openCamera() {
        startBackgroundThread()
        val manager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        try {
            val targetFacing = if (facingFront)
                CameraCharacteristics.LENS_FACING_FRONT
            else
                CameraCharacteristics.LENS_FACING_BACK

            val cameraId = manager.cameraIdList.firstOrNull { id ->
                manager.getCameraCharacteristics(id)
                    .get(CameraCharacteristics.LENS_FACING) == targetFacing
            } ?: manager.cameraIdList.firstOrNull() ?: return

            if (ActivityCompat.checkSelfPermission(
                    context, Manifest.permission.CAMERA
                ) != PackageManager.PERMISSION_GRANTED
            ) return

            manager.openCamera(
                cameraId,
                object : CameraDevice.StateCallback() {
                    override fun onOpened(camera: CameraDevice) {
                        cameraDevice = camera
                        createPreviewSession()
                    }
                    override fun onDisconnected(camera: CameraDevice) {
                        camera.close()
                        cameraDevice = null
                    }
                    override fun onError(camera: CameraDevice, error: Int) {
                        camera.close()
                        cameraDevice = null
                    }
                },
                backgroundHandler
            )
        } catch (e: CameraAccessException) {
            e.printStackTrace()
        }
    }

    private fun createPreviewSession() {
        val texture = textureView.surfaceTexture ?: return
        texture.setDefaultBufferSize(1280, 720)
        val surface = Surface(texture)
        val previewRequest = cameraDevice!!
            .createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
            .apply { addTarget(surface) }

        cameraDevice!!.createCaptureSession(
            listOf(surface),
            object : CameraCaptureSession.StateCallback() {
                override fun onConfigured(session: CameraCaptureSession) {
                    captureSession = session
                    session.setRepeatingRequest(
                        previewRequest.build(), null, backgroundHandler
                    )
                }
                override fun onConfigureFailed(session: CameraCaptureSession) {}
            },
            backgroundHandler
        )
    }

    fun closeCamera() {
        captureSession?.close()
        captureSession = null
        cameraDevice?.close()
        cameraDevice = null
        stopBackgroundThread()
    }
}

class CameraViewManager : SimpleViewManager<CameraView>() {

    override fun getName(): String = "CameraView"

    override fun createViewInstance(context: ThemedReactContext): CameraView =
        CameraView(context)

    @ReactProp(name = "facingFront", defaultBoolean = true)
    fun setFacingFront(view: CameraView, facingFront: Boolean) {
        view.updateFacing(facingFront)
    }
}