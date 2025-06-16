// =================================================================
// Lógica del Frontend para el Panel de Control con Materialize y TypeScript (CORREGIDO)
// =================================================================



// --- Interfaces para Tipado de Datos ---
interface Device {
    id: number;
    name: string;
    description: string;
    type: 'light' | 'fan' | 'blinds' | 'tv';
    state: number;
    room: string;
    icon: string;
}

/**
 * Clase para manejar todas las interacciones con la API del backend.
 */
class DeviceAPI {
    private baseUrl: string = '/api';

    private async fetchJSON<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers },
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error en la red: ${response.status}`);
            }
            return response.status === 204 ? ({} as T) : (await response.json() as T);
        } catch (error: any) {
            M.toast({ html: `Error de API: ${error.message}` });
            throw error;
        }
    }

    getDevices = (): Promise<Device[]> => this.fetchJSON('/devices');
    createDevice = (data: Omit<Device, 'id' | 'state'>): Promise<Device> => this.fetchJSON('/devices', { method: 'POST', body: JSON.stringify(data) });
    updateDevice = (id: number, data: Partial<Omit<Device, 'id'|'state'>>): Promise<Device> => this.fetchJSON(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    updateDeviceState = (id: number, state: number): Promise<any> => this.fetchJSON(`/devices/${id}/state`, { method: 'PUT', body: JSON.stringify({ state }) });
    deleteDevice = (id: number): Promise<void> => this.fetchJSON(`/devices/${id}`, { method: 'DELETE' });
}

/**
 * Clase para manejar todas las manipulaciones del DOM.
 */
class UIManager {
    // CORRECCIÓN: Se cambian las propiedades a 'public' para que sean accesibles desde otras clases.
    public devicesList: HTMLElement = document.getElementById('devices-list')!;
    public controlsContainer: HTMLElement = document.getElementById('actuator-controls')!;
    public modalEl: HTMLElement = document.getElementById('device-modal')!;
    public modalInstance: any;
    public form: HTMLFormElement = document.getElementById('device-form') as HTMLFormElement;
    
    private modalTitle: HTMLElement = document.getElementById('modal-title')!;
    private deviceIdInput: HTMLInputElement = document.getElementById('device-id') as HTMLInputElement;

    constructor() {
        this.modalInstance = M.Modal.init(this.modalEl);
    }

    public render(devices: Device[]): void {
        this.renderDeviceList(devices);
        this.renderActuatorControls(devices);
    }
    
    private renderDeviceList(devices: Device[]): void {
        // Limpiar solo los items, no la cabecera
        this.devicesList.querySelectorAll('.collection-item').forEach(item => item.remove());

        if (devices.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'collection-item';
            emptyItem.textContent = 'No hay dispositivos. Agrega uno con el botón "+".';
            this.devicesList.appendChild(emptyItem);
        } else {
            devices.forEach(device => {
                const item = document.createElement('li');
                item.className = 'collection-item';
                item.innerHTML = `
                    <div>
                        <strong>${device.name}</strong>
                        <span class="grey-text"> - ${device.description} (${device.room})</span>
                    </div>
                    <div class="actions">
                        <a href="#!" class="edit-btn" data-id="${device.id}"><i class="material-icons">edit</i></a>
                        <a href="#!" class="delete-btn" data-id="${device.id}"><i class="material-icons">delete</i></a>
                    </div>
                `;
                this.devicesList.appendChild(item);
            });
        }
    }

    private renderActuatorControls(devices: Device[]): void {
        this.controlsContainer.innerHTML = '';
        const actuators = devices.filter(d => ['light', 'fan', 'blinds', 'tv'].includes(d.type));
        
        if (actuators.length === 0) {
            this.controlsContainer.innerHTML = `<p class="col s12 grey-text">No hay actuadores para controlar.</p>`;
            return;
        }

        actuators.forEach(device => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'col s12 m6 l4';
            let controlHtml = `<div class="card-panel actuator-control"><h5>${device.name}</h5>`;

            if (device.type === 'light' || device.type === 'blinds') {
                controlHtml += `
                    <p class="range-field">
                        <label>Intensidad</label>
                        <input type="range" class="actuator-slider" data-id="${device.id}" min="0" max="100" value="${device.state || 0}" />
                    </p>`;
            } else if (device.type === 'fan' || device.type === 'tv') {
                 controlHtml += `
                    <div class="switch">
                        <label>
                            Off
                            <input type="checkbox" class="actuator-switch" data-id="${device.id}" ${device.state ? 'checked' : ''}>
                            <span class="lever"></span>
                            On
                        </label>
                    </div>`;
            }
            controlHtml += `</div>`;
            controlDiv.innerHTML = controlHtml;
            this.controlsContainer.appendChild(controlDiv);
        });
    }

    public openModal(device: Device | null = null): void {
        this.form.reset();
        if (device) {
            this.modalTitle.textContent = 'Editar Dispositivo';
            this.deviceIdInput.value = String(device.id);
            (this.form.elements.namedItem('name') as HTMLInputElement).value = device.name;
            (this.form.elements.namedItem('description') as HTMLInputElement).value = device.description;
            (this.form.elements.namedItem('room') as HTMLInputElement).value = device.room;
            (this.form.elements.namedItem('type') as HTMLSelectElement).value = device.type;
        } else {
            this.modalTitle.textContent = 'Agregar Dispositivo';
            this.deviceIdInput.value = '';
        }
        // Actualiza los labels y selects de Materialize
        M.updateTextFields();
        M.FormSelect.init(this.form.querySelectorAll('select'));
        this.modalInstance.open();
    }

    public closeModal(): void {
        this.modalInstance.close();
    }
}

/**
 * Clase principal que orquesta la aplicación.
 */
class Main {
    private api: DeviceAPI = new DeviceAPI();
    private ui: UIManager = new UIManager();
    private devices: Device[] = [];

    public init(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeMaterializeComponents();
            this.loadAndRender();
            this.addEventListeners();
        });
    }

    private initializeMaterializeComponents(): void {
        M.Modal.init(document.querySelectorAll('.modal'));
        M.FormSelect.init(document.querySelectorAll('select'));
        M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'));
    }

    private async loadAndRender(): Promise<void> {
        try {
            this.devices = await this.api.getDevices();
            this.ui.render(this.devices);
        } catch (error) {
            console.error("No se pudieron cargar los dispositivos.", error);
        }
    }

    private addEventListeners(): void {
        // --- Event Listeners para CRUD ---
        document.getElementById('add-device-btn')!.addEventListener('click', () => this.ui.openModal());
        
        this.ui.devicesList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const editBtn = target.closest('.edit-btn');
            if (editBtn) {
                const id = parseInt(editBtn.getAttribute('data-id')!);
                const deviceToEdit = this.devices.find(d => d.id === id);
                this.ui.openModal(deviceToEdit || null);
            }
            const deleteBtn = target.closest('.delete-btn');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id')!);
                if (confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
                    this.handleDelete(id);
                }
            }
        });

        this.ui.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // --- Event Listeners para Controles de Actuadores (Delegados) ---
        const controlsContainer = this.ui.controlsContainer;
        
        controlsContainer.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.classList.contains('actuator-switch')) {
                const id = parseInt(target.dataset.id!);
                this.api.updateDeviceState(id, target.checked ? 1 : 0);
            }
        });

        controlsContainer.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.classList.contains('actuator-slider')) {
                const id = parseInt(target.dataset.id!);
                this.api.updateDeviceState(id, parseInt(target.value));
            }
        });
    }

    private async handleFormSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Esta línea ahora compilará correctamente
        const deviceData = {
            name: data.name as string,
            description: data.description as string,
            room: data.room as string,
            type: data.type as Device['type'],
            icon: (data.type as string).includes('light') ? 'lightbulb' : (data.type as string),
        };
        const id = (form.elements.namedItem('id') as HTMLInputElement).value;

        try {
            if (id) {
                await this.api.updateDevice(parseInt(id), deviceData);
                M.toast({ html: 'Dispositivo actualizado con éxito' });
            } else {
                await this.api.createDevice(deviceData);
                M.toast({ html: 'Dispositivo creado con éxito' });
            }
            this.ui.closeModal();
            this.loadAndRender();
        } catch (error) {
            // El error ya se notifica en la clase API.
        }
    }

    private async handleDelete(id: number): Promise<void> {
        try {
            await this.api.deleteDevice(id);
            M.toast({ html: 'Dispositivo eliminado' });
            this.loadAndRender();
        } catch (error) {
            // El error ya se notifica en la clase API.
        }
    }
}

// Inicializar la aplicación
const app = new Main();
app.init();
