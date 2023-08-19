# Better TS Errors 🧼

A parser and formatter for visualizing a simplified version of TS errors.

## Description

This tool outputs a markdown formatted version of a TypeScript error, including syntax highlight for code snippets etc.
It currently uses [undici](https://github.com/nodejs/undici) under the hood to fetch & cache all possible diagnostic error messages for TS, then using those to match against actual error messages in your project.

⚠️ Keep in mind since this extension stores all possible TS error messages in-memory, it might allocate >= 5mb of memory just for the diagnostics messages. ⚠️

It's still under development and will most likely change in the future.

This project was highly inspired by [ts-error-translator](https://github.com/mattpocock/ts-error-translator) from [Matt Pocock](https://twitter.com/mpocock1).

## Settings

```jsonc
{
  // Prettifies the response with emojis and such.
  "betterTypeScriptErrors.prettify": true
}
```

If you notice the UI stuttering sometimes and/or the autocomplete being delayed, try applying this to your `settings.json` file (this will make so the extension runs in a separate process):

```jsonc
{
  "extensions.experimental.affinity": {
    "better-ts-errors.better-ts-errors": 1
  }
}
```
