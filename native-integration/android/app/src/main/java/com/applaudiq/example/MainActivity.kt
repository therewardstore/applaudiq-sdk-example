package com.applaudiq.example

import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.applaudiq.embed.ApplaudIQEmbed
import kotlin.concurrent.thread

/**
 * The example in KOTLIN. Two ways to open the embed — both also handle SSO automatically (the SDK
 * opens Custom Tabs and relays the result back):
 *  • Manual login — no server, no secret, no token: just the publishable key. Simplest path.
 *  • Auto-login   — your backend mints a one-time token (MintClient), then silent sign-in.
 *
 * The same example written in Java lives in [MainActivityJava] (use the "Open Java example" button).
 */
class MainActivity : AppCompatActivity() {

    private lateinit var status: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(48, 48, 48, 48)
        }

        root.addView(TextView(this).apply {
            text = "Applaud IQ — Android embed example"
            textSize = 18f
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 40)
        })

        // Manual login needs only the publishable key.
        root.addView(Button(this).apply {
            text = "Manual login"
            setOnClickListener { openManual() }
        })

        // Auto-login mints a one-time token first (MintClient), then opens silently.
        root.addView(Button(this).apply {
            text = "Auto-login"
            setOnClickListener { openAuto() }
        })

        // The same example, written in Java (uses the AIQEmbed facade + Listener).
        root.addView(Button(this).apply {
            text = "Open Java example"
            setOnClickListener { startActivity(Intent(this@MainActivity, MainActivityJava::class.java)) }
        })

        status = TextView(this).apply {
            text = "Choose a login mode to open the embed."
            gravity = Gravity.CENTER
            setPadding(0, 40, 0, 0)
        }
        root.addView(status)

        // Author credit.
        root.addView(TextView(this).apply {
            text = "By Arulraj V"
            textSize = 12f
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 0)
        })

        setContentView(root, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT,
        ))
    }

    private fun openManual() {
        status.text = "Opening manual login…"
        ApplaudIQEmbed.open(
            this,
            ApplaudIQEmbed.Config(
                key = Config.PUBLISHABLE_KEY,
                baseUrl = Config.BASE_URL,
                mode = ApplaudIQEmbed.Mode.MANUAL,
                onReady = { toast("Signed in") },
                onError = { msg -> toast("Error: $msg") },
                onClose = { toast("Closed") },
            ),
        )
    }

    private fun openAuto() {
        status.text = "Minting a one-time token…"
        // Mint off the main thread. On failure we still open in auto mode with a null token so the SDK
        // sends `init-error` and the PORTAL shows the error itself (centralized error UI, like the web SDK).
        thread {
            val token = try { MintClient.getEmbedToken() } catch (e: Exception) { null }
            runOnUiThread {
                status.text = if (token == null) "Opening — the portal will show any sign-in error…" else "Token minted — opening…"
                ApplaudIQEmbed.open(
                    this,
                    ApplaudIQEmbed.Config(
                        key = Config.PUBLISHABLE_KEY,
                        token = token,
                        baseUrl = Config.BASE_URL,
                        mode = ApplaudIQEmbed.Mode.AUTO,
                        onReady = { toast("Signed in") },
                        onAuthPending = { toast("Pending HR approval") },
                        onError = { msg -> toast("Error: $msg") },
                        onClose = { toast("Closed") },
                        onSignOut = { toast("Signed out — tear down your session") },
                    ),
                )
            }
        }
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
}
