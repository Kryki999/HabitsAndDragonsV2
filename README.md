# Habits & Dragons — Concept Bible

Ten folder to **czarno na białym** obraz finalnego produktu — zanim wrócimy do kodu.

Prototyp (`../habitsanddragons`) = wersja 1, źródło inspiracji.  
Tu budujemy **koncepcję docelowej gry**: mechaniki, świat, grafika, animacje, psychologia, tech.

**Nowy w ekipie?** Zacznij od [`docs/25-welcome.md`](docs/25-welcome.md) — jeden plik: V1 vs V2, mechaniki, zajawka fabuły, stack i co jest otwarte. Reszta biblia jest pod spodem.

**Rola agenta:** współzałożyciel / partner kreatywny / lekki PM — nie domyślny programista.  
Zobacz [`AGENTS.md`](AGENTS.md) i `.cursor/rules/co-founder-mode.mdc` (handoff dla kolejnych sesji).

## Jak pracujemy

1. Masz pomysł / wątpliwość → wrzucasz do czatu albo `docs/ideas-inbox.md`.
2. Wpychamy to do właściwego pliku tematycznego (świat, silnik, art…).
3. W pliku trzy warstwy:
   - **Z prototypu** — co już działało / było obiecane
   - **Cel (final)** — jak ma być w docelowej grze
   - **Otwarte** — decyzje, konflikty, „jeszcze nie wiemy”
4. Gdy filar się ustabilizuje → aktualizujemy `docs/00-final-picture.md` (jeden spójny obraz gry).

**Nie** robimy tu CodeMaps ani kodu. Najpierw konsensus produktowy.

## Mapa dokumentów

| Plik | O czym |
|------|--------|
| [`docs/00-final-picture.md`](docs/00-final-picture.md) | Synteza — jak wygląda i działa cała gra |
| [`docs/01-product-vision.md`](docs/01-product-vision.md) | Po co ta gra istnieje, gracz, obietnica |
| [`docs/02-psychology.md`](docs/02-psychology.md) | Retencja, haczyki, anty-cele psychologiczne |
| [`docs/03-core-loop.md`](docs/03-core-loop.md) | Codzienna pętla i rytm dnia/tygodnia |
| [`docs/04-game-world.md`](docs/04-game-world.md) | Lore, miejsca, Living World, Destiny |
| [`docs/05-rpg-progression.md`](docs/05-rpg-progression.md) | Klasy, XP, poziomy, tytuły, hex |
| [`docs/06-economy-loot.md`](docs/06-economy-loot.md) | Złoto, klucze, lochy, kosmetyki, sinki |
| [`docs/07-ai-sage.md`](docs/07-ai-sage.md) | Mędrzec, Oracle, coaching |
| [`docs/08-social.md`](docs/08-social.md) | Friends, ranking, gildie, mapa |
| [`docs/09-art-graphics.md`](docs/09-art-graphics.md) | Styl wizualny, assety, UI |
| [`docs/10-animation-feel.md`](docs/10-animation-feel.md) | Animacje, Lottie, haptics, game feel |
| [`docs/11-audio.md`](docs/11-audio.md) | SFX, muzyka, ambient |
| [`docs/12-tech-stack.md`](docs/12-tech-stack.md) | Technologie (app, backend, AI, art pipeline) |
| [`docs/13-game-systems.md`](docs/13-game-systems.md) | „Silnik gry” — systemy logiczne (nie kod) |
| [`docs/14-monetization-liveops.md`](docs/14-monetization-liveops.md) | Premium, eventy, LiveOps |
| [`docs/15-onboarding-arrival.md`](docs/15-onboarding-arrival.md) | Wejście do świata, cinematic, tworzenie postaci |
| [`docs/16-productization-method.md`](docs/16-productization-method.md) | Taktyka: wizja → journey → IA → ekrany |
| [`docs/17-player-journey.md`](docs/17-player-journey.md) | Day 0–7 — co przeżywa gracz |
| [`docs/18-information-architecture.md`](docs/18-information-architecture.md) | Przestrzenie / zakładki (hipoteza) |
| [`docs/20-pre-world-locklist.md`](docs/20-pre-world-locklist.md) | Locklista — **zamknięta** |
| [`docs/21-world-bible-mvp.md`](docs/21-world-bible-mvp.md) | Biblia świata MVP (żywa pamięć) |
| [`docs/22-universe-story-act1.md`](docs/22-universe-story-act1.md) | Proza / historia Aktu 1 (Dreamwake) |
| [`docs/23-act1-location-brainstorm.md`](docs/23-act1-location-brainstorm.md) | Burza mózgów Akt 1 — lokacje, NPC, lampki (prototyp) |
| [`docs/24-map-production.md`](docs/24-map-production.md) | Produkcja mapy: AI, rozdzielczość, P1 still vs P2 życie |
| [`docs/25-welcome.md`](docs/25-welcome.md) | **Onboarding nowej osoby** — synteza koncepcji (start tutaj) |
| [`docs/reference/art/style-kit.md`](docs/reference/art/style-kit.md) | **Kreska — paste** (krótki lock + SCENE) |
| [`docs/reference/art/rpg-visual-style-bible-v1.1.md`](docs/reference/art/rpg-visual-style-bible-v1.1.md) | Biblia kreski (ludzka, nie paste) |
| [`docs/reference/art/rpg-art-master-prompt-v1.1.md`](docs/reference/art/rpg-art-master-prompt-v1.1.md) | Archiwum: długi Master Prompt |
| [`docs/reference/art/prompt-crownhaven-closeup.md`](docs/reference/art/prompt-crownhaven-closeup.md) | Prompt look-dev: close-up stolicy |
| [`docs/reference/art/prompt-vendor-shop.md`](docs/reference/art/prompt-vendor-shop.md) | Prompt: ekran straganu (shop / guide #1) |
| [`docs/reference/art/prompt-gutterjack-dungeon.md`](docs/reference/art/prompt-gutterjack-dungeon.md) | Prompt: loch Gutterjack (piwnica menelni, Common) |
| [`docs/reference/art/prompt-smugglers-teeth-closeup.md`](docs/reference/art/prompt-smugglers-teeth-closeup.md) | Prompt: close-up pirackiej zatoki |
| [`docs/reference/art/prompt-teeth-dungeons.md`](docs/reference/art/prompt-teeth-dungeons.md) | Prompt: loch Teeth L1 załoga / L2 Marrow |
| [`docs/reference/art/prompt-crown-approaches-closeup.md`](docs/reference/art/prompt-crown-approaches-closeup.md) | Prompt: close-up przedpoli (Pell + Inkless) |
| [`docs/reference/art/prompt-approaches-dungeons.md`](docs/reference/art/prompt-approaches-dungeons.md) | Prompt: loch Approaches L1 banda / L2 Rook |
| [`docs/reference/art/prompt-anvil-glade-closeup.md`](docs/reference/art/prompt-anvil-glade-closeup.md) | Prompt: close-up lasu (Torrik + Stillgaze) |
| [`docs/reference/art/prompt-torrik-smithy.md`](docs/reference/art/prompt-torrik-smithy.md) | Prompt: wnętrze kuźni / NPC Torrik |
| [`docs/reference/art/prompt-stillgaze-dungeon.md`](docs/reference/art/prompt-stillgaze-dungeon.md) | Prompt: loch Stillgaze (Common, 1 kadr) |
| [`docs/reference/art/prompt-closed-way-closeup.md`](docs/reference/art/prompt-closed-way-closeup.md) | Prompt: close-up ★1 Closed Way (szlak) |
| [`docs/reference/art/prompt-closed-way-dungeons.md`](docs/reference/art/prompt-closed-way-dungeons.md) | Prompt: loch ★1 Elite wataha / Champion Skarne |
| [`docs/ideas-inbox.md`](docs/ideas-inbox.md) | Surowy dump pomysłów (Twoje + archiwum) |
| [`docs/reference/prototype-v1.md`](docs/reference/prototype-v1.md) | As-is prototypu (referencja UX/zadań — nie cel) |
| [`docs/reference/art/`](docs/reference/art/) | Refy art (mapa itd.) |
| [`docs/reference/archive-concept-mid.md`](docs/reference/archive-concept-mid.md) | Starsza koncepcja „dodatków do prototypu” |

## Stan

Zaczynamy od szkieletów + referencji prototypu.  
**Twój następny krok:** wrzuć dodatkowe pomysły i rzeczy, które Cię mylą — rozłożymy je po plikach i dogramy `00-final-picture`.
