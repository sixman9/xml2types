#!/usr/bin/env ts-node
import { program } from "@caporal/core";
import { tsFromXML } from "./conversion/xml2ts";
import { parseBooleans } from "xml2js/lib/processors";
import * as clip from "clipboardy";

program
  .version("0.0.1")
  .description("Convert sample XML to Typescript definitions for xml2js")
  .argument("[folder]", "Directory to read XML from", {
    validator: program.STRING,
    default: ".",
  })
  .option("-o, --out", "Directory to place", {
    validator: program.STRING,
    default: "./generated-xml-types",
  })
  .option("-e, --ext", "File extension", {
    validator: program.STRING,
    default: "xml",
  })
  .option("-c, --copy", "place the output into the paste buffer.", {
    validator: program.BOOLEAN,
    default: false,
  })
  .option("-d, --debug", "toggle logging etc.", {
    validator: program.BOOLEAN,
    default: false,
  })
  .option("-j, --json-only", "Only output xml2js to folder", {
    validator: program.BOOLEAN,
    default: false,
  })
  .action(({ logger, args, options }) => {
    const isDebug: boolean = parseBooleans(JSON.stringify(options.debug));
    const isCopyOutput: boolean = parseBooleans(JSON.stringify(options.copy));
    const isJSONOnly: boolean = parseBooleans(JSON.stringify(options.jsonOnly));

    if (isDebug) {
      logger.info("options: %s", options);
      logger.info("args: %s", args);
    }

    const outDir = options.out.toString();

    tsFromXML(
      options.ext.toString(),
      args.folder.toString(),
      options.out.toString(),
      isJSONOnly,
      isDebug
    )
      .then((genCode) => {
        if (isDebug) logger.info("CONTENT\n" + genCode);
        if (isCopyOutput) {
          clip.writeSync(genCode);
        }
        // TODO - output to file/directory (outDir)
      })
      .catch((err: Error) => {
        logger.error(err.message);
      });
  });

program.run();
