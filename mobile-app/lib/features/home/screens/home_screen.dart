import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _search = '';
  final _searchCtrl = TextEditingController();

  String get _greeting {
    final h = DateTime.now().hour;
    if (h < 12) return 'Habari za Asubuhi';
    if (h < 17) return 'Habari za Mchana';
    return 'Habari za Jioni';
  }

  String get _name {
    final s = StorageService.getJson(AppConstants.sessionKey);
    return (s?['name'] as String?)?.split(' ').first ?? 'Mteja';
  }

  static const _categories = [
    ('groceries','Vyakula','🛒'),('electronics','Simu/Elec.','📱'),
    ('clothes','Mavazi','👗'),('medicine','Dawa','💊'),
    ('furniture','Samani','🛋️'),('hardware','Ujenzi','🔧'),
    ('beauty','Uzuri','💄'),('school','Shule','📚'),
    ('house','Nyumba/Ardhi','🏠'),('cars','Magari','🚗'),
    ('mc','MC Sherehe','🎤'),('dj','Music/DJ','🎧'),
  ];

  static const _wingas = [
    (name:'Amina Hassan', area:'Kariakoo', badge:'✅', rating:4.9, online:true),
    (name:'John Mwangi',  area:'Mwenge',   badge:'🔵', rating:4.7, online:true),
    (name:'Fatuma Said',  area:'Tandika',  badge:'⭐', rating:4.5, online:false),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _wingas.where((w) =>
      _search.isEmpty || w.name.toLowerCase().contains(_search.toLowerCase())).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(child: Container(
            padding: const EdgeInsets.fromLTRB(20, 60, 20, 16),
            child: Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('$_greeting 👋', style: const TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
                Text('Karibu, $_name!', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              ])),
              GestureDetector(
                onTap: () => context.go('/profile'),
                child: CircleAvatar(
                  radius: 22, backgroundColor: AppColors.primarySoft,
                  child: Text(_name[0].toUpperCase(), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800)),
                ),
              ),
            ]),
          )),

          // Hero banner
          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: GestureDetector(
              onTap: () => context.go('/book'),
              child: Container(
                height: 120, padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [AppColors.primaryDark, AppColors.primaryLight]),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                    Row(children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.greenAccent, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      const Text('5 Mtandaoni Sasa', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                    ]),
                    const SizedBox(height: 6),
                    const Text('Omba Winga\nwa Karibu Nawe', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800, height: 1.2)),
                    const SizedBox(height: 4),
                    const Text('Bonyeza hapa →', style: TextStyle(color: AppColors.gold, fontSize: 12, fontWeight: FontWeight.w700)),
                  ])),
                  const Text('🛍️', style: TextStyle(fontSize: 52)),
                ]),
              ),
            ),
          )),

          const SliverToBoxAdapter(child: SizedBox(height: 20)),

          // Search
          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (v) => setState(() => _search = v),
              decoration: InputDecoration(
                hintText: 'Tafuta Winga kwa jina au eneo...',
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                suffixIcon: _search.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.close, size: 18, color: AppColors.textMuted),
                      onPressed: () { _searchCtrl.clear(); setState(() => _search = ''); })
                  : null,
              ),
            ),
          )),

          const SliverToBoxAdapter(child: SizedBox(height: 20)),

          // Categories
          if (_search.isEmpty) ...[
            SliverToBoxAdapter(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('Aina za Ununuzi', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark)),
                GestureDetector(onTap: () => context.go('/book'),
                  child: const Text('Ona Zote', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary))),
              ]),
            )),
            const SliverToBoxAdapter(child: SizedBox(height: 12)),
            SliverToBoxAdapter(child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: GridView.builder(
                shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4, mainAxisSpacing: 10, crossAxisSpacing: 10, childAspectRatio: 0.9),
                itemCount: _categories.length,
                itemBuilder: (_, i) {
                  final cat = _categories[i];
                  return GestureDetector(
                    onTap: () => context.go('/book'),
                    child: Container(
                      decoration: BoxDecoration(color: AppColors.inputBg, borderRadius: BorderRadius.circular(16)),
                      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Text(cat.$3, style: const TextStyle(fontSize: 26)),
                        const SizedBox(height: 4),
                        Text(cat.$2, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMid), textAlign: TextAlign.center),
                      ]),
                    ),
                  );
                },
              ),
            )),
            const SliverToBoxAdapter(child: SizedBox(height: 20)),
          ],

          // Wingas list
          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text('Wingas Wanapatikana',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textDark)),
          )),
          const SliverToBoxAdapter(child: SizedBox(height: 12)),
          SliverList(delegate: SliverChildBuilderDelegate(
            (_, i) {
              final w = filtered[i];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                child: WingaCard(
                  onTap: () => context.go('/book'),
                  child: Row(children: [
                    Stack(children: [
                      CircleAvatar(radius: 28, backgroundColor: AppColors.primarySoft,
                        child: Text(w.name[0], style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800, fontSize: 18))),
                      if (w.online) Positioned(bottom: 0, right: 0,
                        child: Container(width: 14, height: 14,
                          decoration: BoxDecoration(color: Colors.green, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)))),
                    ]),
                    const SizedBox(width: 14),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(w.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                      const SizedBox(height: 3),
                      Row(children: [
                        Text('📍 ${w.area}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                        const SizedBox(width: 10),
                        Text('${w.badge} ⭐ ${w.rating}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      ]),
                    ])),
                    ElevatedButton(
                      onPressed: () => context.go('/book'),
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(60, 36), padding: const EdgeInsets.symmetric(horizontal: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Omba', style: TextStyle(fontSize: 12)),
                    ),
                  ]),
                ),
              );
            },
            childCount: filtered.length,
          )),
          const SliverToBoxAdapter(child: SizedBox(height: 20)),
        ],
      ),
    );
  }
}
