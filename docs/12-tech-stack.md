# 12 — Tech Stack

> **Status:** szkic kierunku pod wizję Rev B (mapa wow + cartoon + filmiki + nawyki). Nie dogmat — do locku.  
> Sesja tech: 2026-08-01.

## Z prototypu

- Expo 54 / React Native / Expo Router
- Zustand (god-store) + AsyncStorage
- Supabase (Auth, profiles jsonb, friendships, reflections)
- Groq LLM (client key)
- TanStack Query (obecne, mało używane vs store)
- Rork toolkit (dev start)
- Lottie / Reanimated / haptics (feel V1)

## Werdykt roboczy (jednym zdaniem)

**Zostajemy przy Expo / React Native jako shellu aplikacji nawyków**, a „grywalność wizualną” budujemy warstwami (Rive + Skia/mapa ilustracyjna + pre-renderowane filmiki) — **nie** przepisujemy produktu na silnik gry (Unity/Unreal), bo to zabije lekkość Finch i codzienny open.

---

## Cel (final) — proponowany stack warstwowy

Produkt to **hybryda**: codziennie lekka apka nawyków + momenty immersji RPG. Tech musi służyć **obu**, nie tylko ładnej mapie.

| Warstwa | Kandydat | Dlaczego |
|---------|----------|----------|
| **Mobile app (shell)** | **Expo (RN)** — KEEP jako default | Questy, rytuał dnia, push, offline-ish, szybki cold start, jeden codebase iOS/Android. Prototyp już tu — rewrite silnika = miesiąc+ bez wartości gracza |
| **Nawigacja UI** | Expo Router | Zakładki: Questy · Świat · Bohater · Społeczność · Mentor |
| **Stan gry / nawyki** | Zustand **podzielony domenowo** (nie jeden god-store na prod) + persystencja | V1 god-store = dług techniczny; koncept: habits / world / hero / social osobno |
| **Sync / backend** | **Supabase** (Auth, DB, storage) — KEEP kierunek | Profile, social, save; Storage na assety/video jeśli trzeba CDN later |
| **AI Mentor** | LLM **tylko przez backend** (Edge Function / własny API) | Prod: zero kluczy w apce; karta gracza + rate limits |
| **Mapa królestwa (zoom-out)** | Ilustracja + **Skia**/gesty + mgła + piny | Rive **nie** jest silnikiem mapy świata; duży pan/zoom + wiele pinów = własny runtime |
| **Close-up lokacji (życie świata)** | **Rive living scene** (opcjonalnie) | Tu Rive się opłaca: mniejszy kadr, jedna całość art+ruch |
| **Postacie / itemy / UI motion** | **Rive** | Menus, HUD, bohater, loot — native sweet spot Rive |
| **Mikro-feel** | Reanimated + Haptics (+ Lottie tylko jeśli coś już jest / rare) | Odhacz nawyku, trajectory lootu — lekcje z V1 |
| **Filmiki fabularne** | **Pre-renderowane wideo** (AI pipeline + human gate) w playerze (`expo-av` / video) | Onboarding isekai, reveal questów, beaty Main ★ — **nie** real-time cutscenki z silnika |
| **Fallback cinematic** | Komiksowe panele + Rive / stills | Gdy klip nie gotowy albo weak device / accessibility / skip |
| **Art pipeline** | Look-dev guide (palette, line weight, proporcje) → AI draft → cleanup → export (PNG/WebP, Rive, MP4/WebM) | Spójność cartoon (R&M × VM × S&F) ważniejsza niż tool |
| **Realtime / social** | Supabase realtime later; MVP może polling / push | Nie blokuje mapy |
| **Analytics** | TBD (PostHog / Amplitude / …) | Retencja Day 1/7, odkrycia mapy, ukończenia ★ |
| **CI / release** | EAS Build + Submit | Standard Expo |

### Zasady niefunkcjonalne

| Zasada | Sens |
|--------|------|
| Cold start / codzienne otwarcie | Apka ma czuć się jak Finch, nie jak 800 MB gacha |
| Offline-first nawyki | Odhacz działa bez siatki; świat/sync dogrywa |
| Wow momenty = asset-bound | Mapa, Rive, video ważą — budżetować download / on-demand |
| Prywatność AI | Mentora i kartę gracza traktować jak dane wrażliwe |
| Koszt AI / user | Cinematics = **batch content**, nie generuj na żywo per user (MVP) |

---

## Co świadomie odrzucamy (na teraz)

| Opcja | Dlaczego nie (przy tej wizji) |
|-------|-------------------------------|
| **Unity / Unreal jako cała apka** | Świetne do gier akcji/3D; słabe jako lekka habit-apka + social + Mentor. Podwójny koszt (gra + native shell) albo fatalny UX „aplikacji” |
| **Godot / Flutter jako rewrite „bo ładniej”** | Nie rozwiązują mapy ilustracyjnej lepiej niż RN+Skia+Rive; koszt migracji > zysk |
| **Web-only PWA jako core** | OK jako later companion; immersja + push + feel na mobile native wygrywa |
| **Realtime 3D mapa** | Overkill vs Rev B (piny, close-up arty, lochy ekranowe). Immersja ma iść z **art + fog + story video**, nie z kamerą 3D |
| **Generowanie filmików AI on-device / per walkę** | Koszt, niespójność stylu, brak kontroli; batch + kuracja |

---

## Jak ugryźć „mapę wow” bez zmiany shellu

```text
1. Art: jedna (lub strefowa) ilustracja królestwa w stylu cartoon
2. Runtime: pan/zoom + warstwa mgły (odkryte = wycięte / fade)
3. Piny / gesty: Discover once → timer wyprawy → reveal
4. Tap pin → ekran CLOSE-UP lokacji (osobny art)
5. Hotspoty na close-up → NPC window / loch tier 1 → tier 2
```

To jest ten sam fantasy co w `23` Rev B — tech mu dorasta, nie odwrotnie.

**Kiedy wrócić do rozmowy o silniku gry?** Tylko jeśli produkt zmieni się w real-time combat / 3D world / ciągły world simulation. Przy „mapa + sceny + lochy ekranowe + habit loop” — Expo wygrywa.

Produkcja assetu mapy (dlaczego nie 4K 16:9, kafelki, P1 still vs P2 warstwy życia): [`24-map-production.md`](24-map-production.md).

---

## Filmiki — pipeline (produkt × tech)

| Krok | Kto / co |
|------|----------|
| Skrypt beatu (10–30 s) | Design / story (`22`, Main ★ lampki) |
| Generacja AI (draft) | Tooling TBD (Runway / Kling / …) |
| Look-dev gate | Człowiek: czy wygląda jak *nasz* cartoon? |
| Export skompresowany | MP4/WebM, warianty rozdzielczości |
| W apce | Fullscreen player; skip; napisy; fallback panele |
| Storage | CDN / Supabase Storage; preload tylko Day 0 + najbliższy beat |

---

## Migracja z prototypu V1

| KEEP | PRZEPISAĆ / WYRZUCIć |
|------|----------------------|
| Expo, nawyki UX, Reanimated lessons, Supabase kierunek | God-store monolith |
| Haptics / loot feel jako referencja | UI kotwiczące w obozie-zamku jako hub |
| | Client-side Groq key |
| | Założenie „Lottie = wszystko” → Rive dla postaci/itemów |

Rewrite **ekranów świata** = OK. Rewrite **całego frameworka** = nie, dopóki nie udowodnimy że RN nie dźwiga mapy (raczej dźwiga).

---

## Otwarte (do decyzji)

- [ ] Lock: **Expo shell + Skia mapa + Rive + pre-render video** jako domyślny kierunek 6–12 mies.?
- [ ] Budżet MB na launch (ile video onboardingu vs stream)?
- [ ] Czy close-up lokacji = zawsze bitmapa, czy czasem Rive scene?
- [ ] Kto robi look-dev gate AI video (założyciel / art contractor)?
- [ ] Skia vs prostszy Image+GestureHandler na MVP mapy (Skia later)?
- [ ] Analytics vendor

---

## Notatka dla agentów

Nie proponuj Unity „bo RPG”. Pytanie nadrzędne: **czy stack chroni codzienny rytuał nawyków i jednocześnie pozwala na wow mapy/cinematics?** Jeśli silnik gry psuje pierwsze — park.
