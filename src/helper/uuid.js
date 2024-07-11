
function generatePrefixedUUID(prefix) {
    const date = new Date();
    console.log(date);
    return `${prefix}-${date.toString()}`;
}
module.exports = generatePrefixedUUID;