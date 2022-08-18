function checkUppercase(value){
    for (let i = 0; i < value.length; i++){
        if (value.charAt(i) == value.charAt(i).toUpperCase() && value.charAt(i).match(/[a-z]/i)){
            return true;
        }
    }
    return false;
};

module.exports = { checkUppercase }