import {atom} from "jotai";
import {CrmFormType} from "../entities/entities.ts";

const FormType = atom(CrmFormType.EMPTY)
const EntityFormUUID = atom("")

export default {
    FormType,
    EntityFormUUID
}