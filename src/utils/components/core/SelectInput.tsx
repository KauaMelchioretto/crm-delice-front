import {Select, styled} from "@mui/joy";
import {FormControl, FormHelperText, FormLabel, Option} from "@mui/joy";
import {Controller, FieldError, useFormContext} from "react-hook-form";

const SelectInput = styled(Select)(() => ({
    '--Input-radius': '5px',
    borderBottom: '3px solid',
    borderColor: '#bdbdbd',
    '&:hover': {
        borderColor: '#9e9e9e',
    },
    '&::before': {
        borderBottom: '5px solid var(--Input-focusedHighlight)',
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

type OptionType = { value: string; label: string };

interface CrmSelectProps {
    name: string;
    label: string;
    rules?: never;
    options: OptionType[];
    error?: FieldError;
}

export const CrmSelect = (
    {
        name,
        label,
        rules,
        options,
        error
    }: CrmSelectProps
) => {
    const {control} = useFormContext()

    return (
        <FormControl error={!!error}>
            <FormLabel>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({field}) => (
                    <SelectInput
                        {...field}
                        size="md"
                        variant="soft"
                        value={field.value ?? options[0]?.value}
                        onChange={(_, newValue) => field.onChange(newValue)}
                    >
                        {options.map(opt => (
                            <Option key={opt.value} value={opt.value}>
                                {opt.label}
                            </Option>
                        ))}
                    </SelectInput>
                )}
            />
            <FormHelperText sx={{minHeight: "1rem"}}>
                {error?.message}
            </FormHelperText>
        </FormControl>
    );
};