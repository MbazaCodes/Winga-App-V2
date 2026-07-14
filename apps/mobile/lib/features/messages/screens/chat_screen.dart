import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class ChatScreen extends StatefulWidget {
  final String requestId;
  const ChatScreen({super.key, required this.requestId});
  @override State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  List<(String sender, String text, String time)> _msgs = [
    ('winga', 'Habari, niko Kariakoo sasa.', '10:15'),
    ('me',    'Sawa, nakuja dakika 10.',     '10:16'),
    ('winga', 'Nimefika mlangoni.',          '10:32'),
  ];

  void _send() {
    if (_ctrl.text.trim().isEmpty) return;
    setState(() => _msgs.add(('me', _ctrl.text.trim(),
      TimeOfDay.now().format(context))));
    _ctrl.clear();
    Future.delayed(const Duration(milliseconds: 100), () =>
      _scroll.animateTo(_scroll.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300), curve: Curves.easeOut));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.white,
    appBar: AppBar(
      title: Row(children: [
        CircleAvatar(radius: 18, backgroundColor: AppColors.primarySoft,
          child: const Text('A', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800))),
        const SizedBox(width: 10),
        const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Amina Hassan', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
          Text('● Mtandaoni', style: TextStyle(fontSize: 11, color: Colors.green)),
        ]),
      ]),
      backgroundColor: Colors.white, elevation: 0,
    ),
    body: Column(children: [
      Expanded(child: ListView.builder(
        controller: _scroll,
        padding: const EdgeInsets.all(16),
        itemCount: _msgs.length,
        itemBuilder: (_, i) {
          final (sender, text, time) = _msgs[i];
          final isMe = sender == 'me';
          return Align(
            alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
              decoration: BoxDecoration(
                color: isMe ? AppColors.primary : AppColors.inputBg,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(18), topRight: const Radius.circular(18),
                  bottomLeft: Radius.circular(isMe ? 18 : 4),
                  bottomRight: Radius.circular(isMe ? 4 : 18),
                ),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text(text, style: TextStyle(color: isMe ? Colors.white : AppColors.textDark, fontSize: 14)),
                const SizedBox(height: 3),
                Text(time, style: TextStyle(color: isMe ? Colors.white60 : AppColors.textMuted, fontSize: 10)),
              ]),
            ),
          );
        },
      )),
      Container(
        padding: EdgeInsets.fromLTRB(16, 10, 16, MediaQuery.of(context).padding.bottom + 10),
        decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: AppColors.cardBorder))),
        child: Row(children: [
          Expanded(child: TextField(controller: _ctrl,
            decoration: const InputDecoration(hintText: 'Andika ujumbe...'),
            onSubmitted: (_) => _send())),
          const SizedBox(width: 10),
          GestureDetector(onTap: _send,
            child: Container(width: 48, height: 48,
              decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(16)),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 20))),
        ]),
      ),
    ]),
  );
}