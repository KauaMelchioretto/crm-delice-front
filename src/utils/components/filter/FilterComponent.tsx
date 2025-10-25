import {NewCrmSelect, OptionType} from "../core/SelectInput.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {useAtom} from "jotai";
import {Box, Button, FormControl, FormLabel} from "@mui/joy";
import {useTranslation} from "react-i18next";
import {TextInput} from "../core/TextInput.tsx";
import {Search} from "@mui/icons-material";
import {Fragment, memo, useEffect, useMemo} from "react";
import {CrmFieldType, CrmFilter} from "../../entities/entities.ts";
import type {WritableAtom} from "jotai";
import {CrmField} from "../../entities/entities.ts";
import {DateInput} from "../inputs/DateInput.tsx";

interface FilterProps {
    fields: CrmField[];
    filterAtom: WritableAtom<CrmFilter | null, [CrmFilter], void>
}

type FilterForm = {
    filterType: string;
    value: string;
};

export const FilterComponent = memo((props: FilterProps) => {
    const {t} = useTranslation();

    const useFormMethods = useForm<FilterForm>({
        defaultValues: {
            filterType: "allFields"
        }
    });
    const [filter, setFilter] = useAtom(props.filterAtom);

    const {watch, setValue, handleSubmit, register} = useFormMethods

    const selectedFilterType = watch("filterType");

    const selectedField = useMemo(
        () => props.fields.find((f) => f.key === selectedFilterType),
        [props.fields, selectedFilterType]
    );

    const handleFilterSubmit = handleSubmit(
        (data: FieldValues) => {
            setFilter({field: data.filterType, value: data.value});
        }
    );

    useEffect(() => {
        if (filter) {
            setValue("filterType", filter.field ?? "");
            setValue("value", filter.value ?? "");
        }
    }, [filter]);


    const filterOptions: OptionType[] = props.fields.filter(op => op.filterable).map(op => ({
        value: op.key,
        label: op.label
    }))

    return (
        <FormProvider {...useFormMethods}>
            <Box component="form" onSubmit={handleFilterSubmit}>
                <Box display={"flex"} alignItems={"end"} gap={2}>
                    <FormControl>
                        <FormLabel>{t("filter_keys.title")}</FormLabel>
                        <NewCrmSelect
                            {...register("filterType")}
                            onBeforeChange={() => {
                                setValue("value", "")
                            }}
                            size={"sm"}
                            variant={"soft"}
                            sx={{width: "250px"}}
                            options={
                                [
                                    {
                                        value: "allFields",
                                        label: t("filter_keys.none")
                                    },
                                    ...filterOptions
                                ]
                            }
                        />
                    </FormControl>
                    {
                        selectedField?.filterOptions ? (
                            <NewCrmSelect
                                {...register("value")}
                                size={"sm"}
                                variant={"soft"}
                                sx={{flex: 1}}
                                options={selectedField.filterOptions}
                            />
                        ) : (
                            <Fragment>
                                {
                                    selectedField?.filterType === CrmFieldType.Date ? (
                                        <DateInput
                                            {...register("value")}
                                            size={"sm"}
                                            variant={"soft"}
                                            sx={{flex: 1}}
                                            placeholder={t("filter_keys.input_placeholder")}
                                        />
                                    ) : (
                                        <TextInput
                                            {...register("value")}
                                            size={"sm"}
                                            variant={"soft"}
                                            sx={{flex: 1}}
                                            placeholder={t("filter_keys.input_placeholder")}
                                        />
                                    )
                                }
                            </Fragment>

                        )
                    }
                    <Button type="submit" size={"sm"} startDecorator={<Search/>}>
                        {t("filter_keys.search")}
                    </Button>
                </Box>
            </Box>
        </FormProvider>
    );
});
