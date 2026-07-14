import 'package:flutter/material.dart';

class AppColors {
  static const primary      = Color(0xFF0A8F4D);
  static const primaryDark  = Color(0xFF077A40);
  static const primaryLight = Color(0xFF2DA968);
  static const primarySoft  = Color(0xFFE6F4EC);
  static const gold         = Color(0xFFFDBA12);
  static const goldDark     = Color(0xFFE0A200);
  static const textDark     = Color(0xFF1A1A2E);
  static const textMid      = Color(0xFF4A4560);
  static const textMuted    = Color(0xFF8A8A9A);
  static const inputBg      = Color(0xFFF5F5FA);
  static const cardBorder   = Color(0xFFEFEFEF);
  static const white        = Color(0xFFFFFFFF);
  static const success      = Color(0xFF22C55E);
  static const danger       = Color(0xFFEF4444);
  static const warning      = Color(0xFFF59E0B);
  static const background   = Color(0xFFFFFFFF);
}

class AppTheme {
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    fontFamily: 'PlusJakartaSans',
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      primary: AppColors.primary,
      secondary: AppColors.gold,
      background: AppColors.background,
      surface: AppColors.white,
      onPrimary: AppColors.white,
      onBackground: AppColors.textDark,
    ),
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.white,
      foregroundColor: AppColors.textDark,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'PlusJakartaSans',
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: AppColors.textDark,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.white,
        minimumSize: const Size(double.infinity, 56),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        textStyle: const TextStyle(
          fontFamily: 'PlusJakartaSans',
          fontSize: 15,
          fontWeight: FontWeight.w700,
        ),
        elevation: 0,
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.inputBg,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
    cardTheme: CardTheme(
      color: AppColors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: AppColors.cardBorder),
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.white,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textMuted,
      type: BottomNavigationBarType.fixed,
      elevation: 0,
    ),
    textTheme: const TextTheme(
      headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.textDark),
      headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.textDark),
      headlineSmall: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textDark),
      titleLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textDark),
      titleMedium: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textDark),
      bodyLarge: TextStyle(fontSize: 15, fontWeight: FontWeight.w400, color: AppColors.textDark),
      bodyMedium: TextStyle(fontSize: 13, fontWeight: FontWeight.w400, color: AppColors.textMid),
      bodySmall: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.textMuted),
      labelLarge: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary),
    ),
  );
}
