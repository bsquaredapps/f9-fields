const FileSchema = {
    "type": "object",
    "properties": {
        "File": {
            "type": "object",
            "properties":{
                "fileContent":{
                    "type":"string"
                },
                "fileName":{
                    "type":"string"
                },
                "fileSize":{
                    "type":"number"
                },
                "mimeType":{
                    "type":"string"
                }
            }
        }
    }
};
export const SelectedFileSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    ...FileSchema
};

export const SelectedFilesSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "items": FileSchema
};