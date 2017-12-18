import _generatePassword from 'password-generator';

const maxLength = 18;
const minLength = 12;
const uppercaseMinCount = 3;
const lowercaseMinCount = 3;
const numberMinCount = 2;
const specialMinCount = 2;
const UPPERCASE_RE = /([A-Z])/g;
const LOWERCASE_RE = /([a-z])/g;
const NUMBER_RE = /([\d])/g;
const SPECIAL_CHAR_RE = /([?-])/g;
const NON_REPEATING_CHAR_RE = /([\w\d?-])\1{2,}/g;

export const isStrongEnough = (password) => {
    const uc = password.match(UPPERCASE_RE);
    const lc = password.match(LOWERCASE_RE);
    const n = password.match(NUMBER_RE);
    const sc = password.match(SPECIAL_CHAR_RE);
    const nr = password.match(NON_REPEATING_CHAR_RE);
    return password.length >= minLength &&
        !nr &&
        uc && uc.length >= uppercaseMinCount &&
        lc && lc.length >= lowercaseMinCount &&
        n && n.length >= numberMinCount &&
        sc && sc.length >= specialMinCount;
};

const generatePassword = () => {
    const randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    let password = '';
    while (!isStrongEnough(password)) {
        password = _generatePassword(randomLength, false, /[\w\d?-]/);
    }
    return password;
};

export default generatePassword;
