class Main {
    private backendApiUrl = 'http://localhost:3000/api';
    private incubatorId = 1; // Usamos la incubadora 1 para este MVP
    private chart: Chart | null = null;

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM listo. Inicializando la aplicación (v4 - fix Chart.js).");
            this.initChart();
            this.initControls();
            this.loadInitialStates();
            this.updateDataLoop();
        });
    }

    private updateDataLoop(): void {
        const update = () => {
            this.updateSensorReadings();
            this.updateChart();
        };
        update();
        setInterval(update, 5000);
    }

    private async loadInitialStates(): Promise<void> {
        try {
            const response = await fetch(`${this.backendApiUrl}/incubators/${this.incubatorId}/devices`);
            const devices = await response.json();
            
            devices.forEach((device: any) => {
                if (device.category === 'actuator') {
                    const control = document.querySelector(`[data-device-id="${device.id}"]`) as HTMLInputElement;
                    if (!control) return;

                    switch(device.type) {
                        case 'dimmer':
                            control.value = device.state;
                            const dimmerLabel = document.getElementById('dimmer-label');
                            if (dimmerLabel) dimmerLabel.innerText = `Intensidad: ${device.state}%`;
                            break;
                        case 'heater':
                        case 'vaporizer':
                            control.checked = Boolean(device.state);
                            break;
                    }
                }
            });
        } catch(error) {
            console.error("Error al cargar estados iniciales:", error);
        }
    }

    private initControls(): void {
        const dimmerSlider = document.getElementById('dimmer-slider') as HTMLInputElement;
        const dimmerLabel = document.getElementById('dimmer-label') as HTMLElement;
        const heaterSwitch = document.getElementById('heater-switch') as HTMLInputElement;
        const vaporizerSwitch = document.getElementById('vaporizer-switch') as HTMLInputElement;

        dimmerSlider?.addEventListener('input', () => {
            if(dimmerLabel) dimmerLabel.innerText = `Intensidad: ${dimmerSlider.value}%`;
        });

        dimmerSlider?.addEventListener('change', () => this.sendActuatorCommand(dimmerSlider));
        heaterSwitch?.addEventListener('change', () => this.sendActuatorCommand(heaterSwitch));
        vaporizerSwitch?.addEventListener('change', () => this.sendActuatorCommand(vaporizerSwitch));
    }

    private async sendActuatorCommand(element: HTMLInputElement): Promise<void> {
        const deviceId = element.dataset.deviceId;
        if (!deviceId) return;

        const value = (element.type === 'checkbox') ? (element.checked ? 1 : 0) : Number(element.value);

        try {
            const url = `${this.backendApiUrl}/incubators/${this.incubatorId}/actuators/${deviceId}`;
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value })
            });
        } catch (error) {
            console.error("Fallo la comunicación con el backend:", error);
        }
    }

    private async updateSensorReadings(): Promise<void> {
        try {
            const url = `${this.backendApiUrl}/incubators/${this.incubatorId}/sensors/reading`;
            const response = await fetch(url);
            if (!response.ok) {
                this.displayErrorState();
                return;
            }
            const data = await response.json();
            const tempDisplay = document.getElementById('temp-display');
            const humDisplay = document.getElementById('hum-display');

            if (tempDisplay) tempDisplay.innerText = `${data.temperature.toFixed(1)} °C`;
            if (humDisplay) humDisplay.innerText = `${data.humidity.toFixed(1)} %`;
        } catch (error) {
            this.displayErrorState();
        }
    }
    
    private displayErrorState(): void {
        const tempDisplay = document.getElementById('temp-display');
        const humDisplay = document.getElementById('hum-display');
        if (tempDisplay) tempDisplay.innerText = `Error`;
        if (humDisplay) humDisplay.innerText = `Error`;
    }

    private initChart(): void {
        const ctx = (document.getElementById('sensorChart') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: [],
                        yAxisID: 'y-axis-temp' // ID para el eje Y de temperatura
                    },
                    {
                        label: 'Humedad (%)',
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        data: [],
                        yAxisID: 'y-axis-hum' // ID para el eje Y de humedad
                    }
                ]
            },
            options: {
                responsive: true,
                // ** AQUÍ ESTÁ EL CAMBIO **
                // Se revierte a la sintaxis de 'scales' de Chart.js v2 para coincidir con los @types instalados.
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'minute',
                             displayFormats: {
                                minute: 'HH:mm'
                            }
                        },
                        scaleLabel: { display: true, labelString: 'Tiempo' }
                    }],
                    yAxes: [
                        {
                            id: 'y-axis-temp',
                            type: 'linear',
                            position: 'left',
                            scaleLabel: { display: true, labelString: 'Temperatura (°C)' }
                        },
                        {
                            id: 'y-axis-hum',
                            type: 'linear',
                            position: 'right',
                            scaleLabel: { display: true, labelString: 'Humedad (%)' },
                            gridLines: { drawOnChartArea: false }
                        }
                    ]
                }
            }
        });
    }

    private async updateChart(): Promise<void> {
        // Se usan 'optional chaining' (?.) para evitar errores si el chart aún no está listo.
        if (!this.chart?.data?.labels || !this.chart?.data?.datasets) {
            return;
        }

        try {
            const url = `${this.backendApiUrl}/incubators/${this.incubatorId}/history`;
            const response = await fetch(url);
            const data = await response.json();

            // Actualización segura de los datos del gráfico
            this.chart.data.labels = data.map((d: any) => d.timestamp);
            this.chart.data.datasets[0].data = data.map((d: any) => d.temperature);
            this.chart.data.datasets[1].data = data.map((d: any) => d.humidity);

            this.chart.update();

        } catch (error) {
            console.error("Error al actualizar el gráfico:", error);
        }
    }
}

// Iniciar la aplicación
const main = new Main();
