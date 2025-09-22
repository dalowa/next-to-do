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





