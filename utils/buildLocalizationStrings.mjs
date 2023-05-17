import { readdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import process, { cwd } from 'process';
//import * as xml2js from 'xml2js';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import yargs from 'yargs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const XML_PARSER_OPTIONS = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    commentPropName: "#comment",
    preserveOrder: true,
    format: true,
    indentBy: "  ",
    suppressEmptyNode: true
}
const IGNORED_FILES = [
    "utils",
    "out",
    "obj",
    "node_modules"
];

const STRING_KEY_ATTRIBUTES = [
    "display-name-key",
    "description-key"
];

const MANIFEST_FILE_NAME = "ControlManifest.Input.xml";

const argsv = yargs(process.argsv);

const findXmlNodes = (xmlNodeArray, ...nodeNames) => {
    const [nodeName, ...restNodeNames] = nodeNames;

    if(!nodeName || nodeName == '') 
        return xmlNodeArray;

    return xmlNodeArray
        .filter((node) => Object.keys(node).includes(nodeName))
        .map((node) => {
            
            return restNodeNames.length > 0 
            ? findXmlNodes(node[nodeName], ...restNodeNames)
            : node
        })
        .flat()
        .filter((node) => !!node);
}

const readXmlFile = async (filename) => {
    if(!existsSync(filename)) return;
    const file = await readFile(filename, "utf-8");
    const parser = new XMLParser(XML_PARSER_OPTIONS);
    return parser.parse(file);
}

const findFiles = async (fileName, dir = cwd(), recursive = false,) =>{
    let foundFiles = [];
    const files = await readdir(dir, {withFileTypes: true});
    
    for(const file of files){
        if(file.name == fileName){
            console.log(`Found ${path.relative(workingPath, path.resolve(dir, file.name))}`);
            file.path = dir;
            foundFiles.push(file);
        }

        if(file.isDirectory() && !IGNORED_FILES.includes(file.name)){
            foundFiles = [...foundFiles, ...await findFiles(fileName, path.resolve(cwd(), dir, file.name))]
        }
    }
    return foundFiles
}

const getReferencedResources = (manifest, localizationCode) =>{
    const resxNodes = findXmlNodes(manifest, "control", "resources", "resx");
    return resxNodes.map((node) =>{
        return node[':@'].path
    })
};

const getStringKeys = (parsedXmlObject, existingKeys) => {
    //console.log({parsedXmlObject, isArray: Object.prototype.toString.call(parsedXmlObject) === '[object Array]', isObject: typeof parsedXmlObject === 'object'})
    
    if(Object.prototype.toString.call(parsedXmlObject) === '[object Array]')
        return parsedXmlObject.flatMap((obj)=>getStringKeys(obj, existingKeys)).filter((key) => key && key != '');
    
    if(typeof parsedXmlObject === 'object')
        return Object.keys(parsedXmlObject)
                .filter((xmlObjectKey)=>{
                    return xmlObjectKey !== "#comment" 
                        && !existingKeys.find((existingKey) => parsedXmlObject[xmlObjectKey] == existingKey.name)
                })
                .flatMap((xmlObjectKey) => {
            return STRING_KEY_ATTRIBUTES.includes(xmlObjectKey)
                ? parsedXmlObject[xmlObjectKey]
                : getStringKeys(parsedXmlObject[xmlObjectKey], existingKeys);
        }).filter((key) => key && key != '')
}

const createResxNode = (key) =>{
    return { 
        data: [{ 
            value: [ { "#text": key } ]
        }], 
        ":@": { name: key, "xml:space": "preserve" }
    }
}

const createResourceNode = (path) =>{
    return { 
        resx: [], 
        ':@': { path: path, version: "1.0.0"}
    }
}

const buildXml = (xmlObject) => {
    const builder = new XMLBuilder(XML_PARSER_OPTIONS);
    return builder.build(xmlObject);
}

//get control manifests
const workingPath = path.resolve(cwd(), argsv.path || "");
const localizationCode = argsv.loc ?? '1033';


console.log(`Searching for ${MANIFEST_FILE_NAME}`);
const controlManifests = await findFiles(MANIFEST_FILE_NAME, workingPath, true);

for(const controlManifest of controlManifests){
    //get manifests
    const controlManifestAbsolutePath = path.resolve(controlManifest.path, controlManifest.name);
    const manifestObj = await readXmlFile(controlManifestAbsolutePath);
    const manifest = findXmlNodes(manifestObj, "manifest")[0];

    //get listed resx files
    const resxReferences = getReferencedResources(manifest.manifest, localizationCode);
    
    //load existing resx entries
    const existingStringKeys = (await Promise.all(resxReferences.map(async (resx)=>{
        const absPath = path.resolve(controlManifest.path, resx)
        const resxFile = await readXmlFile(absPath);


        return resxFile && findXmlNodes(resxFile, "root", "data").map((data) =>{
            return { name: data[':@'].name, absolutePath: absPath, relativePath: resx }
        })

    })))
    .flat(1)
    .filter((existingStringKey) => existingStringKey);

    //find all unset keys in manifest
    const newKeys = getStringKeys(manifest, existingStringKeys); 
    if(newKeys.length == 0) {
        console.log(`${path.basename(controlManifest.path)}: No new keys detected`);
        continue;
    }
    
    //update resx file with new keys
    const defaultResxRelativeFileName = 
        path.relative(
            controlManifest.path, 
            path.resolve(
                controlManifest.path,
                "strings", 
                `${path.basename(controlManifest.path)}.${localizationCode}.resx`
            )
        );

    const defaultResxFileName = path.resolve(controlManifest.path, defaultResxRelativeFileName);
    console.log(`Updating ${path.relative(workingPath, defaultResxFileName)} with ${newKeys.length} new key entries`);

    const defaultResxFile = await readXmlFile( 
        existsSync(defaultResxFileName) 
            ? defaultResxFileName 
            : path.resolve(__dirname, "Template.resx"), 
        "utf-8"
    );
    const defaultResxFileRootChildren = findXmlNodes(defaultResxFile, "root")[0].root;
    
    newKeys.forEach((key)=>defaultResxFileRootChildren.push(createResxNode(key)));
    
    const updatedDefaultResxFile = buildXml(defaultResxFile);
    writeFile(defaultResxFileName, updatedDefaultResxFile);

    if(resxReferences.find((resxRef) => path.resolve(controlManifest.path, resxRef) === path.resolve(controlManifest.path, defaultResxRelativeFileName)))
        continue;
    
    console.log(`Updating ${path.relative(workingPath, controlManifestAbsolutePath)} with 1 new resx resource`);
    findXmlNodes(manifestObj, "manifest", "control", "resources")[0].resources
        .push(createResourceNode(defaultResxRelativeFileName));
    
    const updatedManifest = buildXml(manifestObj);
    writeFile(controlManifestAbsolutePath, updatedManifest);
}
