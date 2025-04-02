import {ComponentProps, useState} from "react";
import {TextInput} from "../core/TextInput.tsx";

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import {IconButton} from "@mui/joy";

export const PasswordInput = (
    props: ComponentProps<typeof TextInput>
) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <TextInput
            {...props}
            type={showPass ? "text" : "password"}
            endDecorator={
                <IconButton
                    onClick={() => setShowPass(prev => !prev)}
                    variant="plain"
                    size="sm"
                >
                    {showPass ? <VisibilityOffRoundedIcon/> : <VisibilityRoundedIcon/>}
                </IconButton>
            }
        />
    );
}