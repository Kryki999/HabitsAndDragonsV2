# UI Habits & Dragons — zacznij tutaj

Folder z całym stylem aplikacji. Nowemu agentowi dajesz **ten folder** i tekst zlecenia z [`design-bible.md`](design-bible.md) (sekcja 8).

| Co | Gdzie | Po co |
|----|-------|-------|
| **Reguły** | [`design-bible.md`](design-bible.md) | Jak ma wyglądać wszystko: kolory, ikony, komponenty, typy ekranów (A, B, C1, C2, D, E), UI na grafice, checklista odrzutu |
| **Wzorce (obrazy)** | [`golden/`](golden/) | 11 gotowych ekranów-wzorów + plansza komponentów. Nowy ekran ma wyglądać jak ich rodzeństwo |
| **Źródło wzorców** | [`lookdev/`](lookdev/) | HTML + CSS, z którego robią się PNG w `golden/`. Tu są prawdziwe wartości (`tokens.css`) |
| **Ikony** | [`lookdev/assets/`](lookdev/assets/) | `fe-*.svg` kolorowe naklejki · `mc-*.svg` małe ikony systemowe · `hd-coin.svg` nasza moneta |
| **Mocki ChatGPT** | [`mocks/`](mocks/) | Skąd wzięliśmy kierunek. Nie wzorzec (inna kreska postaci) |
| **Historia decyzji** | [`design-bible.md`](design-bible.md) sekcja 11 | Co i dlaczego zablokowaliśmy / odrzuciliśmy |

Który wzorzec do czego:

| Robisz… | Zacznij od |
|---------|-----------|
| Listę / ekran z grafiką na górze | `home-quests`, `shop` |
| Profil, ustawienia, statystyki | `hero` |
| Nagrodę, streak, awans | `flow-streak`, `flow-levelup` |
| Pytanie onboardingu | `onboarding-choice` (jeden wybór), `onboarding-pick` (kilka) |
| Lokację, bossa, NPC | `world-crownhaven`, `world-gutterjack`, `world-npc-torrik` |
| Mapę | `world-map` |

Kreska świata (stille, postacie, mapa) to osobny dokument: [`../art/style-kit.md`](../art/style-kit.md).
