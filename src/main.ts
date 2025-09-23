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


// ============ FUNCIONES DE UI ============

function formatFecha(date: Date): string {
  return date.toISOString().split('T')[0];
}

async function renderTareas(tareas: ITarea[]) {
  const tbody = document.getElementById('tbody-tareas')!;
  tbody.innerHTML = '';
  
  console.log('Renderizando tareas:', tareas);
  
  if (tareas.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="7" class="text-center p-8 text-gray-400">
        <div class="flex flex-col items-center space-y-3">
          <i class="fas fa-clipboard-list text-4xl text-gray-500"></i>
          <p class="text-lg">No hay tareas disponibles</p>
          <p class="text-sm">Agrega una nueva tarea para comenzar</p>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }
  
  for (const [index, tarea] of tareas.entries()) {
    const tr = document.createElement('tr');
    tr.className = `hover:bg-white hover:bg-opacity-5 transition-all duration-200 ${
      index % 2 === 0 ? 'bg-black bg-opacity-10' : 'bg-transparent'
    }`;
    
    // Iconos y colores para estado
    const estadoConfig = {
      'pendiente': { icon: '📋', color: 'bg-gray-600 text-white' },
      'en progreso': { icon: '⚡', color: 'bg-yellow-600 text-white' },
      'completada': { icon: '✅', color: 'bg-green-600 text-white' }
    };
    
    // Iconos y colores para prioridad
    const prioridadConfig = {
      'alta': { icon: '🔴', color: 'bg-red-600 text-white' },
      'media': { icon: '🟡', color: 'bg-yellow-600 text-white' },
      'baja': { icon: '🟢', color: 'bg-green-600 text-white' }
    };
    
    const estadoInfo = estadoConfig[tarea.estado];
    const prioridadInfo = prioridadConfig[tarea.prioridad];
    
    tr.innerHTML = `
      <td class="p-4 text-gray-300 font-mono">#${tarea.id.toString().padStart(3, '0')}</td>
      <td class="p-4">
        <div class="font-semibold text-white">${tarea.titulo}</div>
      </td>
      <td class="p-4">
        <div class="text-gray-300 text-sm max-w-xs truncate" title="${tarea.descripcion}">
          ${tarea.descripcion}
        </div>
      </td>
      <td class="p-4">
        <div class="text-gray-300 text-sm">
          <i class="fas fa-calendar-alt mr-1"></i>
          ${formatFecha(new Date(tarea.fechaLimite))}
        </div>
      </td>
      <td class="p-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${estadoInfo.color}">
          <span class="mr-1">${estadoInfo.icon}</span>
          ${tarea.estado}
        </span>
      </td>
      <td class="p-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${prioridadInfo.color}">
          <span class="mr-1">${prioridadInfo.icon}</span>
          ${tarea.prioridad}
        </span>
      </td>
      <td class="p-4">
        <div class="flex space-x-2">
          <button class="btn-editar bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1" data-id="${tarea.id}">
            <i class="fas fa-edit"></i>
            <span>Editar</span>
          </button>
          <button class="btn-eliminar bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1" data-id="${tarea.id}">
            <i class="fas fa-trash"></i>
            <span>Eliminar</span>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
  
  // Asignar eventos a los botones
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', onEditarTarea);
  });
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', onEliminarTarea);
  });
}

async function onFormSubmit(e: Event) {
  console.log('📝 Creando nueva tarea...');
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const titulo = (form.titulo as HTMLInputElement).value;
  const descripcion = (form.descripcion as HTMLInputElement).value;
  const fechaLimite = new Date((form.fechaLimite as HTMLInputElement).value);
  const estado = (form.estado as HTMLSelectElement).value as ITarea['estado'];
  const prioridad = (form.prioridad as HTMLSelectElement).value as ITarea['prioridad'];
  
  console.log('📊 Datos del formulario:', { titulo, descripcion, fechaLimite, estado, prioridad });
  
  try {
    await crearTarea(titulo, descripcion, fechaLimite, estado, prioridad);
    console.log('✅ Nueva tarea creada exitosamente');
    await actualizarLista();
    form.reset();
    
    // Pequeña animación visual
    const submitButton = form.querySelector('button[type="submit"]') as HTMLElement;
    if (submitButton) {
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-check"></i><span>¡Agregada!</span>';
      submitButton.className = submitButton.className.replace('bg-white text-black', 'bg-green-500 text-white');
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.className = submitButton.className.replace('bg-green-500 text-white', 'bg-white text-black');
      }, 2000);
    }
  } catch (err: any) {
    console.error('❌ Error al crear tarea:', err);
    alert('❌ Error: ' + err.message);
  }
}

async function onEditarTarea(e: Event) {
  const id = Number((e.target as HTMLElement).closest('button')?.getAttribute('data-id'));
  const tarea = (await obtenerTareas()).find(t => t.id === id);
  if (!tarea) return;
  
  // Crear un modal-like usando confirm y prompt con mejor UX
  const nuevoTitulo = prompt('✏ Editar Título:\n\nIngresa el nuevo título para la tarea:', tarea.titulo);
  if (nuevoTitulo === null) return;
  
  const nuevaDescripcion = prompt('📝 Editar Descripción:\n\nIngresa la nueva descripción:', tarea.descripcion);
  if (nuevaDescripcion === null) return;
  
  const nuevaFecha = prompt('📅 Editar Fecha Límite:\n\nIngresa la nueva fecha (YYYY-MM-DD):', formatFecha(new Date(tarea.fechaLimite)));
  if (nuevaFecha === null) return;
  
  const estadoOpciones = '\n📋 pendiente\n⚡ en progreso\n✅ completada';
  const nuevoEstado = prompt('📊 Editar Estado:\n\nSelecciona uno de los siguientes:' + estadoOpciones + '\n\nIngresa el estado:', tarea.estado);
  if (nuevoEstado === null) return;
  
  const prioridadOpciones = '\n🔴 alta\n🟡 media\n🟢 baja';
  const nuevaPrioridad = prompt('⚡ Editar Prioridad:\n\nSelecciona una de las siguientes:' + prioridadOpciones + '\n\nIngresa la prioridad:', tarea.prioridad);
  if (nuevaPrioridad === null) return;
  
  try {
    await editarTarea(id, {
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
      fechaLimite: new Date(nuevaFecha),
      estado: nuevoEstado as ITarea['estado'],
      prioridad: nuevaPrioridad as ITarea['prioridad']
    });
    console.log('✅ Tarea editada exitosamente');
    await actualizarLista();
  } catch (err: any) {
    console.error('❌ Error al editar tarea:', err);
    alert('❌ Error: ' + err.message);
  }
}

async function onEliminarTarea(e: Event) {
  const id = Number((e.target as HTMLElement).closest('button')?.getAttribute('data-id'));
  const tarea = (await obtenerTareas()).find(t => t.id === id);
  if (!tarea) return;
  
  if (confirm(`🗑 ¿Eliminar tarea?\n\n"${tarea.titulo}"\n\nEsta acción no se puede deshacer.`)) {
    try {
      await eliminarTarea(id);
      console.log('🗑 Tarea eliminada exitosamente');
      await actualizarLista();
    } catch (error) {
      console.error('❌ Error al eliminar tarea:', error);
    }
  }
}

async function onFiltrar(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const estado = (form.filtrarEstado as HTMLSelectElement).value as ITarea['estado'] | '';
  const prioridad = (form.filtrarPrioridad as HTMLSelectElement).value as ITarea['prioridad'] | '';
  const tareasFiltradas = await filtrarTareas({
    estado: estado || undefined,
    prioridad: prioridad || undefined
  });
  await renderTareas(tareasFiltradas);
}

async function actualizarLista() {
  const todasLasTareas = await obtenerTareas();
  await renderTareas(todasLasTareas);
}


