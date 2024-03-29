import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field';
import { getFileTypeIconAsHTMLString, initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { DocumentAddRegular, DocumentAddFilled } from '../components/react-icons/icons/chunk-2';
import { MoreHorizontalRegular, MoreHorizontalFilled } from '../components/react-icons/icons/chunk-4';
import bundleIcon from '../components/react-icons/utils/bundleIcon';
import wrapIcon from '../components/react-icons/utils/wrapIcon';
import {
    SplitButton,
    CompoundButton,
    Button,
    makeStyles,
    mergeClasses,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    tokens,
    MenuButtonProps,
    SplitButtonProps,
    CompoundButtonProps
} from '@fluentui/react-components';
import { saveAs } from 'file-saver';

export type F9FilePickerOnChangeEventHandler = (ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles: F9FilePickerFile[]) => void;
export interface F9FilePickerFile extends ComponentFramework.FileObject {
    description?: string;
    props?: CompoundButtonProps;
}

export interface F9FilePickerFieldProps {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    files?: F9FilePickerFile[];
    maxFiles?: number;
    maxFileSize?: number;
    layout?: "vertical" | "horizontal";
    removeFileLabel?: string;
    addFileLabel?: string;
    downloadFileLabel?: string;
    allocatedHeight?: number;
    allocatedWidth?: number;
    pickFile: () => Promise<ComponentFramework.FileObject[]>;
    onChange?: F9FilePickerOnChangeEventHandler
}

export type SelectionEvents =
    | React.ChangeEvent<HTMLElement>
    | React.KeyboardEvent<HTMLElement>
    | React.MouseEvent<HTMLElement>;

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const parseFileName = (filename: string) => {
    if (!filename) return;
    const splitName = filename.split(".");
    const namePart = splitName.slice(0, -1).join(".");
    const extensionPart = splitName[splitName.length - 1];
    const baseName = namePart && namePart !== "" ? namePart : filename;
    const extension = baseName === filename ? "" : extensionPart;
    return {
        baseName,
        extension
    }
}

const extractIconUrl = (htmlString?: string) => {
    if (!htmlString) return;
    const split = htmlString.split("\"");
    const urlIndex = split.findIndex(i => {  return i.substring(i.length - 4) == "src=" }) + 1;
    return split[urlIndex];
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${Math.floor((bytes * 100) / 1024) / 100} KB`;
    return `${Math.floor((bytes * 100) / 1048576) / 100} MB`;
};

initializeFileTypeIcons();

const DocumentAdd = bundleIcon(DocumentAddFilled, DocumentAddRegular);
const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

const useStyles = makeStyles({
    root: {
        display: "grid",
        gridTemplateRows: "repeat(1fr)",
        justifyItems: "start",
        columnGap: tokens.spacingVerticalM,
        rowGap: tokens.spacingHorizontalM
    },
    files: {
        listStyleType: "none",
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 0,
        display: "flex",
        gridGap: tokens.spacingHorizontalS,
        flexWrap: "wrap",
        flexDirection: "row",
        overflowY: "auto"
    },
    vertical: {
        flexDirection: "column"
    }
});
const useIconStyles = makeStyles({
    root: {
        display: "inline-block",
        verticalAlign: "middle",
        speak: "none",
        height: tokens.fontSizeBase400,
        maxWidth: tokens.fontSizeBase400,
        "> .svg": {
            fill: "currentColor",
            verticalAlign: "top",
            "forced-color-adjust": "auto"
        }
    },
    small: {
        maxHeight: tokens.fontSizeBase200,
        maxWidth: tokens.fontSizeBase200
    },
    large: {
        maxHeight: tokens.fontSizeBase600,
        maxWidth: tokens.fontSizeBase600
    }
})


export const F9FilePickerField: React.FunctionComponent<F9FilePickerFieldProps> = (props) => {

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        layout,
        files,
        pickFile,
        onChange,
        addFileLabel,
        removeFileLabel,
        downloadFileLabel
    } = props;

    const inputRef = React.useRef<HTMLDivElement>(null);

    const onRemove = (ev: React.FormEvent<HTMLDivElement>, selectedFile: F9FilePickerFile) => {
        if (isRead || isControlDisabled) return;
        const newFiles = files?.filter((currentFile) => {
            return currentFile.fileName !== selectedFile.fileName
        }) || [];
        onChange?.(ev, newFiles);
    }

    const onDownload = (ev: React.FormEvent<HTMLDivElement>, file: F9FilePickerFile) => {
        saveAs(`data:${file.mimeType ?? 'text/plain'};base64,${file.fileContent}`, file.fileName);
    }

    const onAdd = async (ev: React.FormEvent<HTMLButtonElement>) => {
        if (isRead || isControlDisabled) return;
        const fileObjs = await pickFile();
        if (fileObjs) {
            const newFiles: F9FilePickerFile[] = fileObjs;
            const existingFiles = files?.filter((oldfile)=>!newFiles.find((newFile)=>newFile.fileName === oldfile.fileName));
            const updatedFiles = existingFiles ? [...existingFiles, ...newFiles] : newFiles;
            onChange?.(ev, updatedFiles);
        }

    }

    const styles = useStyles();
    const iconStyles = useIconStyles();

    const renderFileItem = React.useCallback((file: F9FilePickerFile)=>{
        const parsedName = parseFileName(file.fileName);
        if (!parsedName) return;
        
        const fileTypeAltText = parsedName.extension && parsedName.extension !== ""
            ? `.${parsedName.extension} file type`
            : "unknown file type";
        
        const iconImg =
            <img src={extractIconUrl(getFileTypeIconAsHTMLString({ extension: parsedName.extension, imageFileType: "svg" }))}
                alt={fileTypeAltText}
                className={
                    mergeClasses(
                        iconStyles.root,
                        fieldProps.size == "small" && iconStyles.small,
                        fieldProps.size == "large" && iconStyles.large
                    )
                } />;
        const FileTypeIcon = wrapIcon(() => iconImg, fileTypeAltText);
        const menuItems = 
            [
                !isRead && !isControlDisabled && 
                    <MenuItem onClick={(ev) => onRemove(ev, file)}>
                        {removeFileLabel ?? "Remove File"}
                    </MenuItem>,
                file.fileContent && 
                    <MenuItem onClick={(ev) => onDownload(ev, file)}>
                        {downloadFileLabel ?? "Download File"}
                    </MenuItem>
            ].filter(item => item);

        
        return <li key={file.fileName}>
            {
                menuItems.length == 0

                ? <CompoundButton
                    secondaryContent={formatFileSize(file.fileSize)}
                    icon={<FileTypeIcon />}
                    size={fieldProps.size}
                    disabled={isControlDisabled}
                >
                    {parsedName.baseName}
                </CompoundButton>

                : <Menu>
                    <MenuTrigger>
                        {(triggerProps: MenuButtonProps) => (
                            <SplitButton
                                primaryActionButton={{
                                    children: (_: React.ElementType, props: SplitButtonProps) => {
                                        return <CompoundButton
                                            {...props as CompoundButtonProps}
                                            secondaryContent={formatFileSize(file.fileSize)}
                                            icon={<FileTypeIcon />}
                                        >
                                            {parsedName.baseName}
                                        </CompoundButton>
                                    }
                                }}
                                menuButton={{...triggerProps, icon: <MoreHorizontal/>}}
                                size={fieldProps.size}
                                disabled={isControlDisabled}
                            >
                            </SplitButton>
                        )}
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            { !isRead && !isControlDisabled && <MenuItem onClick={(ev) => onRemove(ev, file)}>{removeFileLabel ?? "Remove File"}</MenuItem> }
                            { file.fileContent && <MenuItem onClick={(ev) => onDownload(ev, file)}>{downloadFileLabel ?? "Download File"}</MenuItem> }
                        </MenuList>
                    </MenuPopover>
                </Menu>
            }
        </li>
    },[styles, iconStyles, onRemove, onDownload, fieldProps.size]);

    return <F9Field 
        {...fieldProps}
    >
        <div
            ref={inputRef} 
            className={mergeClasses(styles.root)} 
        >
            <ul className={mergeClasses(styles.files)}>
                {
                    files?.filter((file) => !!file.fileName)
                        .map((file) => renderFileItem(file))
                }
            </ul>
            {
                !isRead && 
                <Button 
                    icon={<DocumentAdd />} 
                    onClick={onAdd}
                    disabled={isControlDisabled}
                >
                    {addFileLabel}
                </Button> 
            }
        </div>
    </F9Field>
}