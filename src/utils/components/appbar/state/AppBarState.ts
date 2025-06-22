import atomWithDebounce from "../../../functions/AtomWithDebounce.ts";
import {loadable} from "jotai/utils";
import {atom} from "jotai";
import {appBarRepository} from "../repository/AppBarRepository.ts";

const {
    debouncedValueAtom: SearchValueAtom
} = atomWithDebounce("", 500)

const SearchResultAtom = loadable(atom(async (get) => {
    const query = get(SearchValueAtom);

    return appBarRepository.queryMenuOptions(query);
}))

const SearchBarValueAtom = atom("")

export default {
    SearchValueAtom,
    SearchResultAtom,
    SearchBarValueAtom
}