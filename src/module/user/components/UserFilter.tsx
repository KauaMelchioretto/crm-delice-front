import FormControl from "@mui/material/FormControl";
import { CrmSelect } from "../../../utils/components/core/SelectInput.tsx";
import {
  FieldValue,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useAtom } from "jotai";
import FilterState from "../../filter/entities/state/FilterState.ts";
import { Box, Button, FormHelperText, FormLabel } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { TextInput } from "../../../utils/components/core/TextInput.tsx";
import { Search } from "@mui/icons-material";

export const UsersFilter = () => {
  const useFormMethods = useForm();
  const [filter, setFilter] = useAtom(FilterState.FilterListAtom);
  const { t } = useTranslation();

  const filterFields = [
    { value: "", label: t("filter_keys.none") },
    { value: "user", label: t("users_table.user") },
    { value: "name", label: t("users_table.name") },
    { value: "email", label: t("users_table.email") },
    { value: "document", label: t("users_table.document") },
    { value: "phone", label: t("users_table.phone") },
    { value: "state", label: t("users_table.state") },
    { value: "city", label: t("users_table.city") },
  ];

  const handleFilterSubmit = useFormMethods.handleSubmit(
    (data: FieldValues) => {
      console.log(data);
    }
  );

  return (
    <FormProvider {...useFormMethods}>
      <Box component="form" onSubmit={handleFilterSubmit}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <FormControl sx={{ width: 300 }}>
            <CrmSelect
              name="filterType"
              label={t("filter_keys.fields")}
              options={filterFields}
            />
          </FormControl>
          <FormControl sx={{ width: 700 }}>
            <FormLabel>&nbsp;</FormLabel>
            <TextInput
              {...useFormMethods.register("value")}
              size={"md"}
              variant={"soft"}
            />
            <FormHelperText sx={{ minHeight: "1rem" }}/>
          </FormControl>
          <Button type="submit" startDecorator={<Search/>}>{t("filter_keys.search")}</Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
