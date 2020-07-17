import * as xml2js from "xml2js";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  RendererOptions,
} from "quicktype-core";
import * as fs from "fs-extra-plus";

/**
 * This function will read a directory of XML file and infer a TypeScript type set, consumable by xml2js
 *
 * @param fileExtension
 * @param xmlInDir
 * @param isDebug
 */
export async function tsFromXML(
  fileExtension: string,
  xmlInDir: string,
  xmlOutDir: string,
  isWriteXml2JsJSONs: boolean = false,
  isDebug: boolean = false
): Promise<string> {
  if (isDebug) {
    console.info("XML directory = %s", xmlInDir);
  }

  // Initialise string array for inbound XML files contents
  let xmlContentArray: string[] = [];

  // Read XML from the file system
  const xmlFileNames = await fs.glob("*." + fileExtension, xmlInDir);

  if (xmlFileNames == null || xmlFileNames.length === 0) {
    //Nothing to do
    throw new Error(`No '${fileExtension}' files to process!`);
  }

  await xmlFileNames.forEach((nextFileName) => {
    let xmlFileBuffer = fs.readFileSync(nextFileName);
    let tempXMLContents: string = xmlFileBuffer.toString();
    if (isDebug)
      console.info("Read XML file length = " + tempXMLContents.length);
    xmlContentArray.push(tempXMLContents);
  });

  // Initialise array for JSON representation of converted XML files
  let xmlAsJSONStrings: string[] = [];
  let xmlAsJSONObjects: object[] = [];

  if (isDebug) console.info(xmlContentArray);

  // xml2js parser
  const parser = new xml2js.Parser({
    // TODO - Flatten XML - See
    explicitArray: false
  });

  // Collect JSONs from xml2js conversion(s)
  await xmlContentArray.forEach((xml: string) => {
    parser.parseString(xml, (err: any, result: object) => {
      if (!err) {
        xmlAsJSONObjects.push(result);
        let nextJsonStr = JSON.stringify(result);
        xmlAsJSONStrings.push(nextJsonStr);
        if (isDebug) console.info("%s", nextJsonStr);
      } else {
        console.error("Error during XML=>JSON\n" + err.message);
      }
    });
  });

  let isNoXMLJsons = xmlAsJSONStrings == null || xmlAsJSONStrings.length == 0;

  if (isNoXMLJsons) {
    console.error("No JSON to process!");
    return process.exit(1);
  }

  if (isWriteXml2JsJSONs) {
    // Write out the JSON from xml2js this time
    const jsonDir = xmlOutDir + "/jsons";
    let count = 1;
    xmlAsJSONStrings.forEach((nextXMLJson) => {
      fs.mkdirSync(jsonDir, {
        recursive: true,
      });
      fs.writeFileSync(jsonDir + "/xmlJson-" + count + ".json", nextXMLJson);
      count++;
    });

    console.info("Created xml2js JSON in '" + xmlOutDir + "'");
  }

  // Convert the xml2js-derived JSON XML representation to TypeScript, using Quicktype
  const { lines: generatedTypeCodeLines } = await genQuicktypeFromJSONs(
    "typescript",
    "XMLType",
    xmlAsJSONStrings
  );

  return Promise.resolve(generatedTypeCodeLines.join("\n"));
}

async function genQuicktypeFromJSONs(
  targetLanguage: string,
  typeName: string,
  jsonStrings: string[]
) {
  // RendererOptions - see https://github.com/quicktype/quicktype/issues/1357#issuecomment-575892707
  const options: RendererOptions = {
    // "typeSourceStyle": EnumOption<boolean>,
    // "includeLocation": EnumOption<boolean>,
    // "codeFormat": EnumOption<boolean>,
    // "wstring": 'false',
    // "msbuildPermissive": 'true',
    "just-types": "true",
    "runtime-typecheck": "false",
    // "namespace": "Model",
    // "enumType": "int",
    // "typeNamingStyle": "pascal",
    // "memberNamingStyle": "camel",
    // "enumeratorNamingStyle": "upper-underscore",
    // "boost": 'false'
  };

  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: jsonStrings,
  });

  let inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: options,
  });
}
