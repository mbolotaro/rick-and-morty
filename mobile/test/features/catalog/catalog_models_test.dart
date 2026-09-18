import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';

void main() {
  test('parses a typed character catalog page', () {
    final page = CatalogPage.fromJson(<String, Object?>{
      'info': <String, Object?>{
        'count': 1,
        'pages': 1,
        'next': null,
        'prev': null,
      },
      'results': <Object?>[
        <String, Object?>{
          'id': 1,
          'name': 'Rick Sanchez',
          'status': 'Vivo',
          'species': 'Humano',
          'type': '',
          'gender': 'Masculino',
          'origin': <String, Object?>{'name': 'Earth', 'url': '/locations/1'},
          'location': <String, Object?>{
            'name': 'Citadel',
            'url': '/locations/3',
          },
          'image': 'https://example.com/rick.jpg',
          'episode': <Object?>['/episodes/1'],
        },
      ],
    }, Character.fromJson);

    expect(page.info.count, 1);
    expect(page.results.single.name, 'Rick Sanchez');
    expect(page.results.single.episodes, ['/episodes/1']);
  });

  test('rejects malformed catalog entries', () {
    expect(
      () => Character.fromJson(<String, Object?>{'id': '1'}),
      throwsFormatException,
    );
  });

  test('parses a character profile and all related resources', () {
    final profile = CharacterProfile.fromJson(<String, Object?>{
      'character': <String, Object?>{
        'id': 1,
        'name': 'Rick Sanchez',
        'status': 'Vivo',
        'species': 'Humano',
        'type': '',
        'gender': 'Masculino',
        'origin': <String, Object?>{'name': 'Earth', 'url': '/locations/1'},
        'location': <String, Object?>{'name': 'Citadel', 'url': '/locations/3'},
        'image': 'https://example.com/rick.jpg',
        'episode': <Object?>['/episodes/1'],
      },
      'episodes': <Object?>[
        <String, Object?>{
          'id': 1,
          'name': 'Pilot',
          'air_date': '2 de dezembro de 2013',
          'episode': 'S01E01',
          'characters': <Object?>['/characters/1', '/characters/2'],
        },
      ],
      'locations': <Object?>[
        <String, Object?>{
          'id': 1,
          'name': 'Earth',
          'type': 'Planeta',
          'dimension': 'Dimensão C-137',
          'residents': <Object?>['/characters/1'],
        },
      ],
    });

    expect(profile.character.id, 1);
    expect(profile.episodes.single.characterCount, 2);
    expect(profile.locations.single.residentCount, 1);
  });
}
