# Phase 3 Stranger Test

Date: 2026-05-09.

External tester availability: no separate human was available during the autonomous run, so the required substitute was a fresh private-browser pass with empty storage and a real-style note file.

## Scenario

Input note:

```text
email Dana tomorrow about budget. daily stretch every morning.
call Mira tomorrow about tickets.
```

Cold path exercised:

1. Open the app with empty storage.
2. Load the note through capture file import.
3. Reload before extraction to confirm draft restore.
4. Extract into plan/habit rows.
5. Copy the plan to clipboard.
6. Export a JSON state file.
7. Reset the workspace.
8. Import the JSON export.
9. Create a share link.
10. Open the share link in a new page.
11. Turn voice cues off and verify Voice cue respects the setting.

## Findings and Fixes

| Finding                                                                               | Impact                                                      | Fix                                                                                                     |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Share created a clipboard URL but did not leave a visible URL if clipboard succeeded. | A user could not see or manually inspect the link.          | The Share action now always writes `#state=` into the address bar before trying clipboard copy.         |
| Raw import/export had no schema or provenance.                                        | A user could not tell whether a file was a real app backup. | Export now uses a versioned envelope with app version, schema version, commit, and generated timestamp. |
| Voice setting existed in state but did not control Voice cue.                         | The Settings page was misleading.                           | Added a visible toggle and made Voice cue refuse playback when disabled.                                |

## Result

The cold path completed without help after the fixes. The remaining caveat is that arbitrary URL import and OCR are intentionally out of scope; users must paste rendered text or upload text-like files.
