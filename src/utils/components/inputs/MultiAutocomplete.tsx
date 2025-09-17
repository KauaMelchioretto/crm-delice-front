import {ComponentProps, useEffect, useState} from "react";
import {TextInput} from "../core/TextInput.tsx";
import {CrmAutocomplete} from "../core/CrmAutocomplete.tsx";
import {useFormContext} from "react-hook-form";

export interface AutoCompleteOptions {
    uuid: string,
    label: string
}

interface Props extends ComponentProps<typeof TextInput> {
    options: AutoCompleteOptions[],
    name: string
}

export const MultiAutocomplete = (props: Props) => {
    const {setValue: formSetValue} = useFormContext()

    const [inputValue, setInputValue] = useState<string>('')
    const [value, setValue] = useState<AutoCompleteOptions | undefined>()

    useEffect(() => {
        formSetValue(props.name, value)
    }, [props.name, formSetValue, value]);

    return (
        <CrmAutocomplete
            multiple
            placeholder={props.placeholder}
            limitTags={2}
            getOptionLabel={(option) => (option as AutoCompleteOptions).label}
            getOptionKey={(option) => (option as AutoCompleteOptions).uuid}
            value={value}
            onChange={(_, newValue) => setValue(newValue as AutoCompleteOptions)}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            options={props.options}
            size={"sm"}
            variant={"soft"}
        />
    )
}