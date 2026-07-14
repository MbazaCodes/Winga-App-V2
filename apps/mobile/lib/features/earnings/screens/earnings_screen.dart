import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class EarningsScreen extends StatefulWidget {
  const EarningsScreen({super.key});
  @override State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen> {
  String _period = 'month';

  static const _trips = [
    (customer:'Amina Hassan', date:'2026-07-12', amount:15000),
    (customer:'John Mwangi',  date:'2026-07-10', amount:5000),
  ];

  int get _total => _trips.fold(0, (s, t) => s + t.amount);

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Matumizi Yangu'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        Container(width: double.infinity, padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(gradient: const LinearGradient(colors: [AppColors.primaryDark, AppColors.primary]),
            borderRadius: BorderRadius.circular(24)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Jumla Nililolipa', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            Text('TZS ${_total.toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
              style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w800)),
          ]),
        ),
        const SizedBox(height: 16),
        Row(children: [
          for (final p in [('7','Wiki 7'),('30','Mwezi'),('all','Yote')])
            Expanded(child: GestureDetector(
              onTap: () => setState(() => _period = p.$1),
              child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: p.$1 == 'all' ? 0 : 8),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _period == p.$1 ? AppColors.primary : AppColors.inputBg,
                  borderRadius: BorderRadius.circular(12)),
                child: Text(p.$2, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                  color: _period == p.$1 ? Colors.white : AppColors.textMuted), textAlign: TextAlign.center),
              ),
            )),
        ]),
        const SizedBox(height: 20),
        const Align(alignment: Alignment.centerLeft, child: Text('Historia ya Safari',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark))),
        const SizedBox(height: 12),
        ..._trips.map((t) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: WingaCard(child: Row(children: [
            Container(width: 44, height: 44,
              decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(14)),
              child: const Icon(Icons.trending_up, color: Color(0xFF166534), size: 20)),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(t.customer, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
              Text(t.date, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ])),
            Text('-TZS ${t.amount.toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.danger)),
          ])),
        )),
      ]),
    ),
  );
}