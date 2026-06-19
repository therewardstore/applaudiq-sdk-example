package com.applaudiq.example;

import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.applaudiq.embed.AIQEmbed;

/**
 * The same example, in JAVA — using the {@link AIQEmbed} facade and {@link AIQEmbed.Listener}
 * (the Kotlin {@code ApplaudIQEmbed.Config} lambdas are awkward from Java, so the facade exposes a
 * SAM-style listener with default no-op methods). Both login modes + SSO, identical to MainActivity.kt.
 */
public class MainActivityJava extends AppCompatActivity {

    private TextView status;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(48, 48, 48, 48);

        TextView title = new TextView(this);
        title.setText("Applaud IQ — Android example (Java)");
        title.setTextSize(18f);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 40);
        root.addView(title);

        Button manual = new Button(this);
        manual.setText("Manual login");
        manual.setOnClickListener(v -> openManual());
        root.addView(manual);

        Button auto = new Button(this);
        auto.setText("Auto-login");
        auto.setOnClickListener(v -> openAuto());
        root.addView(auto);

        status = new TextView(this);
        status.setText("Choose a login mode to open the embed.");
        status.setGravity(Gravity.CENTER);
        status.setPadding(0, 40, 0, 0);
        root.addView(status);

        // Author credit.
        TextView credit = new TextView(this);
        credit.setText("By Arulraj V");
        credit.setTextSize(12f);
        credit.setGravity(Gravity.CENTER);
        credit.setPadding(0, 24, 0, 0);
        root.addView(credit);

        setContentView(root, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void openManual() {
        status.setText("Opening manual login…");
        // Manual login needs only the publishable key.
        AIQEmbed.open(this, Config.PUBLISHABLE_KEY, Config.BASE_URL, AIQEmbed.Mode.MANUAL, null,
                new AIQEmbed.Listener() {
                    @Override public void onReady() { toast("Signed in"); }
                    @Override public void onError(String message) { toast("Error: " + message); }
                    @Override public void onClose() { toast("Closed"); }
                });
    }

    private void openAuto() {
        status.setText("Minting a one-time token…");
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
                status.setText(embedToken == null
                        ? "Opening — the portal will show any sign-in error…"
                        : "Token minted — opening…");
                AIQEmbed.open(this, Config.PUBLISHABLE_KEY, Config.BASE_URL, AIQEmbed.Mode.AUTO, embedToken,
                        new AIQEmbed.Listener() {
                            @Override public void onReady() { toast("Signed in"); }
                            @Override public void onAuthPending() { toast("Pending HR approval"); }
                            @Override public void onError(String message) { toast("Error: " + message); }
                            @Override public void onClose() { toast("Closed"); }
                            @Override public void onSignOut() { toast("Signed out — tear down your session"); }
                        });
            });
        }).start();
    }

    private void toast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }
}
