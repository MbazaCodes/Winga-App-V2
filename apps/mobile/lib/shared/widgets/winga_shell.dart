import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';

class WingaShell extends StatelessWidget {
  final Widget child;
  const WingaShell({super.key, required this.child});

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
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded),    label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.list_alt_rounded),     label: 'Maombi'),
          BottomNavigationBarItem(icon: Icon(Icons.trending_up_rounded),  label: 'Mapato'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded),       label: 'Wasifu'),
        ],
      ),
    );
  }

  int _indexFromPath(String path) {
    if (path.startsWith('/winga/home'))     return 0;
    if (path.startsWith('/winga/requests')) return 1;
    if (path.startsWith('/winga/earnings')) return 2;
    if (path.startsWith('/winga/profile'))  return 3;
    return 0;
  }

  void _navigate(BuildContext context, int i) {
    switch (i) {
      case 0: context.go('/winga/home');     break;
      case 1: context.go('/winga/requests'); break;
      case 2: context.go('/winga/earnings'); break;
      case 3: context.go('/winga/profile');  break;
    }
  }
}
