import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_controller.dart';

Future<void> showCatalogFilters(BuildContext context, CatalogViewState state) =>
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => CatalogFiltersSheet(state: state),
    );

class CatalogFiltersSheet extends ConsumerStatefulWidget {
  const CatalogFiltersSheet({required this.state, super.key});

  final CatalogViewState state;

  @override
  ConsumerState<CatalogFiltersSheet> createState() =>
      _CatalogFiltersSheetState();
}

class _CatalogFiltersSheetState extends ConsumerState<CatalogFiltersSheet> {
  late final TextEditingController _name;
  late final TextEditingController _secondary;
  late final TextEditingController _tertiary;
  CharacterStatusFilter? _status;
  CharacterSpeciesFilter? _species;
  CharacterGenderFilter? _gender;

  @override
  void initState() {
    super.initState();
    final state = widget.state;
    _name = TextEditingController(
      text: switch (state.selectedIndex) {
        0 => state.characters.name,
        1 => state.episodes.name,
        _ => state.locations.name,
      },
    );
    _secondary = TextEditingController(
      text: switch (state.selectedIndex) {
        0 => state.characters.type,
        1 => state.episodes.code,
        _ => state.locations.type,
      },
    );
    _tertiary = TextEditingController(
      text: state.selectedIndex == 2 ? state.locations.dimension : null,
    );
    _status = state.characters.status;
    _species = state.characters.species;
    _gender = state.characters.gender;
  }

  @override
  void dispose() {
    _name.dispose();
    _secondary.dispose();
    _tertiary.dispose();
    super.dispose();
  }

  void _apply() {
    final controller = ref.read(catalogControllerProvider.notifier);
    switch (widget.state.selectedIndex) {
      case 0:
        controller.applyCharacters((
          page: 1,
          name: _name.text,
          status: _status,
          species: _species,
          type: _secondary.text,
          gender: _gender,
        ));
      case 1:
        controller.applyEpisodes((
          page: 1,
          name: _name.text,
          code: _secondary.text,
        ));
      default:
        controller.applyLocations((
          page: 1,
          name: _name.text,
          type: _secondary.text,
          dimension: _tertiary.text,
        ));
    }
    Navigator.of(context).pop();
  }

  void _clear() {
    ref.read(catalogControllerProvider.notifier).clearCurrentFilters();
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) => AnimatedPadding(
    duration: const Duration(milliseconds: 180),
    padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
    child: DecoratedBox(
      decoration: BoxDecoration(
        color: context.colors.surfaceElevated,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(AppPrimitives.radiusLarge),
        ),
        border: Border(top: BorderSide(color: context.colors.border, width: 2)),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppPrimitives.space5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Filtrar catálogo',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                IconButton(
                  tooltip: 'Fechar',
                  onPressed: Navigator.of(context).pop,
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            const SizedBox(height: AppPrimitives.space3),
            TextField(
              controller: _name,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(
                labelText: 'Nome',
                prefixIcon: Icon(Icons.search_rounded),
              ),
            ),
            const SizedBox(height: AppPrimitives.space3),
            ...switch (widget.state.selectedIndex) {
              0 => _characterFields(),
              1 => _episodeFields(),
              _ => _locationFields(),
            },
            const SizedBox(height: AppPrimitives.space5),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _clear,
                    child: const Text('Limpar'),
                  ),
                ),
                const SizedBox(width: AppPrimitives.space3),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: _apply,
                    icon: const Icon(Icons.tune_rounded),
                    label: const Text('Aplicar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ),
  );

  List<Widget> _characterFields() => [
    DropdownButtonFormField<CharacterStatusFilter>(
      initialValue: _status,
      decoration: const InputDecoration(labelText: 'Status'),
      items: CharacterStatusFilter.values
          .map(
            (value) => DropdownMenuItem(value: value, child: Text(value.label)),
          )
          .toList(growable: false),
      onChanged: (value) => setState(() => _status = value),
    ),
    const SizedBox(height: AppPrimitives.space3),
    DropdownButtonFormField<CharacterSpeciesFilter>(
      initialValue: _species,
      decoration: const InputDecoration(labelText: 'Espécie'),
      items: CharacterSpeciesFilter.values
          .map(
            (value) => DropdownMenuItem(value: value, child: Text(value.label)),
          )
          .toList(growable: false),
      onChanged: (value) => setState(() => _species = value),
    ),
    const SizedBox(height: AppPrimitives.space3),
    DropdownButtonFormField<CharacterGenderFilter>(
      initialValue: _gender,
      decoration: const InputDecoration(labelText: 'Gênero'),
      items: CharacterGenderFilter.values
          .map(
            (value) => DropdownMenuItem(value: value, child: Text(value.label)),
          )
          .toList(growable: false),
      onChanged: (value) => setState(() => _gender = value),
    ),
    const SizedBox(height: AppPrimitives.space3),
    TextField(
      controller: _secondary,
      decoration: const InputDecoration(labelText: 'Tipo'),
    ),
  ];

  List<Widget> _episodeFields() => [
    TextField(
      controller: _secondary,
      textCapitalization: TextCapitalization.characters,
      decoration: const InputDecoration(
        labelText: 'Código do episódio',
        hintText: 'Ex.: S01E01',
      ),
    ),
  ];

  List<Widget> _locationFields() => [
    TextField(
      controller: _secondary,
      textInputAction: TextInputAction.next,
      decoration: const InputDecoration(labelText: 'Tipo'),
    ),
    const SizedBox(height: AppPrimitives.space3),
    TextField(
      controller: _tertiary,
      decoration: const InputDecoration(labelText: 'Dimensão'),
    ),
  ];
}
