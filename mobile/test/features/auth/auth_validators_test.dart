import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/features/auth/presentation/auth_validators.dart';

void main() {
  test('accepts a valid email and rejects malformed addresses', () {
    expect(AuthValidators.email('rick@c137.com'), isNull);
    expect(AuthValidators.email('rick-at-c137'), isNotNull);
  });

  test('uses the same password constraints as the backend', () {
    expect(AuthValidators.strongPassword('Portal123'), isNull);
    expect(AuthValidators.strongPassword('portal123'), isNotNull);
    expect(AuthValidators.strongPassword('PORTAL123'), isNotNull);
    expect(AuthValidators.strongPassword('PortalOnly'), isNotNull);
  });
}
