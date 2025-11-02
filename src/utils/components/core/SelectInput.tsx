import {Select, Input, Option, styled} from "@mui/joy";
import {useFormContext} from "react-hook-form";
import {ComponentProps} from "react";

const SelectInput = styled(Select)(() => ({
    '--Select-radius': '5px',
    borderBottom: '3px solid',
    borderColor: '#bdbdbd',
    '&:hover': {
        borderColor: '#9e9e9e',
    },
    '&::before': {
        borderBottom: '5px solid var(--Select-focusedHighlight)',
        transform: 'scaleX(0)',
        left: 0,
        right: 0,
        bottom: '-3px',
        top: 'unset',
        transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
        borderRadius: 0,
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px"
    },
    '&:focus-within::before': {
        transform: 'scaleX(1)',
    },
    '& .MuiList-root': {
        overflowX: 'hidden',
    }
}));

export type OptionType = { value: string | null; label: string };

interface CrmSelectProps extends ComponentProps<typeof Input> {
    options: OptionType[];
    onBeforeChange?: () => void;
}

export const CrmSelect = (props: CrmSelectProps) => {
    const {watch, setValue} = useFormContext();
    const type = watch(props.name!) as string;

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <SelectInput
            {...props}
            value={type || "" || props.value!}
            onChange={(_, newValue) => {
                if (props.onBeforeChange) {
                    props.onBeforeChange();
                }
                setValue(props.name!, newValue)
            }}
        >
            {props.options.map(opt => (
                <Option key={`select_key_${opt.value}`} value={opt.value}>
                    {opt.label}
                </Option>
            ))}
        </SelectInput>
    )
}