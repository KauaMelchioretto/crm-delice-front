import {useAtomValue, useSetAtom} from "jotai";
import ProductState from "../state/ProductState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CircularProgress, IconButton} from "@mui/joy";
import {getProductStatusProps, Product} from "../entities/entities.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {EditRounded} from "@mui/icons-material";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmField, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {useTranslation} from "react-i18next";
import BurstModeRounded from "@mui/icons-material/BurstModeRounded";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";

export const ProductList = () => {
    const modifiedProduct = useSetAtom(CrmState.EntityFormUUID);
    const modifiedProductForm = useSetAtom(CrmState.FormType);
    const {t} = useTranslation();

    const productAtom = useAtomValue(ProductState.ListAtom);

    const {getRolesByModule} = useAuth();

    const roles = getRolesByModule(CrmModules.Product);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_PRODUCT || x.code === CrmDefaultRoles.ALL_PRODUCT
    ).length > 0;

    const productFields: CrmField[] = [
        {
            key: "name",
            label: t("products.fields.name"),
            filterable: true,
            sortable: true
        },
        {
            key: "code",
            label: t("products.fields.code"),
            filterable: true,
            sortable: true
        },
        {
            key: "weight",
            label: t("products.fields.weight"),
            sortable: true
        },
        {
            key: "price",
            label: t("products.fields.price"),
            sortable: true
        },
        {
            key: "status",
            label: t("products.fields.status"),
            filterable: true,
            sortable: true
        },
        {
            key: "images",
            label: t("products.fields.images")
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
    ]

    switch (productAtom.state) {
        case "hasError":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CrmError/>
                </CrmContainer>
            );
        case "loading":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CircularProgress/>
                </CrmContainer>
            );
        case "hasData":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <FilterComponent
                        fields={productFields}
                        filterAtom={ProductState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 300,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(6)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(7)": {
                                    width: 50,
                                },
                                "& td": {
                                    textWrap: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                },
                            }}
                        >
                            <CrmTableHead
                                fields={productFields}
                                orderByAtom={ProductState.OrderByAtom}
                            />
                            <tbody>
                            {productAtom.data.items?.map((product: Product) => (
                                <tr key={`product_list_key_${product.uuid}`}>
                                    <td>{product.code}</td>
                                    <td>{product.name}</td>
                                    <td>{product.weight}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <CrmCardStatus {...getProductStatusProps(product.status!.toString())}/>
                                    </td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                modifiedProduct(product?.uuid ?? "");
                                                modifiedProductForm(CrmFormType.PRODUCT_MEDIA);
                                            }}
                                        >
                                            <BurstModeRounded/>
                                        </IconButton>
                                    </td>
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedProduct(product?.uuid ?? "");
                                                    modifiedProductForm(CrmFormType.EDIT_PRODUCT);
                                                }}
                                            >
                                                <EditRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={ProductState.PageAtom}
                        count={ProductState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
};