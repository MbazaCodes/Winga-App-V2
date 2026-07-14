import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/phone_utils.dart';
import '../../../shared/widgets/app_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String _tab = 'phone';
  final _phoneCtrl  = TextEditingController();
  final _wingaCtrl  = TextEditingController();
  bool _loading = false;
  String? _error;
  final _auth = AuthService();

  Future<void> _send() async {
    setState(() { _loading = true; _error = null; });
    String phone;
    if (_tab == 'phone') {
      phone = PhoneUtils.clean(_phoneCtrl.text);
      if (phone.length < 9) {
        setState(() { _error = 'Weka namba sahihi ya simu'; _loading = false; }); return;
      }
    } else {
      final id = _wingaCtrl.text.trim().toUpperCase();
      final res = await _auth.lookupWingaId(id);
      if (res.error != null) {
        setState(() { _error = res.error; _loading = false; }); return;
      }
      phone = PhoneUtils.clean(res.phone!);
    }
    final res = await _auth.sendOTP(phone);
    setState(() => _loading = false);
    if (res.error != null) { setState(() => _error = res.error); return; }
    if (mounted) context.go('/otp', extra: phone);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    body: SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            Center(child: Image.asset('assets/images/logo.png', width: 100, height: 100)),
            const SizedBox(height: 24),

            // Tab toggle
            Container(
              height: 52,
              decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(18)),
              padding: const EdgeInsets.all(4),
              child: Row(children: [
                for (final t in [('phone','📱 Namba ya Simu'), ('wingaid','🪪 Winga ID')])
                  Expanded(child: GestureDetector(
                    onTap: () => setState(() { _tab = t.$1; _error = null; }),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      decoration: BoxDecoration(
                        color: _tab == t.$1 ? Colors.white : Colors.transparent,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: _tab == t.$1 ? [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8)] : [],
                      ),
                      child: Center(child: Text(t.$2,
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                          color: _tab == t.$1 ? AppColors.primary : AppColors.textMuted))),
                    ),
                  )),
              ]),
            ),
            const SizedBox(height: 24),

            if (_tab == 'phone') ...[
              Text('Namba ya Simu', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              Row(children: [
                Container(
                  height: 56, padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(18)),
                  alignment: Alignment.center,
                  child: const Text('🇹🇿 +255', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                ),
                const SizedBox(width: 8),
                Expanded(child: TextField(
                  controller: _phoneCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(hintText: '712 345 678'),
                  onSubmitted: (_) => _send(),
                )),
              ]),
              const SizedBox(height: 6),
              const Text('Bila +255 au 0 mwanzoni', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ] else ...[
              Text('Winga ID', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              TextField(
                controller: _wingaCtrl,
                textCapitalization: TextCapitalization.characters,
                decoration: const InputDecoration(hintText: 'WNGA10001'),
                style: const TextStyle(fontFamily: 'monospace', letterSpacing: 2, fontWeight: FontWeight.w700),
                onChanged: (v) => _wingaCtrl.value = _wingaCtrl.value.copyWith(text: v.toUpperCase()),
              ),
            ],

            if (_error != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(14)),
                child: Text(_error!, style: const TextStyle(color: AppColors.danger, fontSize: 13, fontWeight: FontWeight.w600)),
              ),
            ],

            const SizedBox(height: 24),
            AppButton(text: 'Tuma Namba ya Siri →', onTap: _send, isLoading: _loading),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: AppColors.primarySoft, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                const Text('🧪', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 10),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('Demo Mode', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
                  Text('OTP: 123456 kwa namba yoyote', style: const TextStyle(fontSize: 11, color: AppColors.textMid)),
                ]),
              ]),
            ),
          ],
        ),
      ),
    ),
  );
}
