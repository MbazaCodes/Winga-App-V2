import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class WingaEarningsScreen extends StatefulWidget {
  const WingaEarningsScreen({super.key});
  @override State<WingaEarningsScreen> createState() => _WingaEarningsScreenState();
}

class _WingaEarningsScreenState extends State<WingaEarningsScreen> {
  String _period = 'month';

  static const _trips = [
    (customer:'Sarah Kimani', date:'2026-07-12', gross:5000, net:4250, tip:0),
    (customer:'Ali Hassan',   date:'2026-07-10', gross:15000, net:12750, tip:500),
  ];

  int get _gross => _trips.fold(0, (s,t) => s + t.gross);
  int get _net   => _trips.fold(0, (s,t) => s + t.net);
  int get _tips  => _trips.fold(0, (s,t) => s + t.tip);
  int get _tax   => (_gross * 0.03).round();
  int get _fee   => (_gross * 0.12).round();

  String _fmt(int v) => v.toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",");

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Mapato Yangu'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(children: [
        Container(width: double.infinity, padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(gradient: const LinearGradient(colors: [AppColors.primaryDark, AppColors.primary]),
            borderRadius: BorderRadius.circular(24)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Jumla ya Mapato (Gross)', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            Text('TZS ${_fmt(_gross)}', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
          ])),
        const SizedBox(height: 14),
        Row(children: [
          Expanded(child: WingaCard(child: Column(children: [
            const Text('Kipato 85%', style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('TZS ${_fmt(_net)}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF166534))),
          ]))),
          const SizedBox(width: 8),
          Expanded(child: WingaCard(child: Column(children: [
            const Text('Tips', style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('TZS ${_fmt(_tips)}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.gold)),
          ]))),
          const SizedBox(width: 8),
          Expanded(child: WingaCard(child: Column(children: [
            const Text('TRA 3%', style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('TZS ${_fmt(_tax)}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.danger)),
          ]))),
        ]),
        const SizedBox(height: 14),
        WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('MGAWANYO WA MAPATO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
          const SizedBox(height: 12),
          for (final r in [('Gross (Jumla)', _gross, AppColors.textDark, false),
            ('Ada ya App 12%', -_fee, AppColors.danger, false),
            ('Kodi TRA 3%', -_tax, AppColors.danger, false),
            ('Kipato Chako 85%', _net, const Color(0xFF166534), true)])
            Padding(padding: const EdgeInsets.only(bottom: 8),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(r.$1, style: TextStyle(fontSize: 13, fontWeight: r.$4 ? FontWeight.w700 : FontWeight.w500, color: AppColors.textMid)),
                Text('TZS ${_fmt(r.$2.abs())}', style: TextStyle(fontSize: 13, fontWeight: r.$4 ? FontWeight.w800 : FontWeight.w700, color: r.$3)),
              ])),
        ])),
        const SizedBox(height: 16),
        Row(children: [
          for (final p in [('today','Leo'),('week','Wiki'),('month','Mwezi'),('all','Yote')])
            Expanded(child: GestureDetector(onTap: () => setState(() => _period = p.$1),
              child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: p.$1 == 'all' ? 0 : 6),
                padding: const EdgeInsets.symmetric(vertical: 9),
                decoration: BoxDecoration(
                  color: _period == p.$1 ? AppColors.primary : AppColors.inputBg,
                  borderRadius: BorderRadius.circular(12)),
                child: Text(p.$2, textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700,
                  color: _period == p.$1 ? Colors.white : AppColors.textMuted))))),
        ]),
        const SizedBox(height: 16),
        const Align(alignment: Alignment.centerLeft, child: Text('Historia ya Safari',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark))),
        const SizedBox(height: 10),
        ..._trips.map((t) => Padding(padding: const EdgeInsets.only(bottom: 10),
          child: WingaCard(child: Row(children: [
            Container(width: 44, height: 44,
              decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(14)),
              child: const Icon(Icons.trending_up, color: Color(0xFF166534), size: 20)),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(t.customer, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
              Text(t.date, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ])),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text('+TZS ${_fmt(t.net)}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF166534))),
              Text('Gross: ${_fmt(t.gross)}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ]),
          ]))),
        ),
      ]),
    ),
  );
}