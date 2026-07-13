import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';

class NameScreen extends StatefulWidget {
  const NameScreen({super.key});
  @override
  State<NameScreen> createState() => _NameScreenState();
}

class _NameScreenState extends State<NameScreen> {
  final _ctrl = TextEditingController();
  bool _loading = false;
  final _auth = AuthService();

  Future<void> _save() async {
    if (_ctrl.text.trim().length < 2) return;
    setState(() => _loading = true);
    final session = StorageService.getJson(AppConstants.sessionKey);
    if (session != null) {
      await _auth.saveName(session['id'], _ctrl.text.trim());
      session['name'] = _ctrl.text.trim();
      await StorageService.setJson(AppConstants.sessionKey, session);
    }
    setState(() => _loading = false);
    if (mounted) context.go(session?['user_type'] == 'winga' ? '/winga/home' : '/home');
  }

  void _skip() {
    final session = StorageService.getJson(AppConstants.sessionKey);
    context.go(session?['user_type'] == 'winga' ? '/winga/home' : '/home');
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 32),
            const Text('👋', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 16),
            Text('Jina lako ni nani?', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Tutakusaidia vizuri zaidi tukijua jina lako.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 14)),
            const SizedBox(height: 32),
            const Text('JINA KAMILI', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700,
                color: AppColors.textMuted, letterSpacing: 0.5)),
            const SizedBox(height: 8),
            TextField(controller: _ctrl, autofocus: true,
              decoration: const InputDecoration(hintText: 'Mfano: David Mbazza'),
              onSubmitted: (_) => _save()),
            const SizedBox(height: 24),
            AppButton(text: 'Hifadhi Jina →', onTap: _save, isLoading: _loading),
            const SizedBox(height: 12),
            AppButton(text: 'Ruka kwa sasa', onTap: _skip, isGhost: true),
          ],
        ),
      ),
    ),
  );
}
