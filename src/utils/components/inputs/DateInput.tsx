import {TextInput} from "../core/TextInput";
import {ComponentProps} from "react";

export const DateInput = (props: ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            {...props}
            type={"date"}
        />
    );
};