import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StorageService {
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static String? get(String key) => _prefs?.getString(key);
  static Future<bool> set(String key, String value) async =>
      await _prefs?.setString(key, value) ?? false;
  static Future<bool> remove(String key) async =>
      await _prefs?.remove(key) ?? false;
  static bool getBool(String key) => _prefs?.getBool(key) ?? false;
  static Future<bool> setBool(String key, bool value) async =>
      await _prefs?.setBool(key, value) ?? false;

  static Map<String, dynamic>? getJson(String key) {
    final raw = get(key);
    if (raw == null) return null;
    try { return jsonDecode(raw); } catch (_) { return null; }
  }

  static Future<bool> setJson(String key, Map<String, dynamic> value) =>
      set(key, jsonEncode(value));
}
