# 04 — Game World (mapa królestwa)

## Z prototypu / archiwum

Obóz, Destiny katalog, osobne sojusznicy/eksploracje — **scalane**. Archiwum paths/sojusznicy/wyprawy zostaje jako budulec pod **jedną mapę**.

## Cel (final) — szkic roboczy

### Metafora świata

Jedna **mapa królestwa**. Start: **stolica**. Stamtąd odblokowujesz lokalizacje.

### Lokalizacja (atom świata)

Może zawierać dowolną kombinację:

- NPC sojusznik / mistrz Drogi / quest giver („dobra osoba”)
- Wątek fabularny
- Loch / boss („zło”) — 1 poziom **lub** 2–3 tier’y (gate lepszego lootu)
- Nic z powyższych w pełnym zestawie — bywa „tylko loch” albo „tylko fabuła”

Przykłady klimatu: złowrogi las, piramida, pałac wiedźmy, kryjówka piratów, królestwo krasnoludów…

### Odblokowania

- **Main:** te same dla wszystkich (np. po levelu) — kręgosłup fabuły.
- **Side:** zależne od rozwoju (Droga, wybory, progi) — nie każdy odkrywa to samo w tej samej kolejności.

### Travel

> **MVP lock 2026-10-06:** mapa **bez fog of war**; piny otwiera **level**. Wyprawa discover **nie** jest near-term. [`00`](00-final-picture.md).

**Cel (final), nie ten slice:** *Discover once, return forever.*  
Wyprawa czasowa = przede wszystkim **pierwsze odkrycie** lokacji (Finch: rano wyślij / wieczór odbierz). Potem dostęp bez timera.

### Stolica = od zera do wpływu

Rynsztok → lepsza chata → wpływ w mieście → ewentualnie siedziba/zamek w stolicy.  
To zastępuje „rozwój izolowanej wioski” jako główne fantasy progressu domowego.

### Immersja

Ukryta karta gracza + reguły „świat pamięta” (anty-Skyrim) — nadal fundament; mapa dostarcza **wydarzeń**, które karta zapisuje.

## Travel / odkrywanie lokacji — konsensus roboczy (2026-07-30)

**Nazwa robocza (Cel / later):** *Discover once, return forever.*  
**Ten slice (2026-10-06):** całe królestwo **widać**; pin locked/open = **poziom**; bez timera wyprawy.

| Moment | Co się dzieje |
|--------|----------------|
| Mapa (ten slice) | Cała widoczna — fog of war **nie** jest chrome ani near-term |
| Unlock (ten slice) | Level otwiera pin → PeekCard → Enter |
| Cel (final) | Mgła (klimat Ghost of Tsushima) — nieodkryte = zasłonięte; pierwsza podróż = timer → lokacja odkryta |
| Potem (Cel) | **Szybka podróż / fokus natychmiastowy** — lochy, NPC, misje bez kolejnego czekania |
| Zwoje teleportu | PARK / later (Margonem-flavor); nie potrzebne do core |

**Dlaczego Cel miał timer:** immersja przy odkryciu + grywalność przy powrotach. **Ten slice** nie wymaga tego — gate = level.

**Otwarte dopiski / status:**
- Fail odkrycia: **KILL** — zawsze dochodzisz (`20-pre-world-locklist.md`)
- Pierścienie: propozycja **soft breadth** (R2 wymaga ≥2 lokacji R1) + main piny wymuszone
- Zwoje: park
- Fog / discover expedition: **OUT** tego MVP

