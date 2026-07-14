import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/winga_card.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  static const _convos = [
    (id:'req1', winga:'Amina Hassan', last:'Nimefika Kariakoo, unaweza kuja?', time:'10:32', unread:2, online:true),
    (id:'req2', winga:'John Mwangi',  last:'Asante, safari imekamilika!',       time:'Jana',  unread:0, online:false),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(title: const Text('Ujumbe'), backgroundColor: Colors.white, elevation: 0, automaticallyImplyLeading: false),
    body: _convos.isEmpty
      ? const Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text('💬', style: TextStyle(fontSize: 56)),
          SizedBox(height: 12),
          Text('Hakuna ujumbe bado', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textDark)),
          SizedBox(height: 6),
          Text('Unapoomba Winga, mazungumzo yataonekana hapa', style: TextStyle(color: AppColors.textMuted)),
        ]))
      : ListView.separated(
          padding: const EdgeInsets.all(20),
          itemCount: _convos.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (_, i) {
            final c = _convos[i];
            return WingaCard(onTap: () => context.go('/messages/${c.id}'), child: Row(children: [
              Stack(children: [
                CircleAvatar(radius: 26, backgroundColor: AppColors.primarySoft,
                  child: Text(c.winga[0], style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800, fontSize: 18))),
                if (c.online) Positioned(bottom: 0, right: 0,
                  child: Container(width: 13, height: 13,
                    decoration: BoxDecoration(color: Colors.green, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)))),
              ]),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(c.winga, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.textDark)),
                  Text(c.time, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                ]),
                const SizedBox(height: 3),
                Text(c.last, style: const TextStyle(fontSize: 12, color: AppColors.textMuted), overflow: TextOverflow.ellipsis),
              ])),
              if (c.unread > 0) ...[
                const SizedBox(width: 8),
                CircleAvatar(radius: 10, backgroundColor: AppColors.primary,
                  child: Text('${c.unread}', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700))),
              ],
            ]));
          },
        ),
  );
}