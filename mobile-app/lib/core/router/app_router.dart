import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/onboarding_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/otp_screen.dart';
import '../../features/auth/screens/name_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/book/screens/book_screen.dart';
import '../../features/requests/screens/requests_screen.dart';
import '../../features/messages/screens/messages_screen.dart';
import '../../features/messages/screens/chat_screen.dart';
import '../../features/earnings/screens/earnings_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/winga/screens/winga_home_screen.dart';
import '../../features/winga/screens/winga_requests_screen.dart';
import '../../features/winga/screens/winga_earnings_screen.dart';
import '../../features/winga/screens/winga_profile_screen.dart';
import '../../features/winga/screens/winga_register_screen.dart';
import '../services/storage_service.dart';
import '../constants/app_constants.dart';
import '../../shared/widgets/main_shell.dart';
import '../../shared/widgets/winga_shell.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final path = state.matchedLocation;
      final session = StorageService.getJson(AppConstants.sessionKey);
      final onboarded = StorageService.getBool(AppConstants.onboardedKey);
      final isAuth = ['/splash','/onboarding','/login','/otp','/name','/winga-register'].contains(path);

      if (session != null && isAuth && path != '/splash') {
        final userType = session['user_type'];
        return userType == 'winga' ? '/winga/home' : '/home';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/splash',      builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/onboarding',  builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/login',       builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/otp',         builder: (_, s)  => OtpScreen(phone: s.extra as String? ?? '')),
      GoRoute(path: '/name',        builder: (_, __) => const NameScreen()),
      GoRoute(path: '/winga-register', builder: (_, __) => const WingaRegisterScreen()),

      // Customer shell (bottom nav)
      ShellRoute(
        builder: (_, __, child) => MainShell(child: child),
        routes: [
          GoRoute(path: '/home',     builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/book',     builder: (_, __) => const BookScreen()),
          GoRoute(path: '/requests', builder: (_, __) => const RequestsScreen()),
          GoRoute(path: '/earnings', builder: (_, __) => const EarningsScreen()),
          GoRoute(path: '/messages', builder: (_, __) => const MessagesScreen()),
          GoRoute(path: '/messages/:id', builder: (_, s) => ChatScreen(requestId: s.pathParameters['id']!)),
          GoRoute(path: '/profile',  builder: (_, __) => const ProfileScreen()),
        ],
      ),

      // Winga shell (bottom nav)
      ShellRoute(
        builder: (_, __, child) => WingaShell(child: child),
        routes: [
          GoRoute(path: '/winga/home',     builder: (_, __) => const WingaHomeScreen()),
          GoRoute(path: '/winga/requests', builder: (_, __) => const WingaRequestsScreen()),
          GoRoute(path: '/winga/earnings', builder: (_, __) => const WingaEarningsScreen()),
          GoRoute(path: '/winga/profile',  builder: (_, __) => const WingaProfileScreen()),
        ],
      ),
    ],
  );
});
