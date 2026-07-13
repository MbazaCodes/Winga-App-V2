# Winga Mobile App — Flutter

Tanzania's Trusted Shopping Guide Platform — Native Mobile App

## Status
🚧 **Development Phase** — Screens and architecture complete. Requires:
1. Flutter SDK 3.16+
2. Firebase project setup
3. Google Maps API key
4. Supabase credentials

## Screens Built

### Customer App
| Screen | File |
|--------|------|
| Splash | `lib/features/auth/screens/splash_screen.dart` |
| Onboarding (3 slides) | `lib/features/auth/screens/onboarding_screen.dart` |
| Login (Phone + Winga ID) | `lib/features/auth/screens/login_screen.dart` |
| OTP (6 boxes, auto-submit) | `lib/features/auth/screens/otp_screen.dart` |
| Name Collection | `lib/features/auth/screens/name_screen.dart` |
| Home (categories, Wingas list) | `lib/features/home/screens/home_screen.dart` |
| Book | `lib/features/book/screens/book_screen.dart` |
| Requests / Safari | `lib/features/requests/screens/requests_screen.dart` |
| Earnings / Matumizi | `lib/features/earnings/screens/earnings_screen.dart` |
| Messages / Chat | `lib/features/messages/screens/` |
| Profile | `lib/features/profile/screens/profile_screen.dart` |

### Winga App
| Screen | File |
|--------|------|
| Dashboard (online toggle) | `lib/features/winga/screens/winga_home_screen.dart` |
| Requests Management | `lib/features/winga/screens/winga_requests_screen.dart` |
| Earnings (85/12/3 split) | `lib/features/winga/screens/winga_earnings_screen.dart` |
| Profile (QR Digital ID) | `lib/features/winga/screens/winga_profile_screen.dart` |
| Registration (3-step) | `lib/features/winga/screens/winga_register_screen.dart` |

## Setup

```bash
# 1. Install Flutter SDK
# https://flutter.dev/docs/get-started/install

# 2. Clone and install
cd mobile-app
flutter pub get

# 3. Add your keys
# android/app/src/main/AndroidManifest.xml → YOUR_GOOGLE_MAPS_API_KEY
# ios/Runner/AppDelegate.swift → YOUR_GOOGLE_MAPS_API_KEY
# lib/core/constants/app_constants.dart → supabaseUrl, supabaseAnonKey

# 4. Add Firebase
# Download google-services.json → android/app/
# Download GoogleService-Info.plist → ios/Runner/

# 5. Run
flutter run                    # Connected device
flutter run -d chrome          # Web browser
flutter build apk --release    # Android APK
flutter build ios --release    # iOS (Mac only)
```

## Architecture

```
lib/
├── main.dart                    # Entry point
├── core/
│   ├── constants/               # App constants, env vars
│   ├── models/                  # User, Request, Message models
│   ├── router/                  # GoRouter — all routes
│   ├── services/                # Auth, Notification, Location, Storage
│   ├── theme/                   # Colors, typography, button styles
│   └── utils/                   # Phone formatting utilities
├── features/
│   ├── auth/                    # Splash, Onboarding, Login, OTP, Name
│   ├── home/                    # Customer home screen
│   ├── book/                    # Booking flow
│   ├── requests/                # Safari zangu
│   ├── earnings/                # Matumizi
│   ├── messages/                # Chat list + chat view
│   ├── profile/                 # Customer profile
│   └── winga/                   # All Winga screens
└── shared/
    └── widgets/                 # AppButton, WingaCard, StatusBadge, BottomNav
```

## Tech Stack
| Layer | Package |
|-------|---------|
| Navigation | go_router |
| State | flutter_riverpod |
| Backend | supabase_flutter |
| Maps | google_maps_flutter |
| Push Notifications | firebase_messaging |
| Biometrics | local_auth |
| OTP Input | pinput |
| QR Code | qr_flutter |
| HTTP | dio |
| Storage | shared_preferences |

## Demo Credentials
- Phone: any number
- OTP: `123456`
- Winga ID: `WNGA10001`
