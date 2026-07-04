// 1. Ve a https://console.firebase.google.com/ y crea un proyecto (gratis).
// 2. Dentro del proyecto: Build > Firestore Database > Crear base de datos (modo producción, región cercana p.ej. us-central).
// 3. Ve a Configuración del proyecto (ícono de engranaje) > "Tus apps" > agregar app Web (</>).
// 4. Copia el objeto firebaseConfig que te da Firebase y pégalo aquí abajo, reemplazando estos valores de ejemplo.
// Nota: estas llaves son públicas por diseño (no son secretas); la seguridad real la dan las Reglas de Firestore (ver firestore.rules).

export const firebaseConfig = {
  apiKey: "AIzaSyC2Armjsh-2eON0vPdj8_EHTwk64X6yxvk",
  authDomain: "bd-junglebreeze.firebaseapp.com",
  projectId: "bd-junglebreeze",
  storageBucket: "bd-junglebreeze.firebasestorage.app",
  messagingSenderId: "1013410084666",
  appId: "1:1013410084666:web:e3299c62d8b28f321b8203",
  measurementId: "G-K3ZQLZCGCC"
};
