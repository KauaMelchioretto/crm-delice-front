export const baseURL = (): string | undefined => {
    if(process.env.NODE_ENV === "production") {
        return undefined;
    } else {
        return "http://192.168.1.7:9000/";
    }
};