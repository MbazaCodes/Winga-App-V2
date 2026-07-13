import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:winga_app/main.dart';

void main() {
  testWidgets('Winga App smoke test', (WidgetTester tester) async {
    // Build app
    await tester.pumpWidget(const WingaApp());
    // Verify splash is shown
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
