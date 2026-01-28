document.addEventListener('DOMContentLoaded', function() {
    // 1. VARIABLES GLOBALES
    let fechasParaMensaje = "No seleccionadas";
    const miTelefono = "34620361948";

    // 2. INICIALIZAR CALENDARIO
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            selectable: true,
            select: function(info) {
                fechasParaMensaje = info.startStr + " al " + info.endStr;
                document.getElementById('selected-days-list').innerText = "Seleccionado: " + fechasParaMensaje;
            }
        });
        calendar.render();
    }

    // 3. LOGICA DESPLEGABLES
    const selCuidador = document.getElementById('tipo-cuidador');
    const bNinos = document.getElementById('bloque-ninos');
    const bAnimales = document.getElementById('bloque-animales');

    selCuidador.addEventListener('change', function() {
        bNinos.style.display = (this.value === 'ninos') ? 'block' : 'none';
        bAnimales.style.display = (this.value === 'animales') ? 'block' : 'none';
    });

    // 4. CARGAR MUNICIPIOS
    const selMuni = document.getElementById('municipio-inca');
    const pueblos = [
        {n:"Alaró",k:15},{n:"Alcúdia",k:25},{n:"Binissalem",k:6},{n:"Búger",k:10},
        {n:"Campanet",k:10},{n:"Consell",k:12},{n:"Costitx",k:11},{n:"Inca",k:2},
        {n:"Lloseta",k:4},{n:"Llubí",k:11},{n:"Mancor",k:5},{n:"Marratxí",k:20},
        {n:"Palma",k:30},{n:"Sa Pobla",k:10},{n:"Santa Maria",k:13},{n:"Selva",k:5},{n:"Sineu",k:12}
    ];
    let muniHTML = '<option value="">3. Elegir municipio...</option>';
    pueblos.sort((a,b)=>a.n.localeCompare(b.n)).forEach(p => {
        muniHTML += `<option value="${p.n} (${p.k}km)">${p.n} (a ${p.k} km de Inca)</option>`;
    });
    selMuni.innerHTML = muniHTML;

    // 5. FUNCIÓN WHATSAPP CORREGIDA (ÚNICA FUNCIONAL)
    document.getElementById('btn-whatsapp-final').onclick = function() {
        const valorC = selCuidador.value;
        const valorM = selMuni.value;
        const notas = document.getElementById('user-notes').value;

        if (!valorC || !valorM) {
            alert("Por favor, selecciona cuidador y municipio.");
            return;
        }

        // Obtener servicios marcados
        const bloqueActivo = (valorC === 'ninos') ? bNinos : bAnimales;
        const checks = Array.from(bloqueActivo.querySelectorAll('input:checked')).map(i => i.value);
        const servicios = checks.length > 0 ? checks.join(", ") : "General";

        // Mensaje optimizado para WhatsApp
        let texto = "📌 *RESERVA NOEMI*\n";
        texto += "*Servicio:* " + (valorC === 'ninos' ? "Niños 👶" : "Animales 🐾") + "\n";
        texto += "*Servicios:* " + servicios + "\n";
        texto += "*Municipio:* " + valorM + "\n";
        texto += "*Fechas:* " + fechasParaMensaje + "\n";
        texto += "*Notas:* " + notas + "\n";
        texto += "*Teléfono:* " + miTelefono;

        // URL corregida - formato internacional con espacios + encode completo
        const url = "https://wa.me/34+620361948?text=" + encodeURIComponent(texto);
        
        // Abrir WhatsApp en nueva pestaña
        window.open(url, '_blank');
    };
});