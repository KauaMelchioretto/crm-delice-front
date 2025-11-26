import {LoaderFunctionArgs} from "react-router-dom";

export function getLoaderQuery(props: LoaderFunctionArgs){
    const url = new URL(props.request.url);
    return new URLSearchParams(url.search);
}