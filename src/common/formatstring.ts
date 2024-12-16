export default function formatString(stringToFormat: string, ...replacements: Record<string, string | object | number>[]) {
    for (let v = 0; v < replacements.length; v++) {
        const values = replacements[v];
        for (const val in values) {
            let replacement = values[val];
            if (Array.isArray(replacement)) replacement = JSON.stringify(replacement);
            if (typeof(replacement) === "object" && replacement !== null) replacement = replacement.toString();
            stringToFormat = stringToFormat.replace(new RegExp(`{{${val}}}`, "g"), replacement.toString());
        }
    }
    return stringToFormat;
}