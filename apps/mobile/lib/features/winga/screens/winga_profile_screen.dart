import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class WingaProfileScreen extends StatefulWidget {
  const WingaProfileScreen({super.key});
  @override State<WingaProfileScreen> createState() => _WingaProfileScreenState();
}

class _WingaProfileScreenState extends State<WingaProfileScreen> {
  final _auth = AuthService();
  bool _showQr = false;

  String get _name => (StorageService.getJson(AppConstants.sessionKey)?['name'] as String?) ?? 'Winga';
  String get _wingaId => (StorageService.getJson(AppConstants.sessionKey)?['winga_id'] as String?) ?? 'WNGA-----';

  int get _completion => 45; // would be calculated from profile fields

  Future<void> _logout() async {
    await _auth.signOut();
    await StorageService.remove(AppConstants.sessionKey);
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Wasifu Wangu'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        // Completion bar
        WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Ukamilifu wa Wasifu', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
            Text('$_completion%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800,
              color: _completion >= 75 ? Colors.green : AppColors.warning)),
          ]),
          const SizedBox(height: 8),
          ClipRRect(borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(value: _completion / 100, minHeight: 8,
              backgroundColor: AppColors.inputBg,
              valueColor: AlwaysStoppedAnimation(_completion >= 75 ? Colors.green : AppColors.warning))),
          if (_completion < 75) ...[const SizedBox(height: 6),
            const Text('⚠️ Ukamilifu 75%+ unahitajika ili uonekane kwa wateja',
              style: TextStyle(fontSize: 11, color: AppColors.danger, fontWeight: FontWeight.w600))],
        ])),
        const SizedBox(height: 16),

        // Avatar + name
        CircleAvatar(radius: 44, backgroundColor: AppColors.primarySoft,
          child: Text(_name[0].toUpperCase(), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: AppColors.primary))),
        const SizedBox(height: 10),
        Text(_name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textDark)),
        const SizedBox(height: 4),
        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(99)),
          child: Text(_wingaId, style: const TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textMid))),
        const SizedBox(height: 6),
        Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(99)),
          child: const Text('⭐ Starter', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textMid))),
        const SizedBox(height: 16),

        // Stats
        WingaCard(child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
          for (final s in [('1','Safari'),('100%','Alama'),('⭐','Badge')])
            Column(children: [
              Text(s.$1, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              Text(s.$2, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ]),
        ])),
        const SizedBox(height: 12),

        // Digital ID / QR Code
        WingaCard(child: Column(children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Digital ID Card', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            GestureDetector(onTap: () => setState(() => _showQr = !_showQr),
              child: Text(_showQr ? 'Ficha' : 'Onyesha QR', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary))),
          ]),
          if (_showQr) ...[
            const SizedBox(height: 12),
            QrImageView(data: _wingaId, version: QrVersions.auto, size: 160),
            const SizedBox(height: 6),
            Text(_wingaId, style: const TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textMid)),
          ],
        ])),
        const SizedBox(height: 12),

        // Score progress
        WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Alama za Wateja', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
          const SizedBox(height: 8),
          Row(children: [
            Expanded(child: ClipRRect(borderRadius: BorderRadius.circular(99),
              child: const LinearProgressIndicator(value: 1.0, minHeight: 10,
                backgroundColor: AppColors.inputBg, valueColor: AlwaysStoppedAnimation(AppColors.primary)))),
            const SizedBox(width: 10),
            const Text('100%', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.primary)),
          ]),
          const SizedBox(height: 6),
          const Text('🏆 Unastahili badge ya Verified!', style: TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.w600)),
        ])),
        const SizedBox(height: 16),

        TextButton.icon(onPressed: _logout,
          icon: const Icon(Icons.logout, size: 16, color: AppColors.danger),
          label: const Text('Toka', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.w700))),
        const Text('Winga App v1.0.0', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
        const SizedBox(height: 20),
      ]),
    ),
  );
}