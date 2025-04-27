import { InputProps } from "@mui/joy";
import { ComponentProps, forwardRef } from "react";
import { TextInput } from "../core/TextInput";
import { IMaskInput } from "react-imask";


const PhoneMaskCustom = forwardRef<HTMLInputElement, InputProps>(function TextMaskCustom(props, ref) {
    return (
        //@ts-ignore
        <IMaskInput
            mask="+55 (**) 9 ****-****"
            definitions={{
                "*": /[0-9]/,
            }}
            inputRef={ref}
            overwrite
            {...props}
        />
    );
});

export const PhoneInput = (props: ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            {...props}
            slotProps={{
                input: {
                    component: PhoneMaskCustom
                }
            }}
        />
    );
}