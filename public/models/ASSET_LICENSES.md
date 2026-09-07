# Asset licenses and provenance

The eight exported models are adaptations of **CC0 1.0** MakeHuman Community assets. CC0 permits copying, modification, distribution, and commercial use without attribution. Attribution is retained here for provenance.

The mesh data is distinct from the MakeHuman application's source code license. The application is not bundled into the React viewer.

| Material | Source / creator | License |
| --- | --- | --- |
| hm08 anatomical base mesh and adult shape targets | [MakeHuman Community repository](https://github.com/makehumancommunity/makehuman), MakeHuman contributors | CC0 1.0 |
| Skin textures, hair, eyes, eyebrows, eyelashes, teeth, and system clothing | [MakeHuman system asset pack](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html) | CC0 1.0 |
| Camisole dress with full skirt | Margaret Toigo, [Dress 01 pack](https://static.makehumancommunity.org/assets/assetpacks/dress01.html) | CC0 1.0 |
| Fitting, color adjustments, garment modifications, shin cuts and caps, optimized exports | Created for this project | CC0 1.0 |

Relevant sources:

- [MakeHuman license and asset exception](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.md)
- [CC0 1.0 legal text](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
- [Public asset pack index](https://static.makehumancommunity.org/assets/assetpacks.html)

Acquired September 6, 2026. Local source files and downloaded packs are in `source-assets/makehuman/` and are excluded from Git. The packed Blender scene retains the textures used in authoring. `source-assets/provenance.json` records SHA-256 checksums of the acquired sources.

The React viewer uses React (MIT), Three.js (MIT), Vite (MIT), and Khronos glTF Validator (Apache-2.0). Their license files are included in their installed packages. The code authored for this project is licensed under MIT; see `LICENSE`.
