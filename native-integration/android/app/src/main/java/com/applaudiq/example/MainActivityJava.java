package com.applaudiq.example;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

import com.applaudiq.embed.AIQEmbed;

/**
 * The same example, in JAVA — using the {@link AIQEmbed} facade and {@link AIQEmbed.Listener}
 * (the Kotlin {@code ApplaudIQEmbed.Config} lambdas are awkward from Java, so the facade exposes a
 * SAM-style listener with default no-op methods). Same branded home + both login modes as MainActivity.kt.
 */
public class MainActivityJava extends AppCompatActivity {

    private LinearLayout statusPill;
    private ImageView statusIcon;
    private TextView statusText;
    private ProgressBar autoSpinner;
    private ImageView autoChevron;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                .setAppearanceLightStatusBars(false);

        ExampleUi.applyInsets(findViewById(R.id.hero), findViewById(R.id.scroll_content));

        // This is the Java variant — relabel the subtitle and hide the "open Java example" link.
        ((TextView) findViewById(R.id.subtitle)).setText("Android example (Java)");
        findViewById(R.id.java_link).setVisibility(View.GONE);

        statusPill = findViewById(R.id.status_pill);
        statusIcon = findViewById(R.id.status_icon);
        statusText = findViewById(R.id.status_text);
        autoSpinner = findViewById(R.id.auto_spinner);
        autoChevron = findViewById(R.id.auto_chevron);
        setStatus(ExampleUi.IDLE, "Choose a login mode to open the embed.");

        findViewById(R.id.card_manual).setOnClickListener(v -> openManual());
        findViewById(R.id.card_auto).setOnClickListener(v -> openAuto());
    }

    private void setStatus(int color, String message) {
        ExampleUi.setStatus(statusPill, statusIcon, statusText, color, message);
    }

    private void openManual() {
        setStatus(ExampleUi.IDLE, "Opening manual login…");
        AIQEmbed.open(this, Config.PUBLISHABLE_KEY, Config.BASE_URL, AIQEmbed.Mode.MANUAL, null,
                new AIQEmbed.Listener() {
                    @Override public void onReady() { setStatus(ExampleUi.SUCCESS, "Signed in"); }
                    @Override public void onError(String message) { setStatus(ExampleUi.ERROR, "Error: " + message); }
                    @Override public void onClose() { }
                });
    }

    private void openAuto() {
        setStatus(ExampleUi.LOADING, "Minting a one-time token…");
        autoSpinner.setVisibility(View.VISIBLE);
        autoChevron.setVisibility(View.GONE);
        // Mint off the main thread (MintClient is the Kotlin object, reachable via INSTANCE from Java).
        new Thread(() -> {
            String token;
            try {
                token = MintClient.INSTANCE.getEmbedToken();
            } catch (Exception e) {
                token = null; // open with null → the portal shows the error itself (centralized UI)
            }
            final String embedToken = token;
            runOnUiThread(() -> {
                autoSpinner.setVisibility(View.GONE);
                autoChevron.setVisibility(View.VISIBLE);
                setStatus(embedToken == null ? ExampleUi.IDLE : ExampleUi.LOADING,
                        embedToken == null
                                ? "Opening — the portal will show any sign-in error…"
                                : "Token minted — opening…");
                AIQEmbed.open(this, Config.PUBLISHABLE_KEY, Config.BASE_URL, AIQEmbed.Mode.AUTO, embedToken,
                        new AIQEmbed.Listener() {
                            @Override public void onReady() { setStatus(ExampleUi.SUCCESS, "Signed in"); }
                            @Override public void onAuthPending() { setStatus(ExampleUi.PENDING, "Pending HR approval"); }
                            @Override public void onError(String message) { setStatus(ExampleUi.ERROR, "Error: " + message); }
                            @Override public void onClose() { }
                            @Override public void onSignOut() { }
                        });
            });
        }).start();
    }
}
