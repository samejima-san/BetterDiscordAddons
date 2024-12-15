export default function formatString(stringToFormat: string, values: Record<string, string | object | number>) {
    for (const val in values) {
        let replacement = values[val];
        if (Array.isArray(replacement)) replacement = JSON.stringify(replacement);
        if (typeof(replacement) === "object" && replacement !== null) replacement = replacement.toString();
        stringToFormat = stringToFormat.replace(new RegExp(`{{${val}}}`, "g"), replacement.toString());
    }
    return stringToFormat;
}