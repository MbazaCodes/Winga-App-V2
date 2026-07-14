import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';
import '../constants/app_constants.dart';

class AuthService {
  final _supabase = Supabase.instance.client;

  bool get isDemo =>
      AppConstants.supabaseUrl.contains('placeholder') ||
      AppConstants.supabaseUrl.contains('your-project');

  // Send OTP
  Future<({String? error})> sendOTP(String phone) async {
    if (isDemo) {
      await Future.delayed(const Duration(milliseconds: 800));
      return (error: null);
    }
    try {
      await _supabase.auth.signInWithOtp(phone: '+255$phone');
      return (error: null);
    } catch (e) {
      return (error: 'Hitilafu ya mtandao. Jaribu tena.');
    }
  }

  // Verify OTP
  Future<({UserModel? user, String? error})> verifyOTP(String phone, String token) async {
    if (isDemo) {
      await Future.delayed(const Duration(milliseconds: 800));
      if (token != AppConstants.demoOtp) {
        return (user: null, error: 'Nambari ya siri si sahihi. Tumia 123456.');
      }
      final user = UserModel(
        id: 'demo-$phone',
        phone: phone,
        name: null,
        userType: phone == '685006000' ? UserType.winga : UserType.customer,
        createdAt: DateTime.now(),
      );
      return (user: user, error: null);
    }
    try {
      final res = await _supabase.auth.verifyOTP(
        phone: '+255$phone', token: token, type: OtpType.sms,
      );
      if (res.user == null) return (user: null, error: 'Nambari ya siri si sahihi.');
      final profile = await _supabase
          .from('users').select().eq('id', res.user!.id).single();
      return (user: UserModel.fromJson(profile), error: null);
    } catch (e) {
      return (user: null, error: 'Hitilafu ya mtandao. Jaribu tena.');
    }
  }

  // Save name
  Future<void> saveName(String userId, String name) async {
    if (isDemo) return;
    await _supabase.from('users').update({'name': name}).eq('id', userId);
  }

  // Lookup Winga by ID
  Future<({String? phone, String? error})> lookupWingaId(String wingaId) async {
    if (isDemo) {
      if (wingaId == 'WNGA10001') return (phone: '685006000', error: null);
      return (phone: null, error: 'Winga ID haikupatikana.');
    }
    try {
      final res = await _supabase.rpc('lookup_winga_by_id', params: {'winga_id': wingaId});
      return (phone: res['phone'] as String?, error: null);
    } catch (e) {
      return (phone: null, error: 'Hitilafu ya mtandao.');
    }
  }

  // Sign out
  Future<void> signOut() async {
    if (!isDemo) await _supabase.auth.signOut();
  }

  // Biometric auth check
  Future<bool> canUseBiometrics() async {
    try {
      final auth = LocalAuthentication();
      return await auth.canCheckBiometrics;
    } catch (_) { return false; }
  }

  Future<bool> authenticateWithBiometrics() async {
    try {
      final auth = LocalAuthentication();
      return await auth.authenticate(
        localizedReason: 'Thibitisha utambulisho wako kuingia Winga',
        options: const AuthenticationOptions(biometricOnly: false),
      );
    } catch (_) { return false; }
  }
}

import 'package:local_auth/local_auth.dart';
