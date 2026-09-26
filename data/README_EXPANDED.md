# Gwalior JanSetu Data Pack — expanded

This expanded pack is focused on Gwalior city and contains:
- official-source registry
- Gwalior Smart City project/investment CSV
- current District Gwalior hospital directory CSV
- current District Gwalior school directory CSV (entries exposed on the official directory page)
- OGD download manifest for Gwalior roads, community facilities and traffic
- Gwalior GIS layer inventory
- source-to-JanSetu mapping

Important data-quality notes:
1. The official Gwalior GIS portal confirms roads, drinking-water systems, sewer lines, land use, government assets, schools, hospitals and other infrastructure are integrated in its map platform.
2. The Google mt1.google.com URL previously captured is a basemap tile, not Gwalior GIS feature data.
3. No GIS geometry has been fabricated. Raw vector extraction from the live GIS viewer remains a separate task.
4. District utility pages can include district-level facilities; use address/pincode/geocoding and the Gwalior Municipal Corporation boundary to filter strictly to city records.
5. Historical Census / planning documents must be labelled by their data year.

Recommended next files to obtain from the OGD catalogs:
- Gwalior roads ZIP
- Gwalior community facilities ZIP
- Gwalior traffic ZIP
Then convert to GeoJSON and load into PostGIS.
