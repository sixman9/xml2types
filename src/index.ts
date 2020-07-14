#!/usr/bin/env ts-node
import { program } from "@caporal/core"

program
  .version("0.0.1")
  .description("Convert sample XML to Typescript definitions for xml2js")
  .argument("[xml-files...]", "Optional list of XML files to base TypeScript on.")
  // .option("-e, --ext", "File extension", { validator: program.STRING, 
  // default: "xml"})
  .action(({logger, args, options}) => {

    const fileNames: string[] = args.xmlFiles.toString().split(",");

    logger.info("'filename' array length is %d", fileNames.length)
    logger.info("args", args)
  })

program.run()