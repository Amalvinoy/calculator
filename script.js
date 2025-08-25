function display(num){
    result.value+=num
}

(() => {
    const input = () => document.getElementById('result');
    const isOperator = (ch) => /[+\-*/]/.test(ch);

    function append(token){
        const el = input();
        const t = String(token);
        // Prevent two operators in a row
        if (isOperator(t)){
            if (!el.value || isOperator(el.value.slice(-1))){
                // replace last operator instead of adding
                el.value = el.value.replace(/[+\-*/]$/, '') + t;
                return;
            }
        }
        el.value += t;
    }

    function clearAll(){ input().value = ''; }
    function backspace(){ input().value = input().value.slice(0,-1); }

    function evaluate(){
        const el = input();
        const expr = el.value;
        if (!expr) return;
        // only allow digits, operators, dots, parentheses and whitespace
        if(!/^[-+*/().\d\s]+$/.test(expr)){
            el.value = 'Error';
            return;
        }
        try{
            const out = Function('"use strict";return (' + expr + ')')();
            el.value = Number.isFinite(out) ? String(out) : 'Error';
        }catch{
            el.value = 'Error';
        }
    }

    function onButtonClick(e){
        const btn = e.target.closest('button');
        if (!btn) return;
        const val = btn.getAttribute('data-value');
        const action = btn.getAttribute('data-action');
        if (val !== null) return append(val);
        if (action === 'clear') return clearAll();
        if (action === 'backspace') return backspace();
        if (action === 'equals') return evaluate();
    }

    function onKeyDown(e){
        const k = e.key;
        if (/[0-9]/.test(k)) return append(k);
        if (/[+\-*/]/.test(k)) return append(k);
        if (k === 'Enter' || k === '=') return evaluate();
        if (k === 'Backspace') return backspace();
        if (k.toLowerCase() === 'c' && (e.ctrlKey || e.metaKey)) return clearAll();
        if (k === '.') return append('.');
        if (k === '(' || k === ')') return append(k);
    }

    window.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.calculator');
        container?.addEventListener('click', onButtonClick);
        document.addEventListener('keydown', onKeyDown);
    });
})();

