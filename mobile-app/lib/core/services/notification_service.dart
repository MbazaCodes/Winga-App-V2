import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final _messaging = FirebaseMessaging.instance;
  static final _localNotifications = FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    // Request permission
    await _messaging.requestPermission(
      alert: true, badge: true, sound: true,
    );

    // Local notifications setup
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    await _localNotifications.initialize(
      const InitializationSettings(android: android, iOS: ios),
    );

    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_handleBackground);

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((message) {
      _showLocalNotification(message);
    });
  }

  static Future<String?> getToken() => _messaging.getToken();

  static Future<void> _showLocalNotification(RemoteMessage message) async {
    const channel = AndroidNotificationChannel(
      'winga_channel', 'Winga Notifications',
      importance: Importance.high,
    );
    await _localNotifications.show(
      0,
      message.notification?.title ?? 'Winga',
      message.notification?.body ?? '',
      NotificationDetails(
        android: AndroidNotificationDetails(channel.id, channel.name,
            channelDescription: channel.description, importance: Importance.high),
        iOS: const DarwinNotificationDetails(),
      ),
    );
  }

  static Future<void> _handleBackground(RemoteMessage message) async {}
}
