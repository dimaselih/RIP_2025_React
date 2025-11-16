// Конфигурация для переключения между веб и Tauri
const target_tauri = typeof window !== 'undefined' && (window as any).__TAURI__;

export const api_proxy_addr = "http://192.168.1.211:8000";
export const img_proxy_addr = "http://192.168.1.211:9000";

export const dest_api = target_tauri ? api_proxy_addr : "";
export const dest_img = target_tauri ? img_proxy_addr : "";
export const dest_root = "";

