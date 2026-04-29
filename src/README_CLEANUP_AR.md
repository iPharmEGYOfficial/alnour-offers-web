# AlNour src - Cleaned Structure

## ما تم تنظيفه
- حذف جميع ملفات النسخ الاحتياطية القديمة داخل src مثل: `.bak_*`.
- حذف ملفات Vite/React الافتراضية غير المستخدمة من `src/assets`.
- إبقاء كود الـ Bridge موجود كـ Activation لاحق، مع استمرار الوضع المحلي عبر `.env` و `runtimeConfig.js`.
- الحفاظ على نظام Local products + LocalStorage + Customer/Orders per customer.

## الملفات المحذوفة
- `src/components/account/AddressForm.jsx.bak_*`
- `src/pages/*.bak_*`
- `src/services/*.bak_*`
- `src/store/*.bak_*`
- `src/assets/react.svg`
- `src/assets/vite.svg`

## الملفات الأساسية بعد التنظيف
- `src/config/runtimeConfig.js` مسؤول عن اختيار local/bridge.
- `src/services/productService.js` مسؤول عن المنتجات من JSON/localStorage أو API عند تفعيل bridge.
- `src/services/customerService.js` مسؤول عن البحث عن العميل برقم الهاتف.
- `src/services/orderService.js` مسؤول عن حفظ الطلبات وربطها بالعميل.
- `src/store/authStore.js` مسؤول عن تسجيل الدخول.
- `src/store/accountStore.js` مسؤول عن عناوين كل عميل.
- `src/store/cartStore.js` مسؤول عن سلة كل عميل.
- `src/data/customers.json` بيانات العملاء الأولية.
- `src/services/mockProducts.json` بيانات المنتجات المحلية.

## ملاحظات المرحلة القادمة
- تحسين Admin Products UI.
- إضافة Import/Export للعملاء والمنتجات.
- نقل التخزين من localStorage إلى IndexedDB أو API في مرحلة الإنتاج الكبيرة.
