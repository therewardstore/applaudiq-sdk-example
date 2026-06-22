package com.applaudiq.example

import android.graphics.drawable.GradientDrawable
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.graphics.ColorUtils
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding

/**
 * Shared brand-UI helpers for the home screen (used by both [MainActivity] and [MainActivityJava]).
 * Status colours mirror the Flutter/iOS examples.
 */
object ExampleUi {
    @JvmField val IDLE = 0xFF6B6786.toInt()
    @JvmField val LOADING = 0xFF7A3AED.toInt()
    @JvmField val SUCCESS = 0xFF1E9E62.toInt()
    @JvmField val PENDING = 0xFFC07A00.toInt()
    @JvmField val ERROR = 0xFFD23B53.toInt()

    /** Draw the gradient hero under the status bar + keep content clear of the system bars (edge-to-edge). */
    @JvmStatic
    fun applyInsets(hero: View, scrollContent: View) {
        val heroTop = hero.paddingTop
        ViewCompat.setOnApplyWindowInsetsListener(hero) { v, insets ->
            v.updatePadding(top = heroTop + insets.getInsets(WindowInsetsCompat.Type.systemBars()).top)
            insets
        }
        val bottom = scrollContent.paddingBottom
        ViewCompat.setOnApplyWindowInsetsListener(scrollContent) { v, insets ->
            v.updatePadding(bottom = bottom + insets.getInsets(WindowInsetsCompat.Type.systemBars()).bottom)
            insets
        }
    }

    /** Colour-code the status pill (rounded tinted background + matching icon + text). */
    @JvmStatic
    fun setStatus(pill: LinearLayout, icon: ImageView, text: TextView, color: Int, message: String) {
        text.text = message
        text.setTextColor(color)
        icon.setColorFilter(color)
        val dp = pill.resources.displayMetrics.density
        pill.background = GradientDrawable().apply {
            cornerRadius = 14 * dp
            setColor(ColorUtils.setAlphaComponent(color, 26))
            setStroke((dp).toInt(), ColorUtils.setAlphaComponent(color, 64))
        }
    }
}
