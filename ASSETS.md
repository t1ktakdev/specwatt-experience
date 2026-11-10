# Assets & rights

## Experience V3 library

| Asset                                                          | Purpose                                                           | Output                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `welcome-architecture.webp`                                    | Welcome only: architectural threshold, travertine, bronze pendant | 960 × 1440, 63,940 bytes; 480w variant 15,170 bytes |
| `lighting-bedroom.webp`                                        | Lighting only: walnut headboard, grazing light, floating bed      | 960 × 1200, 69,372 bytes; 480w variant 17,312 bytes |
| `evening-object.svg`                                           | Home only: sculptural glass / bronze object                       | editable code-native vector, 1,741 bytes            |
| `design-export/lamp-on.svg`, `lamp-off.svg`, `power-gauge.svg` | Device detail and design handoff                                  | exported from actual React SVG components           |
| `design-export/icons/*.svg`                                    | curated Lucide controls / safety icons                            | 12 editable SVGs, ISC license                       |

Both V3 interiors are original AI-generated concept scenes produced with the built-in `image_gen` tool on 10 November 2026. They contain no UI, lettering or hardware claims. No reference artist's image is included in published assets. Generated PNG masters remain in the local Codex generated_images directory; optimized responsive WebP copies are in this repository. Photography is used on two distinct routes; small device cards use vector icons.

### Welcome generation specification

Photorealistic editorial architectural photograph, portrait 2:3. Quiet double-height entrance and reading alcove at dusk, warm graphite travertine and smoked oak, sweeping wall, low ivory upholstered bench, single bronze disk pendant, narrow blue-hour window, floor-washing lights and concealed amber cove. Sculptural geometry, generous lower dark space, believable 2700K bounce, detailed shadows, restrained grade and fine grain. No living-room sofa, armchair, people, text, UI, logo or montage. Native master: `exec-d10db52b-c1b7-42e1-8aca-15b8fcd9f7de.png`.

### Lighting generation specification

Photorealistic editorial bedroom, portrait 4:5, diagonal doorway camera. Low floating bed with warm-grey linen at lower right, smoked walnut headboard, graphite plaster, horizontal recessed amber light, under-bed light, small opal wall sconce, ribbed bronze screen and blue-hour light at left. Realistic materials and pools of 2700K light, detailed shadows, subtle grain. No pendant, chair, sofa, living room, people, text, UI or logo. Native master: `exec-d4b90e04-7a43-44c5-a173-65ea84d42723.png`.

### Previous assets retained

`ambient-room.webp` remains as the V1 source asset for rollback. **No V3 screen references it.**

- `public/assets/ambient-room.webp`: original image generated for this prototype with the built-in `image_gen` tool; no reference artist's photograph was copied. Generated PNG remains in the local Codex generated_images directory; the project contains a WebP copy (quality 90). It is an editorial concept image, not a photograph of actual SpecWATT hardware.
- Icons: `lucide-react`, ISC license, retained in `licenses/`.
- Manrope: Mikhail Sharanda and contributors, SIL Open Font License 1.1, retained in `licenses/`. Cyrillic and Latin webfonts are bundled locally through `@fontsource/manrope`.
- Graphs, gauge, lamp illustration, controller illustration and layout: code-native SVG/CSS for this project.
- The reference screenshots are **not** included in the published source. Original SpecWATT source is **not** copied into this repository.

## Image prompt (built-in tool, not CLI)

Create a single photorealistic editorial interior photograph, portrait 2:3. For a premium smart energy mobile app, NO text, NO UI, NO logos, NO montage. Contemporary warm brutalist living room at blue hour, warm dark charcoal limewashed walls, an oversized sculptural cognac boucle lounge chair low right, a small smoked oak side table, beautifully glowing amber elongated pendant light hanging from ceiling at upper left, a broad architectural opening and subtle warm linear LED cove illuminating the rear wall, sheer dark curtains, matte stone floor, a single large sculptural indoor plant on far left edge. Moody but with clear photographic detail in shadows, warm illumination at 2700K, luxurious restrained materiality, natural 35mm architectural photograph, camera at seated eye level. Composition: pendant around x=32%, y=28%, chair at x=67%, y=62%. Upper 10% dark clear wall, bottom 25% darker continuous floor free of objects for later UI overlay. Rich graphite shadows, realistic amber bounce light, no orange haze. Photo must be gorgeous and feel real, sophisticated film grade, subtle grain. This is an original scene, not copying any existing photograph.
