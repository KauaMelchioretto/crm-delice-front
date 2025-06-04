import { CrmSelect } from "../core/SelectInput.tsx";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { Atom, useAtom } from "jotai";
import { Box, Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { TextInput } from "../core/TextInput.tsx";
import { Search } from "@mui/icons-material";
import { useEffect } from "react";
import { CrmFilter } from "../../entities/entities.ts";
import type { WritableAtom } from "jotai";

type Field = {
    label: string;
    value: string;
}

interface FilterProps {
    fields: Field[],
    filterAtom: Atom<CrmFilter | null>;
}

type FilterForm = {
    filterType: string;
    value: string;
};

export const FilterComponent = ({fields, filterAtom}: FilterProps) => {
  const useFormMethods = useForm<FilterForm>();
  const [filter, setFilter] = useAtom(filterAtom as WritableAtom<CrmFilter | null, [CrmFilter], void>);
  const { t } = useTranslation();

  const handleFilterSubmit = useFormMethods.handleSubmit(
    (data: FieldValues) => {
      setFilter({ field: data.filterType, value: data.value });
    }
  );

  useEffect(() => {
    if (filter) {
      useFormMethods.setValue("filterType", filter.field ?? "");
      useFormMethods.setValue("value", filter.value ?? "");
    }
  }, [filter]);

  return (
    <FormProvider {...useFormMethods}>
      <Box component="form" onSubmit={handleFilterSubmit}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Box sx={{ width: "300px", minHeight: "58px" }}>
            <CrmSelect
              name="filterType"
              label={t("filter_keys.title")}
              options={fields}
            />
          </Box>
          <Box
            sx={{
              width: "700px",
              minHeight: "58px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <TextInput
              {...useFormMethods.register("value")}
              size={"sm"}
              variant={"soft"}
              placeholder={t("filter_keys.input_placeholder")}
            />
          </Box>
          <Box
            sx={{
              minHeight: "58px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <Button type="submit" size={"sm"} startDecorator={<Search />}>
              {t("filter_keys.search")}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};
