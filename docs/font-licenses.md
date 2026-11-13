# Font assets

Ruang Hitung self-hosts the variable font files through `@fontsource-variable/dm-sans` and `@fontsource-variable/fraunces`.

- DM Sans — SIL Open Font License 1.1. https://github.com/google/fonts/tree/main/ofl/dmsans
- Fraunces — SIL Open Font License 1.1. https://github.com/google/fonts/tree/main/ofl/fraunces
- License text: https://openfontlicense.org/open-font-license-official-text/

The font packages are pinned in `package.json` and their font files are bundled locally by Vite. No font is fetched from a third-party CDN at runtime.
