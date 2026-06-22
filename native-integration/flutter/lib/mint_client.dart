import 'dart:convert';

import 'package:http/http.dart' as http;

import 'config.dart';

/// Returns a one-time `embedToken` for AUTO login. Manual login needs none of this.
///
/// PRODUCTION: your backend mints the token (the `aiq_embed_` secret stays server-side) and you POST
/// your own mint endpoint (`Config.mintEndpoint`). For a quick LOCAL test, set `Config.testEmbedSecret`
/// and the app mints directly against the portal — never ship a real secret in an app.
Future<String> getEmbedToken() async {
  if (Config.testEmbedSecret.isNotEmpty) {
    final r = await http.post(
      Uri.parse('${Config.baseUrl}/api/v1/embed/sessions'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${Config.testEmbedSecret}',
      },
      body: jsonEncode({
        'employee': {'email': Config.demoEmail},
        'autoProvision': true,
      }),
    );
    final j = jsonDecode(r.body) as Map<String, dynamic>;
    final data = j['data'] as Map<String, dynamic>?;
    final token = (data?['embedToken'] ?? j['embedToken']) as String?;
    if (token == null) throw Exception('mint failed: ${r.statusCode} ${r.body}');
    return token;
  }
  final r = await http.post(Uri.parse(Config.mintEndpoint));
  final j = jsonDecode(r.body) as Map<String, dynamic>;
  final token = j['embedToken'] as String?;
  if (token == null) throw Exception('mint failed: ${r.statusCode}');
  return token;
}
