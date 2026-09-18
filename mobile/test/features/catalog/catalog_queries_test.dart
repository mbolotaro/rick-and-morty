import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/features/catalog/data/catalog_api_service.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';

void main() {
  test('serializes only valid typed character filters', () {
    final service = CharactersApiService(Dio());
    final query = service.queryParameters((
      page: 2,
      name: 'Rick',
      status: CharacterStatusFilter.alive,
      species: CharacterSpeciesFilter.human,
      type: null,
      gender: CharacterGenderFilter.male,
    ));

    expect(query, <String, Object?>{
      'page': 2,
      'name': 'Rick',
      'status': 'alive',
      'species': 'human',
      'gender': 'male',
    });
  });

  test('omits empty optional location filters', () {
    final service = LocationsApiService(Dio());
    final query = service.queryParameters((
      page: 1,
      name: '',
      type: null,
      dimension: 'C-137',
    ));

    expect(query, <String, Object?>{'page': 1, 'dimension': 'C-137'});
  });
}
