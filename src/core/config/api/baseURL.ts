export const baseURL = (): string | undefined => {
    if(process.env.NODE_ENV === "production") {
        return undefined;
    } else {
        return "http://172.16.145.130:9000/";
    }
};