
function generatePrefixedUUID(prefix) {
    const date = new Date();
    console.log(date);
    return `${prefix}-${date.getFullYear() + date.getMonth() + date.getDay() + date.getSeconds() + date.getMilliseconds()}`;
}
module.exports = generatePrefixedUUID;