import 'package:pickle_verso/core/network/json_reader.dart';

class AuthUser {
  const AuthUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.isEmailVerified,
  });

  factory AuthUser.fromJson(JsonObject json) => AuthUser(
    id: JsonReader.string(json, 'id'),
    firstName: JsonReader.string(json, 'firstName'),
    lastName: JsonReader.string(json, 'lastName'),
    email: JsonReader.string(json, 'email'),
    isEmailVerified: JsonReader.boolean(json, 'isEmailVerified'),
  );

  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final bool isEmailVerified;

  String get fullName => '$firstName $lastName'.trim();
}
