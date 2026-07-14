import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _barController;
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;

  @override
  void initState() {
    super.initState();
    _logoController = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _barController  = AnimationController(vsync: this, duration: const Duration(milliseconds: 2300));
    _logoScale   = CurvedAnimation(parent: _logoController, curve: Curves.elasticOut).drive(Tween(begin: 0.6, end: 1.0));
    _logoOpacity = _logoController.drive(Tween(begin: 0.0, end: 1.0));
    _logoController.forward();
    Future.delayed(const Duration(milliseconds: 600), () => _barController.forward());
    Future.delayed(const Duration(milliseconds: 2800), _navigate);
  }

  void _navigate() {
    if (!mounted) return;
    final session  = StorageService.getJson(AppConstants.sessionKey);
    final onboarded = StorageService.getBool(AppConstants.onboardedKey);
    if (session != null) {
      context.go(session['user_type'] == 'winga' ? '/winga/home' : '/home');
    } else if (onboarded) {
      context.go('/login');
    } else {
      context.go('/onboarding');
    }
  }

  @override
  void dispose() {
    _logoController.dispose();
    _barController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ScaleTransition(
            scale: _logoScale,
            child: FadeTransition(
              opacity: _logoOpacity,
              child: Image.asset('assets/images/logo.png', width: 180, height: 180),
            ),
          ),
          const SizedBox(height: 12),
          FadeTransition(
            opacity: _logoOpacity,
            child: const Text(
              "TANZANIA'S SERVICES GUIDE",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600,
                  color: AppColors.textMuted, letterSpacing: 2),
            ),
          ),
          const SizedBox(height: 60),
          AnimatedBuilder(
            animation: _barController,
            builder: (_, __) => Container(
              width: 180, height: 4,
              decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(99)),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  width: 180 * _barController.value,
                  height: 4,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.primary, AppColors.gold]),
                    borderRadius: BorderRadius.circular(99),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
