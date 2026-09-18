enum CatalogResource {
  characters('characters'),
  episodes('episodes'),
  locations('locations');

  const CatalogResource(this.path);

  final String path;
}

typedef CatalogTarget = ({CatalogResource resource, int externalId});
