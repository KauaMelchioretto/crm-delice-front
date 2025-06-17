import {useAtom} from "jotai";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {Avatar, Box} from "@mui/joy";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {useAuth} from "../provider/AuthProvider.tsx";
import {ChangeEvent, useRef, useState} from "react";

export const UserConfig = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType)

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>
        case CrmFormType.EDIT_MY_USER:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <UserConfigForm/>
                </CrmModal>
            )
    }
}

const UserConfigForm = () => {
    const {user} = useAuth()

    const [avatar, setAvatar] = useState(user?.avatar ?? "")
    const inputRef = useRef<HTMLInputElement | null>(null)

    const changeFileImage = (evt: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();

        if (evt?.target?.files) {
            const file = evt.target?.files[0];

            reader.readAsDataURL(file);
            reader.onload = function (event) {
                const fileBase64 = event?.target?.result;
                setAvatar(fileBase64!.toString());
            };
        }
    }

    const openFileImage = () => {
        if(inputRef.current){
            inputRef.current.click();
        }
    }

    return (
        <CrmContainer>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        position: "relative",
                        ":hover": {
                            ["& .avatar_container"]: {
                                opacity: 1
                            }
                        }
                    }}
                >
                    <Avatar
                        variant="outlined"
                        size="lg"
                        alt={user?.name[0] ?? ""}
                        src={avatar}
                        sx={{
                            height: "15rem",
                            width: "15rem"
                        }}
                    />
                    <input
                        id={"file_image_avatar"}
                        type="file"
                        onChange={(evt) => changeFileImage(evt)}
                        accept="images/*"
                        style={{display: "none"}}
                        ref={inputRef}
                    />
                    <Box
                        className={"avatar_container"}
                        sx={{
                            display: "flex",
                            opacity: 0,
                            position: "absolute",
                            top: 0,
                            backgroundColor: "#f3f3f330",
                            backdropFilter: "blur(3px)",
                            height: "15rem",
                            width: "15rem",
                            borderRadius: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "opacity 50ms linear"
                        }}
                    >
                        Change avatar
                    </Box>
                </Box>
            </Box>
        </CrmContainer>
    )
}