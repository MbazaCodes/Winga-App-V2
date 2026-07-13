import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';

class _Slide { final String emoji, title, subtitle;
  const _Slide(this.emoji, this.title, this.subtitle); }

const _slides = [
  _Slide('🛍️', 'Karibu Winga App!', 'Winga App ni mwongozo wako wa ununuzi Tanzania — haraka, salama, na rahisi.'),
  _Slide('🤝', 'Jinsi Inavyofanya Kazi', 'Omba Winga wa karibu nawe → akununue → akuletee. Rahisi kama hiyo!'),
  _Slide('🔒', 'Salama na ya Kuaminika', 'Wingas wote wamethibitishwa. Malipo salama. Fuatilia safari yako wakati wote.'),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _current = 0;
  final _controller = PageController();

  void _finish() {
    StorageService.setBool(AppConstants.onboardedKey, true);
    context.go('/login');
  }

  void _next() {
    if (_current < _slides.length - 1) {
      _controller.nextPage(duration: const Duration(milliseconds: 350), curve: Curves.easeInOut);
    } else {
      _finish();
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    body: SafeArea(
      child: Column(
        children: [
          Align(
            alignment: Alignment.topRight,
            child: TextButton(onPressed: _finish,
              child: const Text('Ruka →', style: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w600))),
          ),
          Expanded(
            child: PageView.builder(
              controller: _controller,
              onPageChanged: (i) => setState(() => _current = i),
              itemCount: _slides.length,
              itemBuilder: (_, i) {
                final s = _slides[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/images/logo.png', width: 100, height: 100),
                      const SizedBox(height: 32),
                      Text(s.emoji, style: const TextStyle(fontSize: 64)),
                      const SizedBox(height: 24),
                      Text(s.title, style: Theme.of(context).textTheme.headlineSmall, textAlign: TextAlign.center),
                      const SizedBox(height: 12),
                      Text(s.subtitle, style: const TextStyle(color: AppColors.textMuted, height: 1.6, fontSize: 14), textAlign: TextAlign.center),
                    ],
                  ),
                );
              },
            ),
          ),
          // Dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_slides.length, (i) => AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _current == i ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _current == i ? AppColors.primary : AppColors.inputBg,
                borderRadius: BorderRadius.circular(99),
              ),
            )),
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: AppButton(
              text: _current < _slides.length - 1 ? 'Endelea →' : 'Anza Sasa →',
              onTap: _next,
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    ),
  );
}
