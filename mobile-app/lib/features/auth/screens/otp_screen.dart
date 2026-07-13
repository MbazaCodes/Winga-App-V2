import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';

class OtpScreen extends StatefulWidget {
  final String phone;
  const OtpScreen({super.key, required this.phone});
  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  String _otp = '';
  bool _loading = false;
  String? _error;
  int _timeLeft = AppConstants.otpTimerSeconds;
  final _auth = AuthService();

  @override
  void initState() { super.initState(); _startTimer(); }

  void _startTimer() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => _timeLeft = (_timeLeft - 1).clamp(0, 999));
      return _timeLeft > 0;
    });
  }

  Future<void> _verify() async {
    if (_otp.length < 6) return;
    setState(() { _loading = true; _error = null; });
    final res = await _auth.verifyOTP(widget.phone, _otp);
    setState(() => _loading = false);
    if (res.error != null) { setState(() => _error = res.error); return; }
    final user = res.user!;
    await StorageService.setJson(AppConstants.sessionKey, user.toJson());
    if (!mounted) return;
    final isPlaceholder = user.name == null || ['mteja','customer',''].contains(user.name!.toLowerCase());
    if (isPlaceholder) { context.go('/name'); return; }
    context.go(user.userType.name == 'winga' ? '/winga/home' : '/home');
  }

  Future<void> _resend() async {
    setState(() { _timeLeft = AppConstants.otpTimerSeconds; _error = null; });
    await _auth.sendOTP(widget.phone);
    _startTimer();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextButton.icon(
                onPressed: () => context.go('/login'),
                icon: const Icon(Icons.arrow_back_rounded, size: 18),
                label: const Text('Rudi nyuma'),
                style: TextButton.styleFrom(foregroundColor: AppColors.textMuted),
              ),
              const SizedBox(height: 16),
              Text('Ingiza Nambari ya Siri', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 8),
              Text('Tumia OTP iliyotumwa kwa +255 ${widget.phone}',
                style: const TextStyle(color: AppColors.textMuted, fontSize: 14)),
              const SizedBox(height: 40),

              Center(child: Pinput(
                length: 6,
                onCompleted: (v) { _otp = v; _verify(); },
                onChanged: (v) => _otp = v,
                defaultPinTheme: PinTheme(
                  width: 52, height: 60,
                  textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.textDark),
                  decoration: BoxDecoration(
                    color: AppColors.inputBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.inputBg, width: 2),
                  ),
                ),
                focusedPinTheme: PinTheme(
                  width: 52, height: 60,
                  textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.primary),
                  decoration: BoxDecoration(
                    color: AppColors.inputBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.primary, width: 2),
                  ),
                ),
              )),

              if (_error != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(14)),
                  child: Text(_error!, style: const TextStyle(color: AppColors.danger, fontWeight: FontWeight.w600, fontSize: 13)),
                ),
              ],

              const SizedBox(height: 32),
              AppButton(text: 'Thibitisha →', onTap: _verify, isLoading: _loading),
              const SizedBox(height: 20),
              Center(child: _timeLeft > 0
                ? Text('Tuma tena baada ya ${_timeLeft}s',
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 13))
                : TextButton(onPressed: _resend,
                    child: const Text('Tuma tena OTP', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700))),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
