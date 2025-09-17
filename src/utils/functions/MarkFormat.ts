export function maskMoney(value: number) {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return formatter.format(value);
}

export function maskDecimal(value: number) {
    const formatter = new Intl.NumberFormat("pt-BR", {
        style: "decimal",
        currency: "BRL",
    });
    return formatter.format(value);
}