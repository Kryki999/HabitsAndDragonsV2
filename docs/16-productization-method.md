# 16 — Jak schodzimy z wizji na produkt (taktyka)

> Nie zgadujemy „wszystkich ekranów naraz”. Idziemy warstwami: podróż gracza → przestrzenie → ekrany slice → reszta.

## Problem

Mamy **szkic fantazji** (mapa, stolica, isekai, Mentor…).  
To jeszcze nie jest **produkt**: co user robi minutę po instalacji, jakie ma zakładki, które ekrany są launch-critical.

## Taktyka (kolejność sztywna)

```text
1. Podróż gracza (Day 0 → Day 7)     ← emocje + momenty
2. Przestrzenie produktu (IA)          ← 4–6 „miejsc”, nie 12 tabów
3. Ekrany Vertical Slice               ← minimum żeby fantazja była grywalna
4. Pełny inwentarz ekranów             ← + park / later
5. Dopiero potem UI wireframes / Rive  ← wygląd
```

### Dlaczego nie od listy wszystkich ekranów?

Bo lista 40 ekranów bez podróży = Habitica-sheet w przebraniu.  
Najpierw **co przeżywa człowiek**, potem **gdzie to klika**.

### Dlaczego nie od kodu / prototypu?

Prototyp podpowiada wzorce (quest list, kalendarz), ale **IA finalna wychodzi z mapy królestwa**, nie z 5 tabów V1.

---

## Warstwa 1 — Podróż gracza

Plik roboczy: [`17-player-journey.md`](17-player-journey.md)

Dla każdego momentu: **trigger → co widzi → co robi → co czuje → co zapisuje świat**.

Must: Day 0 (isekai→kapusta→questy), Day 1 wieczór (wyprawa?), Day 3 (pierwsza lokacja), Day 7 (wpływ w stolicy).

## Warstwa 2 — Przestrzenie (IA)

Plik: [`18-information-architecture.md`](18-information-architecture.md)

Przestrzeń ≠ koniecznie tab. To „pokoje” produktu, np.:

- Przybycie (raz)
- Stolica (hub)
- Mapa królestwa
- Questy / nawyki (pętla życia)
- Mentor (fullscreen rytuał)
- Ja (profil, hex, loadout, dom)

Max **5 pozycji nawigacji głównej** na co dzień (+ overlaye).

## Warstwa 3 — Vertical Slice

Jedna ścieżka end-to-end bez side systems:

Onboarding → 3 starter questy → stolica → odblokuj 1 lokację → 1 loch tier 1 → 1 wyprawa timer → wieczorny check → 1 reakcja Mentora z pamięci.

Wszystko poza slice = **park**, nawet jeśli kochamy pomysł.

## Warstwa 4 — Inwentarz ekranów

Plik: [`19-screen-inventory.md`](19-screen-inventory.md)

Każdy ekran: ID, przestrzeń, cel, wejścia/wyjścia, slice? (Y/N), status (need / park).

---

## Zasada współtwórcy

Pytanie do każdego ekranu:  
**Czy bez tego Day-0→Slice nadal opowiada „budzę się w królestwie i podróżuję”?**  
Nie → park.
