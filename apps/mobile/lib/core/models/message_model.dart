class MessageModel {
  final String id;
  final String requestId;
  final String senderId;
  final String content;
  final bool read;
  final DateTime createdAt;

  const MessageModel({
    required this.id,
    required this.requestId,
    required this.senderId,
    required this.content,
    required this.read,
    required this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) => MessageModel(
    id: json['id'],
    requestId: json['request_id'],
    senderId: json['sender_id'],
    content: json['content'],
    read: json['read'] ?? false,
    createdAt: DateTime.parse(json['created_at']),
  );
}
