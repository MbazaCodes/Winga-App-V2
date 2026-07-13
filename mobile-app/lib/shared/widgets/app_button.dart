import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onTap;
  final bool isLoading;
  final bool isGhost;
  final Color? color;

  const AppButton({
    super.key, required this.text, this.onTap,
    this.isLoading = false, this.isGhost = false, this.color,
  });

  @override
  Widget build(BuildContext context) => SizedBox(
    width: double.infinity,
    height: 56,
    child: isGhost
      ? OutlinedButton(
          onPressed: isLoading ? null : onTap,
          style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            side: const BorderSide(color: AppColors.cardBorder),
          ),
          child: Text(text, style: const TextStyle(color: AppColors.textMid, fontWeight: FontWeight.w700)),
        )
      : ElevatedButton(
          onPressed: isLoading ? null : onTap,
          style: ElevatedButton.styleFrom(
            backgroundColor: color ?? AppColors.primary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          ),
          child: isLoading
            ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
            : Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
        ),
  );
}
