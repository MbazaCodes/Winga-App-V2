import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _auth = AuthService();

  String get _name {
    final s = StorageService.getJson(AppConstants.sessionKey);
    return (s?['name'] as String?) ?? 'Mteja';
  }
  String get _phone {
    final s = StorageService.getJson(AppConstants.sessionKey);
    return '+255 ${s?['phone'] ?? '---'}';
  }

  Future<void> _logout() async {
    await _auth.signOut();
    await StorageService.remove(AppConstants.sessionKey);
    if (mounted) context.go('/login');
  }

  static const _menu = [
    (Icons.navigation_rounded, 'Safari Zangu',  '/requests'),
    (Icons.trending_up_rounded,'Matumizi',       '/earnings'),
    (Icons.chat_rounded,       'Ujumbe',         '/messages'),
    (Icons.people_rounded,     'Alika Rafiki',   '/referral'),
    (Icons.notifications_rounded,'Arifa',        '/notifications'),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Wasifu Wangu'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        CircleAvatar(radius: 48, backgroundColor: AppColors.primarySoft,
          child: Text(_name[0].toUpperCase(), style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w800, color: AppColors.primary))),
        const SizedBox(height: 12),
        Text(_name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textDark)),
        const SizedBox(height: 4),
        Text(_phone, style: const TextStyle(color: AppColors.textMuted)),
        const SizedBox(height: 8),
        Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(color: const Color(0xFFFEF9C3), borderRadius: BorderRadius.circular(99)),
          child: const Text('👤 Mteja', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF92400E)))),
        const SizedBox(height: 20),
        // Stats
        Container(padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.cardBorder)),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
            for (final s in [('2','Safari'), ('1','Zilizokamilika'), ('0','Pochi')])
              Column(children: [
                Text(s.$1, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                Text(s.$2, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ]),
          ])),
        const SizedBox(height: 16),
        // Menu
        Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.cardBorder)),
          child: Column(children: _menu.asMap().entries.map((e) {
            final item = e.value;
            return ListTile(
              leading: Container(width: 38, height: 38,
                decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(12)),
                child: Icon(item.$1, size: 18, color: AppColors.primary)),
              title: Text(item.$2, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              trailing: const Icon(Icons.chevron_right, size: 18, color: AppColors.textMuted),
              onTap: () => context.go(item.$3),
            );
          }).toList()),
        ),
        const SizedBox(height: 16),
        // Become Winga CTA
        Container(padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFFFEF9C3), Color(0xFFFFFBEB)]),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFDE68A))),
          child: Row(children: [
            const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Jiunge kama Winga! 🚀', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF78350F))),
              SizedBox(height: 2),
              Text('Pata pesa ukisaidia wengine kununua', style: TextStyle(fontSize: 12, color: Color(0xFF92400E))),
            ])),
            GestureDetector(
              onTap: () => context.go('/winga-register'),
              child: Container(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(color: AppColors.gold, borderRadius: BorderRadius.circular(12)),
                child: const Text('Jisajili', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12))),
            ),
          ])),
        const SizedBox(height: 16),
        TextButton.icon(onPressed: _logout,
          icon: const Icon(Icons.logout, size: 16, color: AppColors.danger),
          label: const Text('Toka', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.w700))),
        const SizedBox(height: 4),
        const Text('Winga App v1.0.0', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
        const SizedBox(height: 20),
      ]),
    ),
  );
}