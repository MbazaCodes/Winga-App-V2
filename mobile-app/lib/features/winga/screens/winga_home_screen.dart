import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class WingaHomeScreen extends StatefulWidget {
  const WingaHomeScreen({super.key});
  @override State<WingaHomeScreen> createState() => _WingaHomeScreenState();
}

class _WingaHomeScreenState extends State<WingaHomeScreen> {
  bool _online = false;
  List<Map<String,dynamic>> _available = [
    {'id':'r1','customer':'Sarah Kimani','category':'Vyakula 🛒','service':'Saa 1','area':'Kariakoo','price':5000,'notes':'Mchele na sukari'},
    {'id':'r2','customer':'Ali Hassan',  'category':'Dawa 💊',   'service':'Nusu Siku','area':'Mwenge','price':15000,'notes':null},
  ];
  List<Map<String,dynamic>> _myRequests = [];

  void _toggle() {
    setState(() => _online = !_online);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(_online ? '✅ Uko Mtandaoni!' : '⏸️ Umesimama'),
      backgroundColor: _online ? Colors.green : Colors.orange,
    ));
  }

  void _accept(Map<String,dynamic> req) {
    setState(() {
      _available.removeWhere((r) => r['id'] == req['id']);
      _myRequests.add({...req, 'status': 'accepted'});
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('✅ Umekubali ombi la ${req['customer']}!'), backgroundColor: Colors.green));
  }

  void _advance(String id, String next) {
    setState(() {
      final i = _myRequests.indexWhere((r) => r['id'] == id);
      if (i >= 0) _myRequests[i] = {..._myRequests[i], 'status': next};
    });
    if (next == 'completed') ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('🎉 Safari imekamilika!'), backgroundColor: Colors.green));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: _online ? AppColors.primary : Colors.white,
    body: CustomScrollView(slivers: [
      SliverToBoxAdapter(child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        color: _online ? AppColors.primary : Colors.white,
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(DateTime.now().toString().substring(0,10),
                style: TextStyle(fontSize: 11, color: _online ? Colors.white60 : AppColors.textMuted, fontWeight: FontWeight.w600)),
              Text('Habari, Winga! ${_online ? "🟢" : "⚫"}',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: _online ? Colors.white : AppColors.textDark)),
            ]),
            GestureDetector(onTap: _toggle,
              child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: _online ? Colors.white : AppColors.primary,
                  borderRadius: BorderRadius.circular(16)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.power_settings_new, size: 16, color: _online ? AppColors.primary : Colors.white),
                  const SizedBox(width: 6),
                  Text(_online ? 'Mtandaoni' : 'Ingia',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: _online ? AppColors.primary : Colors.white)),
                ]),
              ),
            ),
          ]),
          const SizedBox(height: 16),
          Container(padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: _online ? Colors.white.withOpacity(0.15) : AppColors.inputBg,
              borderRadius: BorderRadius.circular(16)),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
              for (final s in [('TZS 0','Leo'),('1','Safari Zote'),('100%','Alama')])
                Column(children: [
                  Text(s.$1, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800,
                    color: _online ? Colors.white : AppColors.textDark)),
                  Text(s.$2, style: TextStyle(fontSize: 10, color: _online ? Colors.white60 : AppColors.textMuted, fontWeight: FontWeight.w600)),
                ]),
            ]),
          ),
        ]),
      )),

      // White body
      SliverToBoxAdapter(child: Container(
        decoration: const BoxDecoration(color: Colors.white,
          borderRadius: BorderRadius.only(topLeft: Radius.circular(28), topRight: Radius.circular(28))),
        child: Column(children: [
          if (!_online) Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Container(padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: const Color(0xFFFEF9C3), borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFDE68A))),
              child: Row(children: [
                const Icon(Icons.warning_amber_rounded, color: Color(0xFF92400E), size: 18),
                const SizedBox(width: 10),
                const Expanded(child: Text('Uko nje ya mtandao — Gonga Ingia ili kupokea maombi.',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF92400E)))),
              ])),
          ),

          // My active requests
          if (_myRequests.where((r) => r['status'] != 'completed').isNotEmpty) ...[
            Padding(padding: const EdgeInsets.fromLTRB(20,20,20,10),
              child: Text('🔥 Maombi Yangu', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark))),
            ..._myRequests.where((r) => r['status'] != 'completed').map((req) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
              child: WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(req['category'], style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
                  Text('TZS ${req['price'].toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.primary)),
                ]),
                Text('${req['customer']} · ${req['area']}', style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                const SizedBox(height: 10),
                if (req['status'] == 'accepted')
                  SizedBox(height: 40, child: ElevatedButton(
                    onPressed: () => _advance(req['id'], 'shopping'),
                    child: const Text('Ninaenda Kununua 🛒', style: TextStyle(fontSize: 13)))),
                if (req['status'] == 'shopping')
                  SizedBox(height: 40, child: ElevatedButton(
                    onPressed: () => _advance(req['id'], 'completed'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                    child: const Text('Imekamilika ✅', style: TextStyle(fontSize: 13)))),
              ])),
            )),
          ],

          // Available requests
          Padding(padding: const EdgeInsets.fromLTRB(20,20,20,10),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('📋 Maombi Yanayopatikana', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              Text('${_available.length} maombi', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ])),

          if (!_online) const Padding(padding: EdgeInsets.symmetric(vertical: 32),
            child: Center(child: Column(children: [
              Text('💤', style: TextStyle(fontSize: 48)),
              SizedBox(height: 8),
              Text('Ingia mtandaoni ili uone maombi', style: TextStyle(color: AppColors.textMuted)),
            ]))),

          if (_online && _available.isEmpty) const Padding(padding: EdgeInsets.symmetric(vertical: 32),
            child: Center(child: Column(children: [
              Text('🎉', style: TextStyle(fontSize: 48)),
              SizedBox(height: 8),
              Text('Umekabili maombi yote!', style: TextStyle(color: AppColors.textMuted)),
            ]))),

          if (_online) ..._available.map((req) => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
            child: WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(req['category'], style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
                  Text('📍 ${req['area']} · ⏱ ${req['service']}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  if (req['notes'] != null) Text('"${req['notes']}"', style: const TextStyle(fontSize: 11, color: AppColors.textMuted, fontStyle: FontStyle.italic)),
                ]),
                Text('TZS ${req['price'].toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.primary)),
              ]),
              const SizedBox(height: 10),
              SizedBox(height: 42, child: ElevatedButton(
                onPressed: () => _accept(req),
                child: const Text('Kubali Ombi ✅', style: TextStyle(fontSize: 13)))),
            ])),
          )),
          const SizedBox(height: 24),
        ]),
      )),
    ]),
  );
}