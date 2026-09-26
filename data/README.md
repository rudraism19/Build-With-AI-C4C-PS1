# Gwalior JanSetu Data Pack — verified starter corpus

This package contains a verified source registry and a structured Gwalior Smart City project/investment table.

IMPORTANT:
- The Gwalior GIS portal is a live map viewer. The earlier URL captured from Chrome was a Google basemap tile, not the Gwalior GIS feature data.
- I have NOT fabricated GIS geometries or infrastructure records.
- The official OGD catalogs below explicitly list downloadable ZIP resources for several Gwalior datasets.
- Census 2011 data are historical baseline data and should not be presented as 2026 population.

Core official sources:
1. Gwalior GIS: https://gwaliorgis.mp.gov.in/
2. Census Gwalior PCA TV 2011: https://censusindia.gov.in/nada/index.php/catalog/6612
3. Gwalior DCHB Part A: https://censusindia.gov.in/nada/index.php/catalog/706
4. OGD Gwalior Roads: https://odisha.data.gov.in/catalog/roads-information-gwalior-mp
5. OGD Gwalior Community Facilities: https://odisha.data.gov.in/catalog/community-facilities-gwalior
6. OGD Gwalior Education: https://ap.data.gov.in/catalog/education-gwalior
7. OGD Gwalior Traffic: https://jk.data.gov.in/catalog/traffic-details-gwalior
8. Gwalior Smart City project list: https://gwaliorsmartcity.org/smart-city-vision/list-of-projects-as-per-smart-city-proposal-gwalior/

Recommended next data-fusion structure:
Complaints + ward demographics + roads + water + sewerage + facilities + investment/projects -> PostGIS -> demand/gap analysis -> hotspot -> priority -> policy RAG.
