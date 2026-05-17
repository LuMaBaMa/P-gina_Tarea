// Datos extraídos del archivo subido
const rawData = [
    { peso: 7.2, altura: 50, velocidad: 10.3, color: "Blanco" },
    { peso: 8.5, altura: 66, velocidad: 10.3, color: "Amarillo" },
    { peso: 9.8, altura: 73, velocidad: 10.2, color: "Verde" },
    { peso: 6.5, altura: 72, velocidad: 16.4, color: "Verde" },
    { peso: 7.5, altura: 81, velocidad: 18.8, color: "Verde" },
    { peso: 10.1, altura: 73, velocidad: 19.7, color: "Verde" },
    { peso: 11, altura: 66, velocidad: 15.6, color: "Blanco" },
    { peso: 11, altura: 75, velocidad: 21.2, color: "Amarillo" },
    { peso: 11.1, altura: 70, velocidad: 22.6, color: "NA" },
    { peso: 11.2, altura: 75, velocidad: 19.9, color: "Blanco" },
    { peso: 11.3, altura: 69, velocidad: 24.2, color: "Amarillo" },
    { peso: 11.4, altura: 76, velocidad: 21, color: "Blanco" },
    { peso: 11.4, altura: 76, velocidad: 21.4, color: "Verde" },
    { peso: 11.7, altura: 69, velocidad: 21.3, color: "Verde" },
    { peso: 12, altura: 75, velocidad: "NA", color: "Amarillo" },
    { peso: 12.9, altura: 64, velocidad: 22.2, color: "Amarillo" },
    { peso: 12.9, altura: 55, velocidad: 33.8, color: "Blanco" },
    { peso: 10.3, altura: 76, velocidad: 27.4, color: "Amarillo" },
    { peso: 9.7, altura: 71, velocidad: 25.7, color: "Verde" },
    { peso: 10.8, altura: 64, velocidad: 24.9, color: "Verde" },
    { peso: 11, altura: 78, velocidad: 23.1, color: "Amarillo" },
    { peso: 10.2, altura: 70, velocidad: 31.7, color: "Amarillo" },
    { peso: 10.5, altura: 74, velocidad: 36.3, color: "Verde" },
    { peso: 6.5, altura: 72, velocidad: 38.3, color: "Verde" },
    { peso: 6.3, altura: 77, velocidad: 42.6, color: "Verde" },
    { peso: 7.3, altura: 51, velocidad: 55.4, color: "Blanco" },
    { peso: 7.5, altura: 62, velocidad: "NA", color: "Blanco" },
    { peso: 7.9, altura: 60, velocidad: 58.3, color: "Amarillo" },
    { peso: 8.2, altura: 70, velocidad: "NA", color: "Verde" }
];

// Limpiar datos: convertir NA a null para velocidad y excluir color NA del análisis cualitativo
const datosLimpios = rawData.map(item => ({
    ...item,
    velocidad: (item.velocidad === "NA" || item.velocidad === null) ? null : parseFloat(item.velocidad),
    colorValido: (item.color !== "NA" && item.color !== null) ? item.color : null
}));

// 1. Poblar tabla HTML
const tbody = document.getElementById("tabla-datos");
datosLimpios.forEach(d => {
    const row = tbody.insertRow();
    row.insertCell(0).innerText = d.peso;
    row.insertCell(1).innerText = d.altura;
    row.insertCell(2).innerText = (d.velocidad !== null) ? d.velocidad : "NA";
    row.insertCell(3).innerText = d.colorValido ? d.colorValido : "NA";
});

// Funciones de estadística: media, mediana, moda (para array numérico)
function media(arr) {
    if(arr.length === 0) return NaN;
    return arr.reduce((a,b) => a+b,0)/arr.length;
}

function mediana(arr) {
    if(arr.length === 0) return NaN;
    const sorted = [...arr].sort((a,b)=>a-b);
    const mid = Math.floor(sorted.length/2);
    if(sorted.length % 2 === 0) return (sorted[mid-1]+sorted[mid])/2;
    else return sorted[mid];
}

function moda(arr) {
    if(arr.length === 0) return "No hay datos";
    const freq = new Map();
    arr.forEach(v => freq.set(v, (freq.get(v)||0)+1));
    let maxFreq = 0;
    let modas = [];
    for(let [val, f] of freq.entries()){
        if(f > maxFreq){
            maxFreq = f;
            modas = [val];
        } else if(f === maxFreq && maxFreq > 0){
            modas.push(val);
        }
    }
    if(modas.length === 0 || maxFreq === 1) return "No hay moda única";
    return modas.join(", ");
}

// Obtener arrays numéricos sin NA
const pesos = datosLimpios.map(d=>d.peso).filter(v=>!isNaN(v));
const alturas = datosLimpios.map(d=>d.altura).filter(v=>!isNaN(v));
const velocidadesValidas = datosLimpios.map(d=>d.velocidad).filter(v=>v!==null && !isNaN(v));

const statsData = {
    Peso: { media: media(pesos), mediana: mediana(pesos), moda: moda(pesos) },
    Altura: { media: media(alturas), mediana: mediana(alturas), moda: moda(alturas) },
    Velocidad: { media: media(velocidadesValidas), mediana: mediana(velocidadesValidas), moda: moda(velocidadesValidas) }
};

const statsContainer = document.getElementById("stats-cards");
for(let [key, val] of Object.entries(statsData)){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>📐 ${key}</h3>
                      <p>📌 Media: <span class="valor">${val.media.toFixed(2)}</span></p>
                      <p>📌 Mediana: <span class="valor">${val.mediana.toFixed(2)}</span></p>
                      <p>📌 Moda: <span class="valor" style="font-size:1.2rem;">${val.moda}</span></p>`;
    statsContainer.appendChild(card);
}

// FRECUENCIAS PARA COLOR (cualitativa)
const coloresValidos = datosLimpios.map(d=>d.colorValido).filter(c=>c!==null);
const freqColor = new Map();
coloresValidos.forEach(c => freqColor.set(c, (freqColor.get(c)||0)+1));
const totalColor = coloresValidos.length;

let acum = 0;
const colorRows = [];
for(let [color, abs] of freqColor.entries()){
    const rel = abs / totalColor;
    acum += abs;
    colorRows.push({color, abs, rel: rel, acum});
}
// Ordenar alfabético para presentación
colorRows.sort((a,b)=> a.color.localeCompare(b.color));

// Llenar tabla color frecuencias
const freqColorTable = document.querySelector("#freq-color-table tbody");
colorRows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.color}</td><td>${row.abs}</td><td>${(row.rel*100).toFixed(1)}%</td><td>${row.acum}</td>`;
    freqColorTable.appendChild(tr);
});

// Gráfico Barras (absolutas)
const labelsColor = colorRows.map(r=>r.color);
const absData = colorRows.map(r=>r.abs);
const ctxBar = document.getElementById("barChart").getContext("2d");
new Chart(ctxBar, {
    type: 'bar',
    data: { labels: labelsColor, datasets: [{ label: 'Frecuencia Absoluta', data: absData, backgroundColor: ['#3b82f6','#facc15','#22c55e','#a855f7'], borderRadius: 8 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
});

// Gráfico Pastel (frecuencias relativas)
const relData = colorRows.map(r=>r.rel);
const ctxPie = document.getElementById("pieChart").getContext("2d");
new Chart(ctxPie, {
    type: 'pie',
    data: { labels: labelsColor, datasets: [{ data: relData, backgroundColor: ['#3b82f6','#facc15','#22c55e','#d946ef'] }] },
    options: { responsive: true, plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${(ctx.raw*100).toFixed(1)}%` } } } }
});

// FRECUENCIAS VELOCIDAD (numérica) con intervalos para polígono y tabla
const minVel = Math.min(...velocidadesValidas);
const maxVel = Math.max(...velocidadesValidas);
const nClasses = Math.min(6, Math.ceil(Math.sqrt(velocidadesValidas.length)));
const amplitude = (maxVel - minVel) / nClasses;
const intervals = [];
for(let i=0; i<nClasses; i++){
    const lower = minVel + i*amplitude;
    const upper = (i===nClasses-1) ? maxVel : minVel + (i+1)*amplitude;
    intervals.push({lower, upper, abs:0, marca: (lower+upper)/2 });
}
// contar frecuencias
velocidadesValidas.forEach(v => {
    for(let i=0; i<intervals.length; i++){
        if(v >= intervals[i].lower && (i===intervals.length-1 ? v<=intervals[i].upper : v<intervals[i].upper)){
            intervals[i].abs++;
            break;
        }
    }
});
const totalVel = velocidadesValidas.length;
let acumVel = 0;
const velFreqRows = [];
for(let inter of intervals){
    const rel = inter.abs / totalVel;
    acumVel += inter.abs;
    velFreqRows.push({
        intervalo: `${inter.lower.toFixed(1)} - ${inter.upper.toFixed(1)}`,
        abs: inter.abs,
        rel: rel,
        acum: acumVel,
        marca: inter.marca
    });
}

// tabla velocidad frecuencias
const freqVelTable = document.querySelector("#freq-vel-table tbody");
velFreqRows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.intervalo}</td><td>${row.abs}</td><td>${(row.rel*100).toFixed(1)}%</td><td>${row.acum}</td><td>${row.marca.toFixed(1)}</td>`;
    freqVelTable.appendChild(tr);
});

// Polígono de frecuencias (marca clase vs frecuencia absoluta)
const marcas = velFreqRows.map(r=>r.marca);
const frecAbsVel = velFreqRows.map(r=>r.abs);
const ctxPoly = document.getElementById("polygonChart").getContext("2d");
new Chart(ctxPoly, {
    type: 'line',
    data: { labels: marcas.map(m=>m.toFixed(1)), datasets: [{ label: 'Frecuencia Absoluta', data: frecAbsVel, borderColor: '#e11d48', backgroundColor: 'rgba(225,29,72,0.1)', fill: true, tension: 0.2, pointRadius: 5, pointBackgroundColor: '#be123c' }] },
    options: { responsive: true, scales: { x: { title: { display: true, text: 'Marca de clase (Velocidad m/s)' } }, y: { title: { display: true, text: 'Frecuencia' }, beginAtZero: true } }, plugins: { tooltip: { callbacks: { label: (ctx) => `Frec: ${ctx.raw}` } } } }
});