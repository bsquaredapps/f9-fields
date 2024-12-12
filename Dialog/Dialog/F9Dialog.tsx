import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogActionsProps,
    DialogBody,
    DialogContent,
    DialogProps, 
    DialogSurface, 
    DialogTitle, 
    DialogTrigger, 
    makeStyles, 
    mergeClasses
} from '@fluentui/react-components';
import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';


export interface F9DialogAction extends Pick<ButtonProps, "appearance"> {
    key: string;
    text?: string;
    props?: ButtonProps;
    __recordId: string;
}

export const F9DialogActionDefaultColumns = [
    { name: "Key", displayName: "Key", dataType: "string" },
    { name: "Text", displayName: "Text", dataType: "string" },
    { name: "Appearance", displayName: "Appearance", dataType: "string" },
    { name: "Props", displayName: "Props", dataType: "object" }
]

export interface F9DialogProps extends Omit<DialogProps, "children"> {
    title?: string;
    content?: string;
    actions?: F9DialogAction[];
    actionsPosition: IInputs["ActionsPosition"]["raw"],
    onSelectAction?: (action: F9DialogAction) => void
}

const renderSlotAsHtml = (sanitizedHtml?: string, El: React.ElementType = "div") => {
    return sanitizedHtml ? <El dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /> : undefined
}

const useStyles = makeStyles({
    inset: {
        width: "calc(100% * 2 / 3)"
    },
    center: {
        justifySelf: "center"
    }
})

export const F9Dialog: React.FunctionComponent<F9DialogProps> = (props) => {
    const {
        title,
        content,
        actionsPosition,
        modalType,
        open,
        onSelectAction,
        onOpenChange
    } = props;

    const titleSlot = React.useMemo(() => renderSlotAsHtml(title), [title]);
    const contentSlot = React.useMemo(() => renderSlotAsHtml(content), [content]);
    const actions = React.useMemo(() => {

        return props.actions?.map((action) => (
            <DialogTrigger action="close" key={action.key}>
                <Button appearance={action.appearance} onClick={() => { onSelectAction?.(action) }}>
                    {action.text}
                </Button>
            </DialogTrigger>
        ))
    }, [props.actions]);

    const styles = useStyles();
    const actionsProps = React.useMemo<DialogActionsProps>(() => ({
        fluid: !actionsPosition?.includes('offset') || undefined,
        className: mergeClasses(
            actionsPosition?.includes('center') && styles.center,
            actionsPosition?.includes('inset') && styles.inset
        ),
        position: actionsPosition?.includes('left') ? "start" : "end"
    }), [actionsPosition, styles]);

    return <Dialog
        open={open}
        onOpenChange={onOpenChange}
        modalType={modalType}
    >
        <DialogSurface>
            <DialogBody>
                <DialogTitle>{titleSlot}</DialogTitle>
                <DialogContent>{contentSlot}</DialogContent>
                <DialogActions position="end"/* {...actionsProps} */>{actions}</DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
}