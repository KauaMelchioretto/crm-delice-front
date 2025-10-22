export function valueToEnum<T extends Record<string, number | string>>(
    value: unknown,
    enumType: T
): T[keyof T] {
    return enumType[value as keyof T];
}