const objectExists = (object, key) => {
    if (typeof object === 'object' && object !== null && object !== undefined) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            return true;
        }
    }
    return false;
};

export default objectExists;
