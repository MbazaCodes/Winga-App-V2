import 'package:flutter/material.dart';
import '../../core/models/request_model.dart';
import '../../core/theme/app_theme.dart';

class StatusBadge extends StatelessWidget {
  final RequestStatus status;
  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final (label, bg, fg) = switch (status) {
      RequestStatus.searching  => ('Inatafuta',  const Color(0xFFFEF9C3), const Color(0xFF92400E)),
      RequestStatus.accepted   => ('Imekubaliwa',const Color(0xFFDBEAFE), const Color(0xFF1D4ED8)),
      RequestStatus.shopping   => ('Inanunua',   AppColors.primarySoft,   AppColors.primary),
      RequestStatus.completed  => ('Imekamilika',const Color(0xFFDCFCE7), const Color(0xFF166534)),
      RequestStatus.cancelled  => ('Imehairishwa',const Color(0xFFFEE2E2),const Color(0xFF991B1B)),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Text(label, style: TextStyle(color: fg, fontSize: 11, fontWeight: FontWeight.w700)),
    );
  }
}
