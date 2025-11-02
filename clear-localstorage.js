// Rode no Console do navegador para limpar chaves antigas
['prodoc-store','prodoc-v1'].forEach(k=>localStorage.removeItem(k));
console.log('Chaves antigas removidas. A atual é prodoc-store-v1');