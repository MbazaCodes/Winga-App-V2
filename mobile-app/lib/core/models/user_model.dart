enum UserType { customer, winga }
enum BadgeType { starter, mid, verified }

class UserModel {
  final String id;
  final String phone;
  final String? name;
  final UserType userType;
  final String? profileImageUrl;
  final String? wingaId;
  final BadgeType? badge;
  final double? rating;
  final int? totalTrips;
  final String? city;
  final String? area;
  final String? bio;
  final bool? isOnline;
  final bool? profileComplete;
  final DateTime createdAt;

  const UserModel({
    required this.id,
    required this.phone,
    this.name,
    required this.userType,
    this.profileImageUrl,
    this.wingaId,
    this.badge,
    this.rating,
    this.totalTrips,
    this.city,
    this.area,
    this.bio,
    this.isOnline,
    this.profileComplete,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'],
    phone: json['phone'],
    name: json['name'],
    userType: json['user_type'] == 'winga' ? UserType.winga : UserType.customer,
    profileImageUrl: json['profile_image_url'],
    wingaId: json['winga_id'],
    badge: json['badge'] == 'verified' ? BadgeType.verified
         : json['badge'] == 'mid'      ? BadgeType.mid
         : BadgeType.starter,
    rating: json['rating']?.toDouble(),
    totalTrips: json['total_trips'],
    city: json['city'],
    area: json['area'],
    bio: json['bio'],
    isOnline: json['is_online'],
    profileComplete: json['profile_complete'],
    createdAt: DateTime.parse(json['created_at']),
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'phone': phone, 'name': name,
    'user_type': userType.name, 'profile_image_url': profileImageUrl,
    'winga_id': wingaId, 'badge': badge?.name,
    'rating': rating, 'total_trips': totalTrips,
    'city': city, 'area': area, 'bio': bio,
    'is_online': isOnline, 'profile_complete': profileComplete,
    'created_at': createdAt.toIso8601String(),
  };

  String get displayName => name ?? 'Mteja';
  String get initials => (name?.isNotEmpty == true) ? name![0].toUpperCase() : 'W';
  String get badgeLabel => badge == BadgeType.verified ? '✅ Verified'
                         : badge == BadgeType.mid ? '🔵 Mid' : '⭐ Starter';
}
