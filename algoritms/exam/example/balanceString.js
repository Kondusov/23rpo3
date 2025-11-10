function isBalanced(str) {
     let count = 0;
     for(let char of str) {
        if (char === '(') count++;
        else if (char === ')') count--;
        if (count < 0) return false;
        return count === 0;
    }
}
     console.log(isBalanced("текст в (скобках)"));
     console.log(isBalanced("текст в"));
     console.log(isBalanced("текст в ( скобках"));
     console.log(isBalanced("текст вне ) скобкок("));