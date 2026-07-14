import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/app_button.dart';

class BookScreen extends StatefulWidget {
  const BookScreen({super.key});
  @override State<BookScreen> createState() => _BookScreenState();
}

class _BookScreenState extends State<BookScreen> {
  String? _category, _service, _delivery, _area;
  final _meetCtrl = TextEditingController();
  final _noteCtrl = TextEditingController();
  bool _loading = false;

  static const _categories = [
    ('groceries','Vyakula','🛒'),('electronics','Simu/Elec.','📱'),
    ('clothes','Mavazi','👗'),('medicine','Dawa','💊'),
    ('furniture','Samani','🛋️'),('hardware','Ujenzi','🔧'),
    ('beauty','Uzuri','💄'),('school','Shule','📚'),
    ('house','Nyumba/Ardhi','🏠'),('cars','Magari','🚗'),
    ('mc','MC Sherehe','🎤'),('dj','Music/DJ','🎧'),('other','Nyingine','✨'),
  ];

  static const _services = [
    ('hourly','Saa 1','TZS 5,000'),
    ('half_day','Nusu Siku','TZS 15,000'),
    ('full_day','Siku Nzima','TZS 25,000'),
  ];

  static const _deliveries = [
    ('with_customer','Na Mteja','🚶'),
    ('delivery','Tunawasilisha','🛵'),
    ('pickup','Pickup','📍'),
  ];

  static const _areas = ['Kariakoo','Mwenge','Kinondoni','Ilala','Temeke','Mbezi Beach','Mikocheni'];

  String? get _price => _services.where((s) => s.$1 == _service).isNotEmpty
    ? _services.firstWhere((s) => s.$1 == _service).$3 : null;

  Future<void> _submit() async {
    if (_category == null || _service == null || _delivery == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Chagua aina ya huduma na njia ya utoaji')));
      return;
    }
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    setState(() => _loading = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ Ombi limetumwa! Winga anakuja...')));
      context.go('/requests');
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Omba Winga'), backgroundColor: Colors.white, elevation: 0),
    body: SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _section('Aina ya Ununuzi'),
        GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4, mainAxisSpacing: 10, crossAxisSpacing: 10, childAspectRatio: 0.9),
          itemCount: _categories.length,
          itemBuilder: (_, i) {
            final c = _categories[i];
            final sel = _category == c.$1;
            return GestureDetector(
              onTap: () => setState(() => _category = c.$1),
              child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: sel ? AppColors.primary : AppColors.inputBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text(c.$3, style: const TextStyle(fontSize: 24)),
                  const SizedBox(height: 3),
                  Text(c.$2, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600,
                    color: sel ? Colors.white : AppColors.textMid), textAlign: TextAlign.center),
                ]),
              ),
            );
          },
        ),
        const SizedBox(height: 20),
        _section('Aina ya Huduma'),
        ..._services.map((s) {
          final sel = _service == s.$1;
          return GestureDetector(
            onTap: () => setState(() => _service = s.$1),
            child: AnimatedContainer(duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: sel ? AppColors.primarySoft : AppColors.inputBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: sel ? AppColors.primary : Colors.transparent, width: 2),
              ),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(s.$2, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14,
                  color: sel ? AppColors.primary : AppColors.textDark)),
                Text(s.$3, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13,
                  color: sel ? AppColors.primary : AppColors.textMuted)),
              ]),
            ),
          );
        }),
        const SizedBox(height: 20),
        _section('Njia ya Utoaji'),
        Row(children: _deliveries.map((d) {
          final sel = _delivery == d.$1;
          return Expanded(child: GestureDetector(
            onTap: () => setState(() => _delivery = d.$1),
            child: AnimatedContainer(duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(right: d.$1 == 'pickup' ? 0 : 8),
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: sel ? AppColors.primarySoft : AppColors.inputBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: sel ? AppColors.primary : Colors.transparent, width: 2),
              ),
              child: Column(children: [
                Text(d.$3, style: const TextStyle(fontSize: 24)),
                const SizedBox(height: 4),
                Text(d.$2, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600,
                  color: sel ? AppColors.primary : AppColors.textMid), textAlign: TextAlign.center),
              ]),
            ),
          ));
        }).toList()),
        const SizedBox(height: 20),
        _section('Mahali pa Kukutana'),
        TextField(controller: _meetCtrl,
          decoration: const InputDecoration(hintText: 'Mfano: Mlango wa Kariakoo Market')),
        const SizedBox(height: 20),
        _section('Soko / Eneo'),
        Wrap(spacing: 8, runSpacing: 8, children: _areas.map((a) => GestureDetector(
          onTap: () => setState(() => _area = a),
          child: AnimatedContainer(duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: _area == a ? AppColors.primary : AppColors.inputBg,
              borderRadius: BorderRadius.circular(99),
            ),
            child: Text(a, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600,
              color: _area == a ? Colors.white : AppColors.textMid)),
          ),
        )).toList()),
        const SizedBox(height: 20),
        _section('Maelekezo ya Ziada (Hiari)'),
        TextField(controller: _noteCtrl, maxLines: 3,
          decoration: const InputDecoration(hintText: 'Mfano: Nunua mchele kilo 5, sukari kilo 2...')),
        if (_price != null) ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(color: AppColors.primarySoft, borderRadius: BorderRadius.circular(16)),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Bei Inayokadiriwa', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.primary)),
              Text(_price!, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.primary)),
            ]),
          ),
        ],
        const SizedBox(height: 24),
        AppButton(text: 'Tuma Ombi ✈️', onTap: _submit, isLoading: _loading),
        const SizedBox(height: 20),
      ]),
    ),
  );

  Widget _section(String t) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Text(t.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800,
        color: AppColors.textMuted, letterSpacing: 0.8)),
  );
}