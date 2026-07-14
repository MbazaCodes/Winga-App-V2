import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/phone_utils.dart';
import '../../../shared/widgets/app_button.dart';

class WingaRegisterScreen extends StatefulWidget {
  const WingaRegisterScreen({super.key});
  @override State<WingaRegisterScreen> createState() => _WingaRegisterScreenState();
}

class _WingaRegisterScreenState extends State<WingaRegisterScreen> {
  int _step = 1;
  bool _loading = false;
  final _auth = AuthService();

  // Step 1
  final _firstCtrl = TextEditingController();
  final _lastCtrl  = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _nidaCtrl  = TextEditingController();

  // Step 2
  List<String> _specialties = [];
  String _city = 'Dar es Salaam';
  final _areaCtrl = TextEditingController();
  final _bioCtrl  = TextEditingController();

  // Step 3
  String _otp = '';
  String? _otpError;

  static const _cities = ['Dar es Salaam','Mwanza','Arusha','Dodoma','Mbeya','Tanga','Zanzibar','Morogoro'];
  static const _specs  = ['Vyakula','Mavazi','Dawa','Simu/Elec','Samani','Ujenzi','Uzuri','Shule','Nyumba/Ardhi','Magari','MC/DJ'];

  int get _completion => 20
    + (_firstCtrl.text.isNotEmpty ? 10 : 0) + (_lastCtrl.text.isNotEmpty ? 10 : 0)
    + (_phoneCtrl.text.isNotEmpty ? 15 : 0) + (_nidaCtrl.text.isNotEmpty ? 15 : 0)
    + (_specialties.isNotEmpty ? 15 : 0) + (_areaCtrl.text.isNotEmpty ? 10 : 0)
    + (_bioCtrl.text.isNotEmpty ? 5 : 0);

  Future<void> _step1Next() async {
    if (_firstCtrl.text.isEmpty || _lastCtrl.text.isEmpty) { _err('Weka jina lako kamili'); return; }
    if (PhoneUtils.clean(_phoneCtrl.text).length < 9) { _err('Weka namba sahihi ya simu'); return; }
    if (_nidaCtrl.text.isEmpty) { _err('Namba ya NIDA inahitajika'); return; }
    setState(() => _step = 2);
  }

  Future<void> _step2Next() async {
    if (_specialties.isEmpty) { _err('Chagua utaalamu mmoja angalau'); return; }
    if (_areaCtrl.text.isEmpty) { _err('Weka eneo lako'); return; }
    setState(() { _loading = true; });
    final clean = PhoneUtils.clean(_phoneCtrl.text);
    await _auth.sendOTP(clean);
    setState(() { _loading = false; _step = 3; });
  }

  Future<void> _verify() async {
    if (_otp.length < 6) return;
    if (_otp != AppConstants.demoOtp) { setState(() => _otpError = 'Nambari ya siri si sahihi. Tumia 123456.'); return; }
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1000));
    await StorageService.setJson(AppConstants.sessionKey, {
      'id': 'winga-demo','phone': PhoneUtils.clean(_phoneCtrl.text),
      'name': '${_firstCtrl.text} ${_lastCtrl.text}','user_type': 'winga',
    });
    setState(() => _loading = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🎉 Umesajiliwa! Karibu Winga App.'), backgroundColor: Colors.green));
      context.go('/winga/home');
    }
  }

  void _err(String msg) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: AppColors.danger));

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: Text('Jiunge kama Winga — Hatua $_step ya 3'), backgroundColor: Colors.white, elevation: 0),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Step indicators
        Row(children: List.generate(3, (i) {
          final n = i + 1;
          final done = _step > n; final active = _step == n;
          return Expanded(child: Row(children: [
            CircleAvatar(radius: 16, backgroundColor: done ? Colors.green : active ? AppColors.primary : AppColors.inputBg,
              child: done ? const Icon(Icons.check, size: 14, color: Colors.white)
                : Text('$n', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                    color: active ? Colors.white : AppColors.textMuted))),
            if (n < 3) Expanded(child: Container(height: 2, margin: const EdgeInsets.symmetric(horizontal: 4),
              color: _step > n ? Colors.green : AppColors.inputBg)),
          ]));
        })),
        const SizedBox(height: 16),

        // Completion bar
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Text('Ukamilifu', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
          Text('$_completion%', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.primary)),
        ]),
        const SizedBox(height: 4),
        ClipRRect(borderRadius: BorderRadius.circular(99),
          child: LinearProgressIndicator(value: _completion / 100, minHeight: 6,
            backgroundColor: AppColors.inputBg, valueColor: const AlwaysStoppedAnimation(AppColors.primary))),
        const SizedBox(height: 24),

        if (_step == 1) ...[
          Text('Maelezo ya Kibinafsi', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 20),
          Row(children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('JINA LA KWANZA', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
              const SizedBox(height: 6),
              TextField(controller: _firstCtrl, decoration: const InputDecoration(hintText: 'David'), onChanged: (_) => setState((){})),
            ])),
            const SizedBox(width: 10),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('JINA LA MWISHO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
              const SizedBox(height: 6),
              TextField(controller: _lastCtrl, decoration: const InputDecoration(hintText: 'Mbazza'), onChanged: (_) => setState((){})),
            ])),
          ]),
          const SizedBox(height: 16),
          const Text('NAMBA YA SIMU', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          Row(children: [
            Container(height: 56, padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(18)),
              alignment: Alignment.center,
              child: const Text('🇹🇿 +255', style: TextStyle(fontWeight: FontWeight.w700))),
            const SizedBox(width: 8),
            Expanded(child: TextField(controller: _phoneCtrl, keyboardType: TextInputType.phone,
              decoration: const InputDecoration(hintText: '712 345 678'), onChanged: (_) => setState((){}))),
          ]),
          const SizedBox(height: 16),
          const Text('NAMBA YA NIDA *', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          TextField(controller: _nidaCtrl, decoration: const InputDecoration(hintText: '19XXXXXXXXXXXXXXXXX'),
            style: const TextStyle(fontFamily: 'monospace', letterSpacing: 1), onChanged: (_) => setState((){})),
          const SizedBox(height: 6),
          const Text('Inahifadhiwa salama — admin peke yake anaona', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
          const SizedBox(height: 24),
          AppButton(text: 'Endelea → Hatua 2', onTap: _step1Next),
        ]

        else if (_step == 2) ...[
          Text('Maelezo ya Kazi', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 20),
          const Text('UTAALAMU', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: _specs.map((s) => GestureDetector(
            onTap: () => setState(() => _specialties.contains(s) ? _specialties.remove(s) : _specialties.add(s)),
            child: AnimatedContainer(duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: _specialties.contains(s) ? AppColors.primary : AppColors.inputBg,
                borderRadius: BorderRadius.circular(99)),
              child: Text(s, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600,
                color: _specialties.contains(s) ? Colors.white : AppColors.textMid))),
          )).toList()),
          const SizedBox(height: 16),
          const Text('MJI', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(value: _city,
            decoration: const InputDecoration(),
            items: _cities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
            onChanged: (v) => setState(() => _city = v!)),
          const SizedBox(height: 16),
          const Text('ENEO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          TextField(controller: _areaCtrl, decoration: const InputDecoration(hintText: 'Mfano: Kariakoo, Mwenge...'), onChanged: (_) => setState((){})),
          const SizedBox(height: 16),
          const Text('BIO (HIARI)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          TextField(controller: _bioCtrl, maxLines: 3,
            decoration: const InputDecoration(hintText: 'Jielezeee — uzoefu wako, unafanya nini vizuri...'), onChanged: (_) => setState((){})),
          const SizedBox(height: 24),
          Row(children: [
            Expanded(child: AppButton(text: '← Rudi', onTap: () => setState(() => _step = 1), isGhost: true)),
            const SizedBox(width: 12),
            Expanded(child: AppButton(text: 'Endelea → OTP', onTap: _step2Next, isLoading: _loading)),
          ]),
        ]

        else ...[
          Text('Thibitisha Simu', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          Text('OTP imetumwa kwa +255 ${PhoneUtils.clean(_phoneCtrl.text)}',
            style: const TextStyle(color: AppColors.textMuted, fontSize: 14)),
          const SizedBox(height: 32),
          Center(child: Pinput(length: 6, onCompleted: (v) { _otp = v; _verify(); }, onChanged: (v) => _otp = v,
            defaultPinTheme: PinTheme(width: 52, height: 60,
              textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.textDark),
              decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.inputBg, width: 2))),
            focusedPinTheme: PinTheme(width: 52, height: 60,
              textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.primary),
              decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary, width: 2))))),
          if (_otpError != null) ...[
            const SizedBox(height: 14),
            Container(padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(14)),
              child: Text(_otpError!, style: const TextStyle(color: AppColors.danger, fontWeight: FontWeight.w600, fontSize: 13))),
          ],
          const SizedBox(height: 24),
          AppButton(text: 'Thibitisha →', onTap: _verify, isLoading: _loading),
          const SizedBox(height: 12),
          AppButton(text: '← Rudi', onTap: () => setState(() { _step = 2; _otpError = null; }), isGhost: true),
        ],
      ]),
    ),
  );
}