# PARC Android frontend: release checklist

This is a personal, offline-capable Android application for a single user.
There is no onboarding, login flow, desktop application or cloud sync.
Keep the original local database, GGUF engine and Android package identifier.

## Brand acceptance
- [ ] Launcher shows the PARC icon, not the upstream ChatterUI icon.
- [ ] Splash shows the PARC mark and wordmark on dark #100D17.
- [ ] Theme defaults to PARC Dark after an in-place upgrade.
- [ ] Brand colors: purple #542177, violet #8E1EA2, pink #D552A3, mint #98E8DE.
- [ ] Model and chat text remains readable on the dark background.
- [ ] No upstream ChatterUI links or labels appear in normal user-facing settings.

## Eight frontend areas
1. **Brand:** open, close, restart and verify PARC app name, icon, splash, palette.
2. **Character Library:** validate square 1:1 portraits, 2-column grid, sort, search and tag filter; test long names and missing portraits.
3. **Character Editor:** edit portrait, name, description, first message, alternate greeting, personality, scenario and example; save and reopen.
4. **Chat:** type multiline text with keyboard open, send, stop, swipe/regenerate and navigate back without clipping.
5. **Story Memory:** save and reopen Story and Character memory separately; test unsaved-close warning and successful persistence.
6. **Model Manager:** browse/import GGUF, load model, inspect progress, switch performance presets and return to chat.
7. **Settings:** expand all four sections, test theme selection, appearance, chat and privacy preferences; reopen to verify persisted preferences.
8. **Visual QA:** validate tap targets, keyboard safe area, scroll bounds and portrait orientation on Galaxy S25.

## Safety and runtime checks
- Export a database backup before installing any new APK.
- Update the current application in place; do not uninstall or clear its storage.
- Disable mobile data and Wi-Fi; load local GGUF and exchange short role-play messages.
- Verify existing characters, character photos and past conversations remain.
- Keep Test Model Memory separate from UI completion: a small model can still hallucinate facts.

## Automated checks
- TypeScript: `npx tsc --noEmit`
- Memory and Tags tests, plus PARC palette identity test.
- Release APK is built only on a commit containing `[build-apk]`.

## Release boundary
A successful TypeScript/CI run does not establish Android runtime stability or approve a 100% acceptance rating. Final sign-off requires checking the eight areas above on the actual phone.
