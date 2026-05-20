# Guía de Despliegue - SAT English Practice Test

## Opción 1: GitHub Pages (Recomendada - Gratuita y Permanente)

### Paso 1: Crear una cuenta en GitHub
1. Ve a https://github.com
2. Crea una cuenta gratuita

### Paso 2: Crear un nuevo repositorio
1. Haz clic en el botón verde "New"
2. Nombre del repositorio: `sat-english-practice`
3. Selecciona "Public" (público)
4. Haz clic en "Create repository"

### Paso 3: Subir los archivos del simulacro

#### Opción A: Subir manualmente
1. Descarga el archivo `sat-practice.zip` que te proporcioné
2. Descomprímelo
3. En tu repositorio de GitHub, haz clic en "Add file" → "Upload files"
4. Arrastra todos los archivos de la carpeta `dist` (no la carpeta, solo los archivos dentro)
5. Escribe como mensaje: "Initial commit"
6. Haz clic en "Commit changes"

#### Opción B: Usar Git (para usuarios avanzados)
```bash
git clone https://github.com/TU_USUARIO/sat-english-practice.git
cd sat-english-practice
# Copia los archivos de la carpeta dist aquí
git add .
git commit -m "Initial commit"
git push origin main
```

### Paso 4: Configurar GitHub Pages
1. En tu repositorio, ve a "Settings" (pestaña superior)
2. En el menú lateral izquierdo, haz clic en "Pages"
3. En "Source", selecciona "Deploy from a branch"
4. En "Branch", selecciona "main" y carpeta "/ (root)"
5. Haz clic en "Save"

### Paso 5: Obtener tu URL permanente
- Espera 2-5 minutos
- Tu URL será: `https://TU_USUARIO.github.io/sat-english-practice`
- Aparecerá en la misma página de Settings → Pages

---

## Opción 2: Netlify (También Gratuito)

1. Ve a https://netlify.com
2. Crea una cuenta gratuita
3. Arrastra la carpeta `dist` directamente en la página
4. Obtendrás una URL como: `https://sat-practice-123456.netlify.app`

---

## Configuración de Google Sheets

### Paso 1: Crear la hoja de cálculo
1. Ve a https://sheets.google.com
2. Crea una nueva hoja en blanco
3. En la fila 1, escribe estos encabezados:
   - A1: Timestamp
   - B1: Student Name
   - C1: Module 1 Score
   - D1: Module 2 Score
   - E1: Total Score
   - F1: SAT Score
   - G1: Estimated Range
   - H1: P1
   - I1: P2
   - ... (continúa hasta P54 en la columna BE)

### Paso 2: Configurar Google Apps Script
1. En tu hoja de Google Sheets, ve a **Extensiones** → **Apps Script**
2. Borra el código por defecto y pega el siguiente:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var studentName = e.parameter.studentName || 'Unknown';
    var module1Score = e.parameter.module1Score || '0/27';
    var module2Score = e.parameter.module2Score || '0/27';
    var totalScore = e.parameter.totalScore || '0/54';
    var satScore = e.parameter.satScore || '200';
    var estimatedRange = e.parameter.estimatedRange || '200-800';
    
    var timestamp = new Date();
    var row = [timestamp, studentName, module1Score, module2Score, totalScore, satScore, estimatedRange];
    
    for (var i = 1; i <= 54; i++) {
      var answer = e.parameter['P' + i] || '';
      row.push(answer);
    }
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'active'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Guarda el proyecto (Ctrl+S o Cmd+S)
4. Haz clic en **Desplegar** → **Nuevo despliegue**
5. Tipo: **Aplicación web**
6. Ejecutar como: **Yo**
7. Acceso: **Cualquiera**
8. Haz clic en **Desplegar**
9. Copia la URL que aparece (será algo como: `https://script.google.com/macros/s/XXXX/exec`)

### Paso 3: Actualizar el simulacro con tu URL

**IMPORTANTE:** El simulacro que subiste a GitHub/Netlify necesita saber dónde enviar los datos.

1. Abre el archivo `index.html` de tu repositorio
2. Busca la línea que dice `const GOOGLE_SHEETS_URL = '...'`
3. Reemplaza la URL con la tuya (la que copiaste del paso anterior)
4. Guarda los cambios

---

## Compartir con otros profesores

Para que otro profesor use el simulacro con SU propia cuenta de Google:

1. **Dale el link de tu simulacro** (ej: `https://tucuenta.github.io/sat-english-practice`)
2. **Dile que siga los pasos de "Configuración de Google Sheets"** (Paso 1, 2 y 3)
3. **Cada profesor tendrá sus propios datos** en su hoja de Google Sheets

---

## Resumen de URLs

| Servicio | URL de ejemplo | Costo | Permanente |
|----------|---------------|-------|------------|
| GitHub Pages | `https://usuario.github.io/sat-english-practice` | Gratis | ✅ Sí |
| Netlify | `https://sat-practice-123456.netlify.app` | Gratis | ✅ Sí |
| Vercel | `https://sat-practice.vercel.app` | Gratis | ✅ Sí |

---

## ¿Necesitas ayuda?

Si tienes problemas, verifica:
1. Que los archivos estén en la carpeta raíz (no en subcarpetas)
2. Que el archivo `index.html` exista
3. Que la URL de Google Apps Script esté correctamente copiada
