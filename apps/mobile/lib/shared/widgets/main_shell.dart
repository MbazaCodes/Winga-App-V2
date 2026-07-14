import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final index = _indexFromPath(location);

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: index < 0 ? 0 : index,
        onTap: (i) => _navigate(context, i),
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textMuted,
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded),      label: 'Nyumbani'),
          BottomNavigationBarItem(icon: Icon(Icons.navigation_rounded), label: 'Safari'),
          BottomNavigationBarItem(icon: Icon(Icons.add_circle_rounded), label: 'Omba'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_rounded),       label: 'Ujumbe'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded),     label: 'Wasifu'),
        ],
      ),
    );
  }

  int _indexFromPath(String path) {
    if (path.startsWith('/home'))     return 0;
    if (path.startsWith('/requests')) return 1;
    if (path.startsWith('/book'))     return 2;
    if (path.startsWith('/messages')) return 3;
    if (path.startsWith('/profile'))  return 4;
    return 0;
  }

  void _navigate(BuildContext context, int i) {
    switch (i) {
      case 0: context.go('/home');     break;
      case 1: context.go('/requests'); break;
      case 2: context.go('/book');     break;
      case 3: context.go('/messages'); break;
      case 4: context.go('/profile');  break;
    }
  }
}
