import 'package:flutter/material.dart';
import '../../../core/models/request_model.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../../shared/widgets/winga_card.dart';

class WingaRequestsScreen extends StatefulWidget {
  const WingaRequestsScreen({super.key});
  @override State<WingaRequestsScreen> createState() => _WingaRequestsScreenState();
}

class _WingaRequestsScreenState extends State<WingaRequestsScreen> {
  String _tab = 'all';

  static final _mock = [
    RequestModel(id:'r1', customerId:'c1', category:'Vyakula 🛒', serviceType:ServiceType.hourly,
      deliveryMethod:DeliveryMethod.withCustomer, meetingPoint:'', shoppingArea:'Kariakoo',
      status:RequestStatus.completed, finalPrice:5000, createdAt:DateTime.now().subtract(const Duration(days:1))),
    RequestModel(id:'r2', customerId:'c1', category:'Mavazi 👗', serviceType:ServiceType.halfDay,
      deliveryMethod:DeliveryMethod.delivery, meetingPoint:'', shoppingArea:'Mwenge',
      status:RequestStatus.shopping, estimatedPrice:15000, createdAt:DateTime.now()),
  ];

  List<RequestModel> get _filtered => _mock.where((r) {
    if (_tab == 'active')    return [RequestStatus.accepted, RequestStatus.shopping].contains(r.status);
    if (_tab == 'completed') return r.status == RequestStatus.completed;
    return true;
  }).toList();

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Maombi Yangu Yote'), backgroundColor: Colors.white, elevation: 0),
    body: Column(children: [
      Padding(padding: const EdgeInsets.symmetric(horizontal: 20),
        child: SingleChildScrollView(scrollDirection: Axis.horizontal,
          child: Row(children: [
            for (final t in [('all','Zote'),('active','Inaendelea'),('completed','Zilizokamilika')])
              GestureDetector(onTap: () => setState(() => _tab = t.$1),
                child: AnimatedContainer(duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8, bottom: 16),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: _tab == t.$1 ? AppColors.primary : AppColors.inputBg,
                    borderRadius: BorderRadius.circular(99)),
                  child: Text(t.$2, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700,
                    color: _tab == t.$1 ? Colors.white : AppColors.textMuted)))),
          ]))),
      Expanded(child: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: _filtered.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) {
          final r = _filtered[i];
          return WingaCard(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(r.category, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
              StatusBadge(status: r.status),
            ]),
            const SizedBox(height: 4),
            Text(r.serviceLabel, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 6),
            Row(children: [
              const Icon(Icons.place_rounded, size: 13, color: AppColors.textMuted),
              Text(' ${r.shoppingArea}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
              const SizedBox(width: 12),
              const Icon(Icons.calendar_today_rounded, size: 13, color: AppColors.textMuted),
              Text(' ${r.createdAt.toString().substring(0,10)}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
            ]),
            const SizedBox(height: 8),
            Align(alignment: Alignment.centerRight,
              child: Text('TZS ${r.price.toString().replaceAllMapped(RegExp(r"\B(?=(\d{3})+(?!\d))"), (m) => ",")}',
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.primary))),
          ]));
        },
      )),
    ]),
  );
}