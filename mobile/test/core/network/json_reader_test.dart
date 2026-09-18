import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/core/network/json_reader.dart';

void main() {
  group('JsonReader', () {
    test('reads every supported primitive with strict types', () {
      final json = <String, Object?>{
        'name': 'Rick',
        'count': 42,
        'active': true,
        'next': null,
      };

      expect(JsonReader.string(json, 'name'), 'Rick');
      expect(JsonReader.integer(json, 'count'), 42);
      expect(JsonReader.boolean(json, 'active'), isTrue);
      expect(JsonReader.nullableString(json, 'next'), isNull);
    });

    test('rejects a response with an unexpected runtime type', () {
      expect(
        () => JsonReader.integer(<String, Object?>{'count': '42'}, 'count'),
        throwsFormatException,
      );
      expect(() => JsonReader.object(<Object?>[]), throwsFormatException);
    });
  });
}
