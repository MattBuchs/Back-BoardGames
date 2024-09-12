// Custom Password Validation Feature
const isValidPassword = (password) => {
    const conditions = {
        passwordLength: password.length >= 12,
        toLowercase: /[a-z]/.test(password),
        toUppercase: /[A-Z]/.test(password),
        toDigit: /\d/.test(password),
        toSpecialChar: /[!?@#$%^&*/:;,.*€$¨<>²~"[\](){}|\\-`_°+=]/.test(
            password
        ),
    };

    const isValid = Object.values(conditions).every((value) => value === true);
    return isValid;
};

export default isValidPassword;
