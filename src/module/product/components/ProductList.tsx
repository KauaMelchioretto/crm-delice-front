import {useAtomValue, useSetAtom} from "jotai";
import ProductState from "../state/ProductState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {Box, CircularProgress, IconButton, Typography} from "@mui/joy";
import {Product, ProductStatus} from "../entities/entities.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {EditRounded} from "@mui/icons-material";
import {useAtom} from "jotai/index";
import {ChangeEvent} from "react";
import {CrmPagination} from "../../../utils/components/pagination/CrmPagination.tsx";
import {getColorContrast} from "../../../utils/functions/GetColorContrast.ts";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import BurstModeRounded from '@mui/icons-material/BurstModeRounded';

export const ProductList = () => {
    const modifiedProduct = useSetAtom(CrmState.EntityFormUUID)
    const modifiedProductForm = useSetAtom(CrmState.FormType)

    const productAtom = useAtomValue(ProductState.ListAtom)

    let products: Product[] = []

    const productStatus = {
        [ProductStatus.ACTIVE]: {
            color: "#118D57",
            label: "Ativo",
            icon: VerifiedRounded
        },
        [ProductStatus.INACTIVE]: {
            color: "#ff543f",
            label: "Inativo",
            icon: CancelRounded
        },
    }

    const CardStatus = ({status}: { status: string }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const s = productStatus[ProductStatus[status]]

        const colors = getColorContrast(s.color)

        const Icon = s.icon

        return (
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                <Box
                    sx={{
                        backgroundColor: colors.transparent,
                        p: 0.5,
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 0.5
                    }}
                >
                    <Icon
                        sx={{
                            color: s.color,
                            fontSize: "14pt"
                        }}
                    />
                    <Typography
                        sx={{
                            color: s.color,
                            fontWeight: "bold",
                            fontSize: "9pt",
                        }}
                    >
                        {s.label}
                    </Typography>
                </Box>
            </Box>
        )
    }

    if (productAtom.state === "loading") {
        return (
            <CrmContainer sx={{width: "100%"}}>
                <CrmTableContainer
                    sx={{
                        height: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress/>
                </CrmTableContainer>
            </CrmContainer>
        );
    }

    if (productAtom.state === "hasData") {
        products = productAtom.data.items ?? []
    }

    return (
        <CrmContainer>
            <CrmTableContainer sx={{height: 450}}>
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
                            overflow: "hidden"
                        }
                    }}
                >
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Image</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        products?.map((product: Product) => (
                            <tr key={`wallet_list_key_${product.uuid}`}>
                                <td>{product.code}</td>
                                <td>{product.name}</td>
                                <td>{product.weight}</td>
                                <td>{product.price}</td>
                                <td>
                                    <CardStatus status={product?.status ?? "ACTIVE"}/>
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
                            </tr>
                        ))
                    }
                    </tbody>
                </CrmTable>
            </CrmTableContainer>
            <ProductPagination/>
        </CrmContainer>
    )
}

export const ProductPagination = () => {
    const [page, setPage] = useAtom(ProductState.PageAtom);
    const pageCount = useAtomValue(ProductState.ListTotalCountAtom);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
    );
};