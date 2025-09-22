// ============ INTERFACES Y CLASES ============

interface ITarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  estado: 'pendiente' | 'en progreso' | 'completada';
  prioridad: 'alta' | 'media' | 'baja';
}

class Tarea implements ITarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  estado: 'pendiente' | 'en progreso' | 'completada';
  prioridad: 'alta' | 'media' | 'baja';

  constructor(
    id: number,
    titulo: string,
    descripcion: string,
    fechaLimite: Date,
    estado: 'pendiente' | 'en progreso' | 'completada',
    prioridad: 'alta' | 'media' | 'baja'
  ) {
    if (!titulo.trim()) throw new Error('El título no puede estar vacío.');
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fechaLimite);
    fechaComparar.setHours(0, 0, 0, 0);
    
    if (fechaComparar < hoy) {
      throw new Error('La fecha límite no puede ser anterior a hoy.');
    }
    
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaLimite = fechaLimite;
    this.estado = estado;
    this.prioridad = prioridad;
  }
}

// ============ SERVICIO DE TAREAS ============

let tareas: ITarea[] = [];
let nextId = 1;

async function crearTarea(
  titulo: string,
  descripcion: string,
  fechaLimite: Date,
  estado: 'pendiente' | 'en progreso' | 'completada',
  prioridad: 'alta' | 'media' | 'baja'
): Promise<ITarea> {
  const tarea = new Tarea(nextId++, titulo, descripcion, fechaLimite, estado, prioridad);
  tareas.push(tarea);
  console.log('Tarea creada:', tarea);
  return tarea;
}

async function obtenerTareas(): Promise<ITarea[]> {
  return tareas;
}

async function editarTarea(
  id: number,
  datos: Partial<Omit<ITarea, 'id'>>
): Promise<ITarea | null> {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea) return null;
  if (datos.titulo !== undefined && !datos.titulo.trim()) throw new Error('El título no puede estar vacío.');
  
  if (datos.fechaLimite !== undefined) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(datos.fechaLimite);
    fechaComparar.setHours(0, 0, 0, 0);
    
    if (fechaComparar < hoy) {
      throw new Error('La fecha límite no puede ser anterior a hoy.');
    }
  }
  
  Object.assign(tarea, datos);
  return tarea;
}

async function eliminarTarea(id: number): Promise<boolean> {
  const idx = tareas.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tareas.splice(idx, 1);
  return true;
}

async function filtrarTareas(
  filtro: { estado?: ITarea['estado']; prioridad?: ITarea['prioridad'] }
): Promise<ITarea[]> {
  return tareas.filter(t =>
    (filtro.estado ? t.estado === filtro.estado : true) &&
    (filtro.prioridad ? t.prioridad === filtro.prioridad : true)
  );
}

async function cargarTareasFakeAPI(): Promise<void> {
  try {
    const resp = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const data = await resp.json();
    console.log('Datos de API cargados:', data);
    
    for (const item of data) {
      await crearTarea(
        item.title,
        'Descripción simulada desde API',
        new Date(Date.now() + 86400000 * (Math.floor(Math.random() * 10) + 1)),
        item.completed ? 'completada' : 'pendiente',
        ['alta', 'media', 'baja'][Math.floor(Math.random() * 3)] as ITarea['prioridad']
      );
    }
  } catch (error) {
    console.error('Error al cargar datos de API:', error);
  }
}





