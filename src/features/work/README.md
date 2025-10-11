# 🏗️ Módulo Work (Obras/Tareas)

Módulo para gestión de trabajos, tareas, lotes y reportes de obras.

## 📁 Estructura

```
work/
├── interfaces/
│   ├── work.interfaces.ts   # Interfaces TypeScript
│   └── index.ts             # Barrel export
├── services/
│   ├── work.service.ts      # Servicio principal de tareas
│   ├── image.service.ts     # Servicio de subida de imágenes
│   └── index.ts             # Barrel export
└── README.md
```

## 🔌 Endpoints Implementados

### WorkService

#### 1. Obtener Reporte de Lote
```typescript
import { WorkService } from '@/features/work/services';

const report = await WorkService.getReportByLot({
  sub: 1,
  town: 0,
  lot: 10,
  status: -1
});
```

**Endpoint:** `GET /api/work/report-lot?sub=1&town=0&lot=10&status=-1`

---

#### 2. Obtener Trabajos por Día
```typescript
const workDay = await WorkService.getWorksByDay('2025-10-05');
```

**Endpoint:** `GET /api/work/work-day?fecha=2025-10-05`

---

#### 3. Crear Nuevo Trabajo
```typescript
const newWork = await WorkService.createWork({
  LotId: 236,
  Town: 1,
  Sub: 29,
  Status: 4,
  UserRainbow: 10,
  Obs: "Tarea de prueba",
  User: 1
});
```

**Endpoint:** `POST /api/work`

---

#### 4. Actualizar Trabajo
```typescript
const updatedWork = await WorkService.updateWork({
  TaskId: 2,
  StartDate: "2025-10-04",
  EndDate: "2025-10-07",
  Completed: true,
  Obs: "Actualización de prueba",
  UserRainbow: 1,
  User: 10
});
```

**Endpoint:** `PUT /api/work`

---

#### 5. Eliminar Trabajo
```typescript
await WorkService.deleteWork({
  taskId: 1,
  userId: 1
});
```

**Endpoint:** `DELETE /api/work/:id?user=1`

---

### ImageService

#### 1. Subir Imagen Individual
```typescript
import { ImageService } from '@/features/work/services';

// Desde un input file
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validar imagen
  const validation = ImageService.validateImage(file, 5); // 5MB max
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  // Subir imagen
  const response = await ImageService.uploadImage(file);
  console.log('Image URL:', response.url);
};
```

**Endpoint:** `POST /api/uploadimg/`

---

#### 2. Subir Múltiples Imágenes
```typescript
const handleMultipleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);

  const responses = await ImageService.uploadMultipleImages(files);
  console.log('Uploaded URLs:', responses.map(r => r.url));
};
```

---

#### 3. Preview de Imagen (antes de subir)
```typescript
const handlePreview = (file: File) => {
  const previewUrl = ImageService.createPreviewURL(file);

  // Mostrar preview
  setImagePreview(previewUrl);

  // Limpiar cuando ya no se necesite
  return () => ImageService.revokePreviewURL(previewUrl);
};
```

---

## 📝 Interfaces Principales

### Work
```typescript
interface Work {
  TaskId: number;
  LotId?: number;
  Town?: number;
  Sub?: number;
  Status?: number;
  UserRainbow?: number;
  Obs?: string;
  User?: number;
  StartDate?: string;
  EndDate?: string;
  Completed?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}
```

### CreateWorkDTO
```typescript
interface CreateWorkDTO {
  LotId: number;
  Town: number;
  Sub: number;
  Status: number;
  UserRainbow: number;
  Obs: string;
  User: number;
}
```

### UpdateWorkDTO
```typescript
interface UpdateWorkDTO {
  TaskId: number;
  StartDate: string;
  EndDate: string;
  Completed: boolean;
  Obs: string;
  UserRainbow: number;
  User: number;
}
```

### WorkStatus Enum
```typescript
enum WorkStatus {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELLED = 4
}
```

---

## 🎯 Uso en Componentes

### Ejemplo: Crear Tarea
```typescript
import { useState } from 'react';
import { WorkService } from '@/features/work/services';
import type { CreateWorkDTO } from '@/features/work/interfaces';

export const CreateTaskForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateWorkDTO) => {
    setLoading(true);
    try {
      const newWork = await WorkService.createWork(data);
      console.log('Task created:', newWork);
      // Manejar éxito
    } catch (error) {
      console.error('Error creating task:', error);
      // Manejar error
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX del formulario...
  );
};
```

### Ejemplo: Subir Imagen con Preview
```typescript
import { useState } from 'react';
import { ImageService } from '@/features/work/services';

export const ImageUploader = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar
    const validation = ImageService.validateImage(file, 5);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    // Crear preview
    const previewUrl = ImageService.createPreviewURL(file);
    setPreview(previewUrl);

    // Subir
    setUploading(true);
    try {
      const response = await ImageService.uploadImage(file);
      console.log('Uploaded:', response.url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      ImageService.revokePreviewURL(previewUrl);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileSelect} />
      {preview && <img src={preview} alt="Preview" />}
      {uploading && <p>Subiendo...</p>}
    </div>
  );
};
```

---

## ⚠️ Notas Importantes

1. **Validaciones**: Todos los servicios incluyen validaciones básicas de parámetros
2. **Error Handling**: Los errores son capturados y transformados en mensajes descriptivos
3. **Logging**: Todas las operaciones registran logs detallados en consola
4. **TypeScript**: Tipado completo para mayor seguridad
5. **Formato de Fechas**: Usar formato `YYYY-MM-DD` para todas las fechas

---

## 🔄 Próximos Pasos (Opcional)

Si necesitas hooks personalizados, puedes crear:
- `useWorkReport()` - Para gestión de reportes
- `useWorkDay()` - Para trabajos por día
- `useImageUpload()` - Para subida de imágenes con estado

Estos se pueden crear en `src/features/work/hooks/` cuando sea necesario.
