import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/models/request_model.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../../shared/widgets/winga_card.dart';
import '../../../shared/widgets/app_button.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});
  @override State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  String _tab = 'all';

  static final _mock = [
    RequestModel(id:'r1', customerId:'c1', category:'Vyakula 🛒', serviceType:ServiceType.hourly,
      deliveryMethod:DeliveryMethod.withCustomer, meetingPoint:'Kariakoo', shoppingArea:'Kariakoo',
      status:RequestStatus.searching, estimatedPrice:5000, createdAt:DateTime.now(), notes:'Mchele na sukari'),
    RequestModel(id:'r2', customerId:'c1', category:'Mavazi 👗', serviceType:ServiceType.halfDay,
      deliveryMethod:DeliveryMethod.delivery, meetingPoint:'Mwenge', shoppingArea:'Mwenge',
      status:RequestStatus.completed, estimatedPrice:15000, finalPrice:15000, createdAt:DateTime.now().subtract(const Duration(days:1))),
  ];

  List<RequestModel> get _filtered => _mock.where((r) {
    if (_tab == 'active')    return [RequestStatus.searching,RequestStatus.accepted,RequestStatus.shopping].contains(r.status);
    if (_tab == 'completed') return r.status == RequestStatus.completed;
    if (_tab == 'cancelled') return r.status == RequestStatus.cancelled;
    return true;
  }).toList();

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Safari Zangu'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: Column(children: [
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(children: [
            for (final t in [('all','Zote'),('active','Inaendelea'),('completed','Zilizokamilika'),('cancelled','Zilizohairishwa')])
              GestureDetector(
                onTap: () => setState(() => _tab = t.$1),
                child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8, bottom: 16),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: _tab == t.$1 ? AppColors.primary : AppColors.inputBg,
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: Text(t.$2, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                    color: _tab == t.$1 ? Colors.white : AppColors.textMuted)),
                ),
              ),
          ]),
        ),
      ),
      Expanded(child: _filtered.isEmpty
        ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            const Text('🛍️', style: TextStyle(fontSize: 56)),
            const SizedBox(height: 12),
            const Text('Hakuna safari', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            const SizedBox(height: 6),
            const Text('Bonyeza + omba Winga wako wa kwanza!', style: TextStyle(color: AppColors.textMuted)),
            const SizedBox(height: 20),
            SizedBox(width: 160, child: AppButton(text: 'Omba Winga →', onTap: () => context.go('/book'))),
          ]))
        : ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: _filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, i) {
              final r = _filtered[i];
              return WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(r.category, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppColors.textDark)),
                  StatusBadge(status: r.status),
                ]),
                const SizedBox(height: 4),
                Text(r.serviceLabel, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                if (r.notes != null) ...[
                  const SizedBox(height: 6),
                  Text('"${r.notes}"', style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontStyle: FontStyle.italic)),
                ],
                const SizedBox(height: 10),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(r.createdAt.toString().substring(0,10), style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  Text('TZS ${r.price.toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.textDark)),
                ]),
                if (r.status == RequestStatus.completed) ...[
                  const SizedBox(height: 10),
                  SizedBox(height: 38, child: AppButton(text: '⭐ Pima Huduma', onTap: () {})),
                ],
              ]));
            },
          )),
    ]),
  );
}