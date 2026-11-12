/** Chave do localStorage onde o tema escolhido fica salvo ("light" | "dark"). Sem valor = segue o sistema. */
export const THEME_STORAGE_KEY = "sapiens-theme";

/**
 * Roda no <head>, ANTES da primeira pintura (sem "flash" do tema errado).
 * 1) Se a pessoa já escolheu um tema no botão sol/lua, vale a escolha.
 * 2) Senão, segue o sistema operacional (prefers-color-scheme) e acompanha se ele mudar.
 */
export const themeScript = `(function(){var k=${JSON.stringify(THEME_STORAGE_KEY)},d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function s(){var t=null;try{t=localStorage.getItem(k)}catch(e){}return t}function a(){var t=s();d.classList.toggle("dark",t?t==="dark":m.matches)}a();try{m.addEventListener("change",a)}catch(e){}})();`;
