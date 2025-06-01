import {ComponentProps} from "react";
import {TextInput} from "../core/TextInput.tsx";

export const NumericInput = (props: ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            {...props}
            onInput={evt => {
                const input = evt.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, "");
            }}
        />
    );
};