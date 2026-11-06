# Private Roleplay Mobile: release acceptance checklist

Scope: private, single-user Android app on Samsung Galaxy S25. Local GGUF inference. No cloud storage or PC client. The ChatterUI-derived engine and existing on-device data must be retained.

## Before installing an update
- Export a backup using Settings > Privacy & Device > Database > Export (if supported on the installed build). Store it somewhere safe.
- Do not uninstall, clear app storage, change Android package ID, or delete external GGUF models.
- Update using the APK built from the same signing configuration.

## Functional smoke tests
1. Launch offline. No blank/black screen, unwanted login or cloud request.
2. Verify existing characters, images, histories and saved preferences remain after an in-place APK update.
3. Open Character Editor. Edit a test card, Save, close and reopen, and verify the changes persist.
4. Load Gemmasutra 4B GGUF from local storage. Send a short test prompt and confirm a usable response.
5. During generation, verify streaming text, Stop button, then Regenerate and swipe controls.
6. Create a new chat, switch chats, rename a chat, and return to the earlier history without losing messages.
7. Open Story Memory. Save distinct facts under This story and This character. Close and reopen the panel and the app to verify they persist.
8. In a newly created chat, set This story to: "The user found the blue map called MAP-47. The user did not find Aria's pendant. They agreed to explore the lost temple together." Ask: "What object did I find? Answer only with its exact name." Expected: MAP-47. Repeat after restarting the app.
9. Inspect Logs for `[ContinuityMemory] Included ... pinned note(s) in latest user prompt`. Logs confirm prompt construction, not that the model must obey every fact.
10. Enable airplane mode and repeat a short role-play exchange; verify the local model does not depend on a network connection.
11. In chat, open/close the keyboard and navigate away/back; verify the composer, status chip and memory control are not clipped.
12. Verify export/import with disposable test data only, not by overwriting the sole copy of an important database.

## Performance
- Compare against the same model, prompt and runtime settings. Initial owner observation: ~5-12 text tokens/sec on Galaxy S25, but thermal throttling and context length affect speed.
- Test 4096 context, 4 CPU threads, 512 batch, 0 GPU layers as the current known configuration. Change one variable at a time.
- Treat unexpected 0.07 t/s runs or multi-minute short replies as regressions requiring logs.

## Automated CI on feature/roleplay-ui-v01
- `npx tsc --noEmit`
- `npx jest lib/engine/API/PinnedMemory.test.ts --runInBand --watch=false --ci`
- Android release APK should build only on an explicit `[build-apk]` commit, not every small source change.

## Outstanding release gates
- No full device QA has yet been executed by CI. Android must be tested on the actual S25.
- A small local model may still hallucinate, even with pinned memories delivered correctly.
- Existing database export/import and Android permission behavior require manual confirmation.
- Keep the current app identifier and signing key until a backed-up migration is available.
