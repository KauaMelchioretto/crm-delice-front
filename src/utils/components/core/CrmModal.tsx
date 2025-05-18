import {Modal, ModalDialog} from "@mui/joy";
import {ComponentProps} from "react";

export const CrmModal = (props: ComponentProps<typeof Modal>) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: "blur(0px)",
            }}
        >
            <ModalDialog
                variant={"outlined"}
                size={"lg"}
                sx={{
                    p: 0,
                    maxWidth: 900,
                    border: "none"
                }}
            >
                {props.children}
            </ModalDialog>
        </Modal>
    )
}