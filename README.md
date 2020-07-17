# xml2types 

## Convert multiple XML examples into TypeScript interfaces compatible with [xml2js][xml2js] (flattened JSON output)

```
#Poor, I know, I'm new to Typescript/Cli code
./src/index.ts -h
```

- Better explain usage here in README
- [ ] Removal of ['TSBB'][tsbb] Typescript build tool, for more stand tooling (e.g. tsc, ts-node)
- [ ] Complete 'npm i global' installable CLi feature ([how?][cli-ts-how])
- [ ] Possibly use of [Commander][commander] CLi project, instead o the very capable [Caporal][caporal] (larger user base?)
- [ ] Add feature toggle(s) for xml2js in-bound JSON representations
- [ ] Make use of more of [QuickType][quicktype]'s output formats, e.g. other languages (Java, etc.)

[xml2js]: https://github.com/Leonidas-from-XIV/node-xml2js
[quicktype]: https://github.com/quicktype/quicktype
[caporal]: https://github.com/mattallty/Caporal.js
[commander]: https://github.com/tj/commander.js
[tsbb]: https://github.com/jaywcjlove/tsbb
[cli-ts-how]: https://itnext.io/how-to-create-your-own-typescript-cli-with-node-js-1faf7095ef89