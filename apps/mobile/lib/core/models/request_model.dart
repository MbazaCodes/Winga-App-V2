enum RequestStatus { searching, accepted, shopping, completed, cancelled }
enum ServiceType { hourly, halfDay, fullDay }
enum DeliveryMethod { withCustomer, delivery, pickup }

class RequestModel {
  final String id;
  final String customerId;
  final String? wingaId;
  final String category;
  final ServiceType serviceType;
  final DeliveryMethod deliveryMethod;
  final String meetingPoint;
  final String shoppingArea;
  final String? notes;
  final RequestStatus status;
  final int? estimatedPrice;
  final int? finalPrice;
  final DateTime createdAt;
  final UserModel? winga;
  final UserModel? customer;

  const RequestModel({
    required this.id,
    required this.customerId,
    this.wingaId,
    required this.category,
    required this.serviceType,
    required this.deliveryMethod,
    required this.meetingPoint,
    required this.shoppingArea,
    this.notes,
    required this.status,
    this.estimatedPrice,
    this.finalPrice,
    required this.createdAt,
    this.winga,
    this.customer,
  });

  factory RequestModel.fromJson(Map<String, dynamic> json) => RequestModel(
    id: json['id'],
    customerId: json['customer_id'],
    wingaId: json['winga_id'],
    category: json['category'],
    serviceType: ServiceType.values.firstWhere(
      (e) => e.name == json['service_type'], orElse: () => ServiceType.hourly),
    deliveryMethod: DeliveryMethod.values.firstWhere(
      (e) => e.name == json['delivery_method'], orElse: () => DeliveryMethod.withCustomer),
    meetingPoint: json['meeting_point'] ?? '',
    shoppingArea: json['shopping_area'] ?? '',
    notes: json['notes'],
    status: RequestStatus.values.firstWhere(
      (e) => e.name == json['status'], orElse: () => RequestStatus.searching),
    estimatedPrice: json['estimated_price'],
    finalPrice: json['final_price'],
    createdAt: DateTime.parse(json['created_at']),
  );

  String get statusLabel {
    switch (status) {
      case RequestStatus.searching:  return 'Inatafuta';
      case RequestStatus.accepted:   return 'Imekubaliwa';
      case RequestStatus.shopping:   return 'Inanunua';
      case RequestStatus.completed:  return 'Imekamilika';
      case RequestStatus.cancelled:  return 'Imehairishwa';
    }
  }

  String get serviceLabel {
    switch (serviceType) {
      case ServiceType.hourly:  return 'Saa 1';
      case ServiceType.halfDay: return 'Nusu Siku';
      case ServiceType.fullDay: return 'Siku Nzima';
    }
  }

  int get price => finalPrice ?? estimatedPrice ?? 0;
}

// Import to avoid circular dependency
import 'user_model.dart';
