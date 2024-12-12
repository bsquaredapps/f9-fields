import * as React from 'react';
import { F9Field, F9FieldProps } from '../../Field/Field/F9Field';
import { getFileTypeIconAsHTMLString, initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { 
    DocumentAddRegular, 
    DocumentAddFilled, 
    MoreHorizontalRegular, 
    MoreHorizontalFilled, 
    bundleIcon, 
    wrapIcon 
} from '@fluentui/react-icons';
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
    CompoundButtonProps,
    shorthands
} from '@fluentui/react-components';
import { saveAs } from 'file-saver';

export type F9FilePickerOnChangeEventHandler = (ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles: F9FilePickerFile[]) => void;
export interface F9FilePickerFile extends ComponentFramework.FileObject {
    description?: string;
    url?: string;
    state?: "added" | "removed" | "updated" | "none";
    previousVersion?: F9FilePickerFile;
    props?: CompoundButtonProps;
}

export interface F9FilePickerFieldProps {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    files?: F9FilePickerFile[];
    trackChanges?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    layout?: "vertical" | "horizontal";
    removeFileLabel?: string;
    addFileLabel?: string;
    downloadFileLabel?: string;
    revertFileLabel?: string;
    allocatedHeight?: number;
    allocatedWidth?: number;
    controlHeight?: number | "auto";
    controlWidth?: number | "auto";
    className?: string;
    style?: React.CSSProperties;
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
    },
    added: {
        ...shorthands.borderColor(tokens.colorPaletteGreenBorder2),
        backgroundColor: tokens.colorPaletteGreenBackground1,
        ':hover':{
            ...shorthands.borderColor(tokens.colorPaletteGreenBorder1),
            backgroundColor: tokens.colorPaletteGreenBackground2
        },
        ':hover:active': {
            ...shorthands.borderColor(tokens.colorPaletteGreenBorderActive),
            backgroundColor: tokens.colorPaletteGreenBackground3
        }
    },
    removed: {
        ...shorthands.borderColor(tokens.colorPaletteRedBorder2),
        fontStyle: "strikethrough",
        backgroundColor: tokens.colorPaletteRedBackground1,
        ':hover':{
            ...shorthands.borderColor(tokens.colorPaletteRedBorder1),
            backgroundColor: tokens.colorPaletteRedBackground2
        },
        ':hover:active': {
            ...shorthands.borderColor(tokens.colorPaletteRedBorderActive),
            backgroundColor: tokens.colorPaletteRedBackground3
        },
        '& span[class*=contentContainer]': {
            fontStyle: "italic"
        }
    },
    updated: {
        ...shorthands.borderColor(tokens.colorPaletteMarigoldBorder2),
        backgroundColor: tokens.colorPaletteMarigoldBackground1,
        ':hover':{
            ...shorthands.borderColor(tokens.colorPaletteMarigoldBorder1),
            backgroundColor: tokens.colorPaletteMarigoldBackground2
        },
        ':hover:active': {
            ...shorthands.borderColor(tokens.colorPaletteMarigoldBorderActive),
            backgroundColor: tokens.colorPaletteMarigoldBackground3
        }
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
        controlHeight,
        controlWidth,
        isRead,
        isControlDisabled,
        layout,
        files,
        trackChanges,
        pickFile,
        onChange,
        addFileLabel,
        removeFileLabel,
        downloadFileLabel,
        revertFileLabel,
        style,
        className
    } = props;

    const inputRef = React.useRef<HTMLDivElement>(null);

    const onRemove = (ev: React.FormEvent<HTMLDivElement>, selectedFile: F9FilePickerFile) => {
        if (isRead || isControlDisabled) return;
        const newFiles = files?.filter((currentFile) => {
            return currentFile.fileName !== selectedFile.fileName
        }) || [];
        
        if(trackChanges && selectedFile.state !== "added"){
            selectedFile.state = "removed";
            newFiles.push(selectedFile)
        }

        onChange?.(ev, newFiles);
    }

    const onRevert = (ev: React.FormEvent<HTMLDivElement>, selectedFile: F9FilePickerFile) => {
        if (isRead || isControlDisabled) return;
        const newFiles = files?.map((currentFile) => {
            if(currentFile.fileName === selectedFile.fileName){
                if(currentFile.previousVersion){
                    return currentFile.previousVersion
                }
                currentFile.state = "none";
            }
            return currentFile
        }) || [];
        onChange?.(ev, newFiles);
    }

    const onDownload = async (ev: React.FormEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>, file: F9FilePickerFile) => {
        if(file.fileContent){
            saveAs(`data:${file.mimeType ?? 'text/plain'};base64,${file.fileContent}`, file.fileName);
        } else if(file.url) {
            open(file.url,"_blank")
        }
    }

    const onAdd = async (ev: React.FormEvent<HTMLButtonElement>) => {
        if (isRead || isControlDisabled) return;
        const fileObjs = await pickFile();
        if (fileObjs) {
            const newFiles: F9FilePickerFile[] = fileObjs;
            if(trackChanges){
                newFiles.forEach((newFile) => {
                    const previousVersion = files?.find((oldFile) => newFile.fileName === oldFile.fileName);
                    if(previousVersion && previousVersion.fileName){
                        newFile.previousVersion = previousVersion.previousVersion ?? previousVersion;
                        newFile.state = previousVersion.state === "added" ? "added" : "updated";
                        newFile.props = previousVersion.props;
                    } else {
                        newFile.state = "added";
                    }
                });
            }
            const existingFiles = files?.filter((oldfile)=>!newFiles.find((newFile)=>newFile.fileName === oldfile.fileName));
            const updatedFiles = existingFiles ? [...existingFiles, ...newFiles] : newFiles;
            onChange?.(ev, updatedFiles);
        }

    }

    const styles = useStyles();
    const iconStyles = useIconStyles();

    const renderCompoundButton = React.useCallback((file: F9FilePickerFile, compoundButtonProps?: CompoundButtonProps) => {
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
        
        const buttonClasses = mergeClasses(
            compoundButtonProps?.className, 
            trackChanges 
                && file.state 
                && file.state !== "none" ? styles[file.state] : undefined
            )

        let secondaryContent = formatFileSize(file.fileSize);
        if(trackChanges && file.state){
            secondaryContent += ` (${file.state})`;
        }

        return <CompoundButton
            {...compoundButtonProps}
            secondaryContent={secondaryContent}
            icon={<FileTypeIcon />}
            onClick={(ev) => (file.fileContent || file.url) && onDownload(ev, file)}
            size={fieldProps.size}
            disabled={isControlDisabled}
            className={buttonClasses}
            {...((file.props ?? {} as any))}
        >
            {parsedName.baseName}
        </CompoundButton>
    }, [onDownload, fieldProps.size, isControlDisabled, trackChanges, styles]);

    const renderSplitButton = React.useCallback((file: F9FilePickerFile) => {
        const menuItems = [];
        if(!isRead && !isControlDisabled){
            switch (trackChanges && file.state) {
                case "updated":
                case "removed":
                    menuItems.push(
                        <MenuItem key="revert" onClick={(ev) => onRevert(ev, file)}>
                            {revertFileLabel ?? "Undo"}
                        </MenuItem>
                    );
                    break;
                default:
                    menuItems.push(
                        <MenuItem key="remove" onClick={(ev) => onRemove(ev, file)}>
                            {removeFileLabel ?? "Remove File"}
                        </MenuItem>
                    )
            }
        }
        if(file.fileContent || file.url){
            menuItems.push(
                <MenuItem key="download" onClick={(ev) => onDownload(ev, file)}>
                    {downloadFileLabel ?? "Download File"}
                </MenuItem>
            )
        }
        const classes = trackChanges && file.state && file.state !== "none" ? styles[file.state] : undefined;
        return <Menu>
            <MenuTrigger>
                {(triggerProps: MenuButtonProps) => (
                    <SplitButton
                        primaryActionButton={{
                            children: (_: React.ElementType, splitButtonProps: SplitButtonProps) => {
                                return renderCompoundButton(file, splitButtonProps as CompoundButtonProps)
                            }
                        }}
                        menuButton={{...triggerProps, className: mergeClasses(triggerProps.className, classes), icon: <MoreHorizontal/>}}
                        size={fieldProps.size}
                        disabled={isControlDisabled}
                    >
                    </SplitButton>
                )}
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    { menuItems }
                </MenuList>
            </MenuPopover>
        </Menu>
    },[renderCompoundButton, fieldProps.size, isControlDisabled, isRead, trackChanges]);


    const renderFileItem = React.useCallback((file: F9FilePickerFile)=>{
        if(isRead || isControlDisabled){
            return renderCompoundButton(file);
        }
        return renderSplitButton(file);
    },[isRead, isControlDisabled, renderCompoundButton, renderSplitButton]);
    
    const controlStyle = React.useMemo(()=>{
        const _style: React.CSSProperties = {};
        if(controlWidth && controlWidth !== "auto")
            _style.width = controlWidth;
        if(controlHeight && controlHeight !== "auto")
            _style.height = controlHeight;
        return _style
    },[controlWidth, controlHeight]);

    return <F9Field 
        {...fieldProps}
    >
        {
            (fieldControlProps) => {
                return (<div
                        {...fieldControlProps}
                        ref={inputRef} 
                        className={mergeClasses("fui-FilePicker", className, styles.root)} 
                        style={{...controlStyle, ...style }}
                    >
                        { 
                            files?.length 
                            ? <ul className={mergeClasses(styles.files)}>
                                {
                                    files?.filter((file) => !!file.fileName)
                                        .map((file) => renderFileItem(file))
                                }
                            </ul>
                            : undefined
                        }
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
                    </div>)
        }
    }
    </F9Field>
}