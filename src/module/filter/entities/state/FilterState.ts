import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { Filter } from "../entities";

const FilterListAtom = atom<Filter>();

export default {
    FilterListAtom
}