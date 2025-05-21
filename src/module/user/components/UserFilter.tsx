import FormControl from "@mui/material/FormControl";
import { CrmSelect } from "../../../utils/components/core/SelectInput.tsx";
import {
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useAtom } from "jotai";
import { Box, Button, FormHelperText, FormLabel } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { TextInput } from "../../../utils/components/core/TextInput.tsx";
import { Search } from "@mui/icons-material";
import UserState from "../state/UserState.ts";
import { memo, useEffect } from "react";

export const UsersFilter = memo(() => {
  const useFormMethods = useForm();
  const [filter, setFilter] = useAtom(UserState.UserFilterAtom);
  const { t } = useTranslation();

  const filterFields = [
    { value: "", label: t("filter_keys.none") },
    { value: "login", label: t("users.fields.user") },
    { value: "name", label: t("users.fields.name") },
    { value: "email", label: t("users.fields.email") },
    { value: "document", label: t("users.fields.document") },
    { value: "phone", label: t("users.fields.phone") },
    { value: "state", label: t("users.fields.state") },
    { value: "city", label: t("users.fields.city") },
  ];

  const handleFilterSubmit = useFormMethods.handleSubmit(
    (data: FieldValues) => {
      setFilter({ field: data.filterType, value: data.value });
    }
  );

  useEffect(() => {
    if(filter) {
      useFormMethods.setValue("filterType", filter.field);
      useFormMethods.setValue("value", filter.value);
    }
  }, [filter])

  return (
    <FormProvider {...useFormMethods}>
      <Box component="form" onSubmit={handleFilterSubmit}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <FormControl sx={{ width: 300 }}>
            <CrmSelect
              name="filterType"
              label={t("filter_keys.title")}
              options={filterFields}
            />
          </FormControl>
          <FormControl sx={{ width: 700 }}>
            <FormLabel>&nbsp;</FormLabel>
            <TextInput
              {...useFormMethods.register("value")}
              size={"md"}
              variant={"soft"}
              placeholder={t("filter_keys.input_placeholder")}
            />
            <FormHelperText sx={{ minHeight: "1rem" }} />
          </FormControl>
          <Button type="submit" sx={{mt: 1}} startDecorator={<Search />}>
            {t("filter_keys.search")}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
});
