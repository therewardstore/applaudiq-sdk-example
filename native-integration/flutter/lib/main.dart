import 'package:applaudiq_embed/applaudiq_embed.dart';
import 'package:flutter/material.dart';

import 'config.dart';
import 'mint_client.dart';

void main() => runApp(const App());

/// Applaud IQ brand palette — sampled from the brand logo (the SDK theme).
class Brand {
  static const violet = Color(0xFF7A3AED);
  static const indigo = Color(0xFF5146E5);
  static const surface = Color(0xFFF6F5FF);
  static const ink = Color(0xFF1B1630);
  static const muted = Color(0xFF6B6786);
  static const gradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [violet, indigo],
  );
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Applaud IQ — Flutter embed example',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Brand.surface,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Brand.violet,
          primary: Brand.violet,
        ),
        fontFamily: 'SF Pro Text',
      ),
      home: const HomeScreen(),
    );
  }
}

/// Drives the status pill colour without parsing strings.
enum _Status { idle, loading, success, pending, error }

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  _Status _kind = _Status.idle;
  String _status = 'Choose a login mode to open the embed.';
  bool _minting = false;

  void _set(_Status kind, String msg) {
    if (mounted) {
      setState(() {
        _kind = kind;
        _status = msg;
      });
    }
  }

  void _openManual() {
    _set(_Status.idle, 'Opening manual login…');
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => _EmbedScreen(mode: ApplaudIQMode.manual, onStatus: _set),
    ));
  }

  Future<void> _openAuto() async {
    setState(() => _minting = true);
    _set(_Status.loading, 'Minting a one-time token…');
    try {
      final token = await getEmbedToken();
      if (!mounted) return;
      setState(() => _minting = false);
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) =>
            _EmbedScreen(mode: ApplaudIQMode.auto, token: token, onStatus: _set),
      ));
    } catch (e) {
      if (mounted) setState(() => _minting = false);
      _set(_Status.error, 'Mint failed: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const _BrandHero(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 28, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'CHOOSE A LOGIN MODE',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                      color: Brand.muted,
                    ),
                  ),
                  const SizedBox(height: 14),
                  _ModeCard(
                    icon: Icons.lock_outline_rounded,
                    title: 'Manual login',
                    subtitle:
                        'Employees sign in inside the embed (email + SSO). No server needed.',
                    onTap: _minting ? null : _openManual,
                  ),
                  const SizedBox(height: 12),
                  _ModeCard(
                    icon: Icons.bolt_rounded,
                    title: 'Auto-login',
                    subtitle:
                        'Silent sign-in with a one-time token minted on your server.',
                    busy: _minting,
                    onTap: _minting ? null : _openAuto,
                  ),
                  const SizedBox(height: 22),
                  _StatusPill(kind: _kind, message: _status),
                  const SizedBox(height: 18),
                  const Center(
                    child: Text(
                      'applaudiq_embed · consumed via local SDK path',
                      style: TextStyle(fontSize: 12, color: Brand.muted),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Gradient header with the brand logo + title.
class _BrandHero extends StatelessWidget {
  const _BrandHero();

  @override
  Widget build(BuildContext context) {
    final topPad = MediaQuery.of(context).padding.top;
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(24, topPad + 28, 24, 30),
      decoration: const BoxDecoration(
        gradient: Brand.gradient,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.18),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.asset('assets/app_icon.png', fit: BoxFit.cover),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'Applaud IQ',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Flutter embed example',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.82),
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }
}

/// A tappable login-mode card.
class _ModeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool busy;
  final VoidCallback? onTap;

  const _ModeCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.busy = false,
  });

  @override
  Widget build(BuildContext context) {
    final disabled = onTap == null;
    return Opacity(
      opacity: disabled && !busy ? 0.55 : 1,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE8E6F6)),
            ),
            child: Row(
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    gradient: Brand.gradient,
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Brand.ink,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 13,
                          height: 1.35,
                          color: Brand.muted,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                busy
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.4,
                          color: Brand.violet,
                        ),
                      )
                    : const Icon(Icons.chevron_right_rounded,
                        color: Brand.muted),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Colour-coded status indicator driven by the SDK callbacks.
class _StatusPill extends StatelessWidget {
  final _Status kind;
  final String message;

  const _StatusPill({required this.kind, required this.message});

  @override
  Widget build(BuildContext context) {
    final (Color c, IconData i) = switch (kind) {
      _Status.idle => (Brand.muted, Icons.info_outline_rounded),
      _Status.loading => (Brand.violet, Icons.sync_rounded),
      _Status.success => (const Color(0xFF1E9E62), Icons.check_circle_rounded),
      _Status.pending => (const Color(0xFFC07A00), Icons.hourglass_top_rounded),
      _Status.error => (const Color(0xFFD23B53), Icons.error_outline_rounded),
    };
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: c.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          Icon(i, size: 18, color: c),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w600,
                color: c,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Full-screen host for the SDK's `ApplaudIQEmbed` widget.
class _EmbedScreen extends StatelessWidget {
  final ApplaudIQMode mode;
  final String? token;
  final void Function(_Status, String) onStatus;

  const _EmbedScreen({
    required this.mode,
    required this.onStatus,
    this.token,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: ApplaudIQEmbed(
          config: const EmbedConfig(
            key: Config.publishableKey,
            baseUrl: Config.baseUrl,
            ssoCallback: Config.ssoCallback,
          ),
          token: token,
          mode: mode,
          onReady: () => onStatus(_Status.success, 'Signed in'),
          onAuthPending: () =>
              onStatus(_Status.pending, 'Pending HR approval'),
          onError: (m) => onStatus(_Status.error, 'Error: $m'),
          onClose: () => Navigator.of(context).maybePop(),
          onSignOut: () => Navigator.of(context).maybePop(),
        ),
      ),
    );
  }
}
