// Gráfica de CTR
const ctx = document.getElementById('ctrChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Inicio',
        data: [4.2, 4.5, 4.1, 4.3, 4.6, 4.4, 4.7],
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0,255,204,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4
      },
      {
        label: 'Colecciones',
        data: [3.8, 3.9, 3.7, 3.6, 3.9, 4.0, 4.1],
        borderColor: '#3399ff',
        backgroundColor: 'rgba(51,153,255,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4
      },
      {
        label: 'Producto',
        data: [4.1, 4.0, 4.2, 4.3, 4.1, 4.2, 4.4],
        borderColor: '#ff66cc',
        backgroundColor: 'rgba(255,102,204,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: '#c9d1d9' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#c9d1d9' },
        grid: { color: '#30363d' }
      },
      y: {
        beginAtZero: true,
        max: 6,
        ticks: { color: '#c9d1d9' },
        grid: { color: '#30363d' }
      }
    }
  }
});

// Actualización dinámica del CTR
setInterval(() => {
  const newCTR = (Math.random() * 5).toFixed(1);
  document.getElementById('ctrValue').textContent = `${newCTR}%`;
}, 5000);

// Campañas simuladas
const campaigns = [
  {
    nombre: "Lanzamiento Verano",
    inicio: "2025-06-01",
    fin: "2025-06-30",
    ctr: "4.8%",
    clics: 1240,
    zona: "Inicio"
  },
  {
    nombre: "Descuento Flash",
    inicio: "2025-07-01",
    fin: "2025-07-05",
    ctr: "3.9%",
    clics: 860,
    zona: "Producto"
  },
  {
    nombre: "Campaña Influencers",
    inicio: "2025-07-03",
    fin: "2025-07-10",
    ctr: "5.1%",
    clics: 1420,
    zona: "Colecciones"
  }
];

const campaignContainer = document.getElementById('campaigns');
campaigns.forEach(c => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${c.nombre}</h2>
    <p><strong>Fechas:</strong> ${c.inicio} → ${c.fin}</p>
    <p><strong>CTR:</strong> ${c.ctr}</p>
    <p><strong>Clics:</strong> ${c.clics}</p>
    <p><strong>Zona más activa:</strong> ${c.zona}</p>
  `;
  campaignContainer.appendChild(card);
});

// Tiendas conectadas
fetch('/api/stores')
  .then(res => res.json())
  .then(stores => {
    const container = document.getElementById('storeList');
    container.innerHTML = '';
    stores.forEach(({ shop, accessToken, installedAt }) => {
      const tokenDisplay = accessToken ? accessToken.slice(0, 10) + '...' : 'No disponible';
      const statusColor = accessToken ? '#00ffcc' : '#c53030';
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${shop}</h2>
        <p><strong>Token:</strong> ${tokenDisplay}</p>
        <p style="color:${statusColor}; font-weight:bold;">
          ${accessToken ? '✅ Token activo' : '⚠️ Token ausente'}
        </p>
        <p><strong>Instalado:</strong> ${new Date(installedAt).toLocaleString()}</p>
      `;
      container.appendChild(card);
    });
  });

// Zonas registradas
fetch('/api/zonas')
  .then(res => {
    if (!res.ok) throw new Error('Error al obtener zonas');
    return res.json();
  })
  .then(zonas => {
    const container = document.getElementById('zonaList');
    container.innerHTML = '';
    zonas.forEach(({ tienda, zona_colonia, ciudad_estado, giro_negocio, fecha_actualizacion }) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${tienda}</h2>
        <p><strong>Zona:</strong> ${zona_colonia}</p>
        <p><strong>Ciudad:</strong> ${ciudad_estado}</p>
        <p><strong>Giro:</strong> ${giro_negocio}</p>
        <p><strong>Actualizado:</strong> ${fecha_actualizacion}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error('❌ Error al cargar zonas:', err.message);
    document.getElementById('zonaList').innerHTML = '<p style="color:#c53030;">No se pudieron cargar las zonas.</p>';
  });
