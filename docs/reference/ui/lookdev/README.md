# Look-dev — żywy wzorzec UI

HTML + CSS, z którego renderują się [`../golden/`](../golden/). Reguły: [`../design-bible.md`](../design-bible.md).

| Plik | Rola |
|------|------|
| `tokens.css` | Jedyne wartości (kolor, typo, promień, cień). Kod RN kopiuje nazwy 1:1. |
| `components.css` | Jeden selektor = jeden komponent z biblii (sekcja 4). |
| `glyphs.css` | Generowany przez `build_glyphs.py` z `assets/mc-*.svg`. Nie edytować ręcznie. |
| `*.html` | Ekrany wzorcowe (390×844) + `kit-sheet.html` (plansza komponentów). |
| `render.ps1` | Renderuje wszystko (albo wskazane strony) do `../golden/*.png` w 2x przez headless Edge/Chrome. |
| `assets/` | `fe-*.svg` Fluent Emoji Flat (MIT) · `mc-*.svg` MingCute (Apache-2.0) · `hd-coin.svg` (nasza moneta) · kopie stilli. |

```powershell
powershell -ExecutionPolicy Bypass -File docs/reference/ui/lookdev/render.ps1            # wszystko
powershell -ExecutionPolicy Bypass -File docs/reference/ui/lookdev/render.ps1 world-map  # jedna strona
python docs/reference/ui/lookdev/build_glyphs.py                                          # po dodaniu mc-*.svg
```

Nowy sticker: `https://api.iconify.design/fluent-emoji-flat/<nazwa>.svg` → `assets/fe-<nazwa>.svg`. Nowy glyph: `https://api.iconify.design/mingcute/<nazwa>.svg` → `assets/mc-<nazwa>.svg` + wpis w `build_glyphs.py`.
