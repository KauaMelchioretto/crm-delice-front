import { InputProps } from "@mui/joy";
import {ComponentProps, forwardRef, Ref} from "react";
import { TextInput } from "../core/TextInput";
import { IMaskInput } from "react-imask";


const CnpjMaskCustom = forwardRef<HTMLInputElement, InputProps>(function TextMaskCustom(props, ref) {
    return (
        //@ts-ignore
        <IMaskInput
            mask="**.***.***/****-**"
            definitions={{
                "*": /[0-9]/,
            }}
            inputRef={ref}
            overwrite
            {...props}
        />
    );
});

interface Props extends ComponentProps<typeof TextInput>{
    inputRef: Ref<HTMLInputElement>
}

export const CnpjInput = (props: Props) => {
    return (
        <TextInput
            {...props}
            slotProps={{
                input: {
                    component: CnpjMaskCustom,
                    ref: props.inputRef
                }
            }}
        />
    );
}