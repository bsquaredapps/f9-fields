export const SelectedOptionsSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "Value": {
                "type": "string"
            },
            "Text": {
                "type": "string"
            },
            "Group": {
                "type": "string"
            }
        }
    }
};

export const SelectedOptionSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "Value": {
            "type": "string"
        },
        "Text": {
            "type": "string"
        },
        "Group": {
            "type": "string"
        }
    }
};