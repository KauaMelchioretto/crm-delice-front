import {atom} from "jotai";
import {ProductFormType} from "../entities/entities.ts";

const FormType = atom<ProductFormType>(ProductFormType.EMPTY)

export default {
    FormType
}