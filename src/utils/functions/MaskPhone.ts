export function maskPhone(v: string) {
    if (!v) {
        return ""
    }

    if (v.length === 11) {
        v = "55" + v
    }

    if(v.length === 10){
        v = "55" + v.substring(0, 2) + "9" + v.substring(2)
    }

    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{2})(\d{2})(\d)(\d{4})(\d{4})/, "+$1 ($2) $3 $4-$5")
    return v
}