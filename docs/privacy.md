# Privacy

Gentle ADHD Flow is local-first.

## What Is Collected

No analytics are collected in v1.

No brain-dumps, transcripts, tasks, habits, focus sessions, or reflections are sent to a project server.

## Where Data Lives

User data is stored in the browser profile with IndexedDB through Yjs persistence.

Optional AI modules may download public model files on first use. Processing happens in the browser after the model is loaded.

Voice cues prefer the in-browser Piper engine, which runs fully locally. If that engine is unavailable, the app falls back to the browser's built-in speech synthesis API and only uses a voice explicitly marked as local by the browser; if the browser only offers network-based voices, the cue stays silent instead of sending the cue text to a remote voice service.

## Export And Deletion

The app provides local export/import and reset controls. Clearing browser site data also removes local app data.
