export const baseURL = (): string | undefined => {
    if(process.env.NODE_ENV === "production") {
        return undefined;
    } else {
        return "http://localhost:9000/";
    }
};