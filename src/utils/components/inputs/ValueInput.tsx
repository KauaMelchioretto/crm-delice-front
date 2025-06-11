import {ComponentProps, forwardRef} from "react";
import {TextInput} from "../core/TextInput.tsx";
import {InputProps} from "@mui/joy";
import {IMaskInput} from "react-imask";

const ValueMaskInput = forwardRef<HTMLInputElement, InputProps>(function MoneyMaskCustom(props, ref) {
    return (
        //@ts-ignore
        <IMaskInput
            mask={Number}
            inputRef={ref}
            radix=","
            thousandsSeparator="."
            scale={2}
            padFractionalZeros
            normalizeZeros
            min={0}
            max={999999999}
            lazy={false}
            overwrite
            {...props}
        />
    );
});

export const ValueInput = (props: ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            {...props}
            slotProps={{
                input: {
                    component: ValueMaskInput
                }
            }}
        />
    );
};