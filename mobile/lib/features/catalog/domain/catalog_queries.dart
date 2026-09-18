enum CharacterStatusFilter {
  alive('alive', 'Vivo'),
  dead('dead', 'Morto'),
  unknown('unknown', 'Desconhecido');

  const CharacterStatusFilter(this.apiValue, this.label);
  final String apiValue;
  final String label;
}

enum CharacterSpeciesFilter {
  human('human', 'Humano'),
  alien('alien', 'Alienígena'),
  humanoid('humanoid', 'Humanoide'),
  poopybutthole('poopybutthole', 'Poopybutthole'),
  mythologicalCreature('mythological creature', 'Criatura mitológica'),
  animal('animal', 'Animal'),
  robot('robot', 'Robô'),
  cronenberg('cronenberg', 'Cronenberg'),
  disease('disease', 'Doença'),
  unknown('unknown', 'Desconhecida');

  const CharacterSpeciesFilter(this.apiValue, this.label);
  final String apiValue;
  final String label;
}

enum CharacterGenderFilter {
  female('female', 'Feminino'),
  male('male', 'Masculino'),
  genderless('genderless', 'Sem gênero'),
  unknown('unknown', 'Desconhecido');

  const CharacterGenderFilter(this.apiValue, this.label);
  final String apiValue;
  final String label;
}

typedef CharactersQuery = ({
  int page,
  String? name,
  CharacterStatusFilter? status,
  CharacterSpeciesFilter? species,
  String? type,
  CharacterGenderFilter? gender,
});

typedef EpisodesQuery = ({int page, String? name, String? code});

typedef LocationsQuery = ({
  int page,
  String? name,
  String? type,
  String? dimension,
});

const initialCharactersQuery = (
  page: 1,
  name: null,
  status: null,
  species: null,
  type: null,
  gender: null,
);

const initialEpisodesQuery = (page: 1, name: null, code: null);

const initialLocationsQuery = (
  page: 1,
  name: null,
  type: null,
  dimension: null,
);
