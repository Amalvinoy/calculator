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

    // Theme toggle
    const THEME_KEY = 'calc.theme';
    function applyTheme(theme){
        if (!theme){ document.documentElement.removeAttribute('data-theme'); return; }
        document.documentElement.setAttribute('data-theme', theme);
        const btn = document.querySelector('[data-action="toggle-theme"]');
        if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    function toggleTheme(){
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try{ localStorage.setItem(THEME_KEY, next); }catch{}
    }

    window.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.calculator');
        container?.addEventListener('click', onButtonClick);
        document.addEventListener('keydown', onKeyDown);

        // Theme init
        let saved = null;
        try{ saved = localStorage.getItem(THEME_KEY); }catch{}
        if (saved === 'light' || saved === 'dark') applyTheme(saved);
        const tbtn = document.querySelector('[data-action="toggle-theme"]');
        tbtn?.addEventListener('click', toggleTheme);
    });
})();

