exports.stringToBoolean = ((string) => {
    let result;

    string = String(string);

    switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            result = true;
        break;

        case "false":
        case "no":
        case "0":
            result = false;
        break;

        default:
            result = false;
        break;
    }

    return result;
});
