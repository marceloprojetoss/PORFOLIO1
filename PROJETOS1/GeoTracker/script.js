document.addEventListener('DOMContentLoaded', () => {
    // RELÓGIO
    setInterval(() => document.getElementById('real-clock').innerText = new Date().toLocaleTimeString(), 1000);

    // MAPA
    const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    // DADOS INICIAIS GLOBAIS
    const locations = [
        { city: 'São Paulo', lat: -23.55, lng: -46.63 }, { city: 'New York', lat: 40.71, lng: -74.00 },
        { city: 'London', lat: 51.50, lng: -0.12 }, { city: 'Tokyo', lat: 35.68, lng: 139.69 },
        { city: 'Dubai', lat: 25.20, lng: 55.27 }, { city: 'Sydney', lat: -33.86, lng: 151.20 }
    ];

    let units = JSON.parse(localStorage.getItem('geotracker_db')) || locations.map((loc, i) => ({
        id: `GT-${100 + i}`, city: loc.city, lat: loc.lat, lng: loc.lng, speed: 0, marker: null
    }));

    function updateSystem() {
        const list = document.getElementById('unitList');
        list.innerHTML = '';
        document.getElementById('unit-count').innerText = `(${units.length})`;

        units.forEach(u => {
            // Movimentação Global
            u.lat += (Math.random() - 0.5) * 0.01;
            u.lng += (Math.random() - 0.5) * 0.01;
            u.speed = Math.floor(Math.random() * 850) + 50;

            if (!u.marker) {
                u.marker = L.circleMarker([u.lat, u.lng], { color: '#22d3ee', radius: 6, fillOpacity: 0.8 }).addTo(map);
                u.marker.bindPopup(`<b>${u.id}</b><br>${u.city}`);
            } else {
                u.marker.setLatLng([u.lat, u.lng]);
            }

            const div = document.createElement('div');
            div.className = 'unit-item';
            div.innerHTML = `<h4>${u.id}</h4><p>${u.city} • ${u.speed} km/h</p>`;
            div.onclick = () => { map.flyTo([u.lat, u.lng], 10); u.marker.openPopup(); };
            list.appendChild(div);
        });

        // Telemetria (mostra o primeiro da lista)
        document.getElementById('current-speed').innerHTML = `${units[0].speed} <small>km/h</small>`;
        document.getElementById('coords').innerText = `${units[0].lat.toFixed(4)}, ${units[0].lng.toFixed(4)}`;
        
        localStorage.setItem('geotracker_db', JSON.stringify(units.map(u => ({...u, marker: null}))));
    }

    // BUSCA
    document.getElementById('geoSearch').addEventListener('input', (e) => {
        const found = units.find(u => u.id.includes(e.target.value.toUpperCase()));
        if(found) { map.flyTo([found.lat, found.lng], 10); found.marker.openPopup(); }
    });

    // ADICIONAR
    document.getElementById('addUnitBtn').addEventListener('click', () => {
        const id = prompt("ID da Unidade Global:");
        if(id) {
            units.push({ id: id.toUpperCase(), city: 'Manual Entry', lat: map.getCenter().lat, lng: map.getCenter().lng, speed: 0, marker: null });
            updateSystem();
        }
    });

    // EXPORTAR CSV
    document.getElementById('exportCSV').addEventListener('click', () => {
        let csv = "ID,Lat,Lng,Speed\n" + units.map(u => `${u.id},${u.lat},${u.lng},${u.speed}`).join("\n");
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'fleet_report.csv'; a.click();
    });

    setInterval(updateSystem, 3000);
    updateSystem();
});

// Funções para os Modais
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
}