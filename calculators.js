// Unit Conversion Data
const unitConversions = {
    length: {
        units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
        factors: {
            mm: 1,
            cm: 10,
            m: 1000,
            km: 1000000,
            in: 25.4,
            ft: 304.8,
            yd: 914.4,
            mi: 1609344
        }
    },
    area: {
        units: ['mm²', 'cm²', 'm²', 'ha', 'km²', 'in²', 'ft²', 'ac'],
        factors: {
            'mm²': 1,
            'cm²': 100,
            'm²': 1000000,
            ha: 10000000000,
            'km²': 1000000000000,
            'in²': 645.16,
            'ft²': 92903.04,
            ac: 4046856422.4
        }
    },
    volume: {
        units: ['mm³', 'cm³', 'm³', 'l', 'in³', 'ft³', 'yd³', 'gal'],
        factors: {
            'mm³': 1,
            'cm³': 1000,
            'm³': 1e+9,
            l: 1000000,
            'in³': 16387.1,
            'ft³': 28316800,
            'yd³': 764555000,
            gal: 3785410
        }
    },
    pressure: {
        units: ['Pa', 'kPa', 'MPa', 'psi', 'ksi', 'bar'],
        factors: {
            Pa: 1,
            kPa: 1000,
            MPa: 1000000,
            psi: 6894.76,
            ksi: 6894760,
            bar: 100000
        }
    },
    force: {
        units: ['N', 'kN', 'kgf', 'lbf'],
        factors: {
            N: 1,
            kN: 1000,
            kgf: 9.80665,
            lbf: 4.44822
        }
    }
};

// Initialize Unit Converter
function updateUnitOptions() {
    const category = document.getElementById('convCategory').value;
    const fromSelect = document.getElementById('convFrom');
    const toSelect = document.getElementById('convTo');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    unitConversions[category].units.forEach(unit => {
        fromSelect.options.add(new Option(unit, unit));
        toSelect.options.add(new Option(unit, unit));
    });
}

// Initialize on load
updateUnitOptions();

// Concrete Mix Calculator
document.getElementById('mixRatio').addEventListener('change', function() {
    document.getElementById('customRatio').style.display = 
        this.value === 'custom' ? 'block' : 'none';
});

function calculateConcreteMix() {
    const volume = parseFloat(document.getElementById('concreteVolume').value);
    const volumeUnit = document.getElementById('volumeUnit').value;
    let ratio = document.getElementById('mixRatio').value;
    
    if (ratio === 'custom') {
        ratio = document.getElementById('customMix').value;
    }
    
    // Convert volume to cubic meters
    let volumeM3 = volume;
    switch(volumeUnit) {
        case 'yd3': volumeM3 *= 0.764555; break;
        case 'ft3': volumeM3 *= 0.0283168; break;
    }
    
    const [c, s, a] = ratio.split(':').map(Number);
    const total = c + s + a;
    
    const cement = (volumeM3 * c / total) * 1440; // kg/m³
    const sand = (volumeM3 * s / total) * 1600;   // kg/m³
    const aggregate = (volumeM3 * a / total) * 1500; // kg/m³
    
    document.getElementById('concrete-result').innerHTML = `
        Cement: ${cement.toFixed(2)} kg<br>
        Sand: ${sand.toFixed(2)} kg<br>
        Aggregate: ${aggregate.toFixed(2)} kg
    `;
}

// Unit Converter
function convertUnits() {
    const category = document.getElementById('convCategory').value;
    const value = parseFloat(document.getElementById('convValue').value);
    const from = document.getElementById('convFrom').value;
    const to = document.getElementById('convTo').value;

    const factorFrom = unitConversions[category].factors[from];
    const factorTo = unitConversions[category].factors[to];
    const result = value * factorFrom / factorTo;

    document.getElementById('unit-result').innerHTML = 
        `${value} ${from} = ${result.toFixed(4)} ${to}`;
}

// Slope Calculator
function calculateSlope() {
    const rise = parseFloat(document.getElementById('slopeRise').value);
    const run = parseFloat(document.getElementById('slopeRun').value);
    const riseUnit = document.getElementById('riseUnit').value;
    const runUnit = document.getElementById('runUnit').value;

    // Convert to meters
    const riseM = riseUnit === 'ft' ? rise * 0.3048 : rise;
    const runM = runUnit === 'ft' ? run * 0.3048 : run;

    const slope = (riseM / runM) * 100;
    const angle = Math.atan(riseM / runM) * (180 / Math.PI);
    
    document.getElementById('slope-result').innerHTML = `
        Slope: ${slope.toFixed(2)}%<br>
        Angle: ${angle.toFixed(2)}°
    `;
}

// Footing Design
function calculateFooting() {
    const load = parseFloat(document.getElementById('footingLoad').value);
    const capacity = parseFloat(document.getElementById('soilCap').value);
    const loadUnit = document.getElementById('loadUnit').value;
    const capacityUnit = document.getElementById('capacityUnit').value;

    // Convert to metric
    let loadKN = load;
    if(loadUnit === 'ton') loadKN *= 9.80665;
    
    let capacityKPa = capacity;
    if(capacityUnit === 'tsf') capacityKPa *= 95.7605;

    const area = loadKN / capacityKPa;
    const side = Math.sqrt(area);
    
    document.getElementById('footing-result').innerHTML = `
        Area: ${area.toFixed(2)} m²<br>
        Min. Square: ${side.toFixed(2)} m × ${side.toFixed(2)} m
    `;
}

// Steel Weight Calculator
function updateSteelInputs() {
    const shape = document.getElementById('steelShape').value;
    document.getElementById('rebarInputs').style.display = 
        shape === 'rebar' ? 'block' : 'none';
    document.getElementById('plateInputs').style.display = 
        shape === 'plate' ? 'block' : 'none';
}

function calculateSteelWeight() {
    const shape = document.getElementById('steelShape').value;
    let weight = 0;
    
    if (shape === 'rebar') {
        const dia = parseFloat(document.getElementById('barDia').value);
        const diaUnit = document.getElementById('diaUnit').value;
        const length = parseFloat(document.getElementById('barLength').value);
        const lengthUnit = document.getElementById('lengthUnit').value;
        
        // Convert to metric
        const diaMM = diaUnit === 'in' ? dia * 25.4 : dia;
        const lengthM = lengthUnit === 'ft' ? length * 0.3048 : length;
        
        weight = (diaMM ** 2 / 162) * lengthM;
    }
    else if (shape === 'plate') {
        const thickness = parseFloat(document.getElementById('plateThickness').value);
        const thicknessUnit = document.getElementById('thicknessUnit').value;
        const width = parseFloat(document.getElementById('plateWidth').value);
        const widthUnit = document.getElementById('widthUnit').value;
        const length = parseFloat(document.getElementById('plateLength').value);
        const lengthUnit = document.getElementById('plateLengthUnit').value;
        
        // Convert to metric
        const thickMM = thicknessUnit === 'in' ? thickness * 25.4 : thickness;
        const widthMM = widthUnit === 'in' ? width * 25.4 : width;
        const lengthM = lengthUnit === 'ft' ? length * 0.3048 : length;
        
        weight = (thickMM * widthMM * lengthM * 7.85) / 1000000;
    }
    
    document.getElementById('steel-result').innerHTML = `
        Weight: ${weight.toFixed(2)} kg<br>
        (${(weight * 2.20462).toFixed(2)} lbs)
    `;
}

// Earthwork Calculator
function calculateEarthwork() {
    const method = document.getElementById('earthMethod').value;
    const A1 = parseFloat(document.getElementById('area1').value);
    const A2 = parseFloat(document.getElementById('area2').value);
    const L = parseFloat(document.getElementById('earthDist').value);
    const areaUnit = document.getElementById('areaUnit').value;
    const distUnit = document.getElementById('distanceUnit').value;

    // Convert to metric
    const conversionFactor = areaUnit === 'ft2' ? 0.092903 : 1;
    const A1m = A1 * conversionFactor;
    const A2m = A2 * conversionFactor;
    const Lm = distUnit === 'ft' ? L * 0.3048 : L;

    let volume = 0;
    if(method === 'avg') {
        volume = ((A1m + A2m) / 2) * Lm;
    } else {
        volume = (A1m + A2m + Math.sqrt(A1m * A2m)) * Lm / 3;
    }
    
    document.getElementById('earthwork-result').innerHTML = `
        Volume: ${volume.toFixed(2)} m³<br>
        (${(volume * 1.30795).toFixed(2)} yd³)
    `;
}

// Bending Moment Calculator
function calculateBendingMoment() {
    const loadType = document.getElementById('loadType').value;
    const magnitude = parseFloat(document.getElementById('udl').value);
    const span = parseFloat(document.getElementById('bmSpan').value);
    const loadUnit = document.getElementById('loadUnitBM').value;
    const spanUnit = document.getElementById('spanUnitBM').value;

    // Convert to metric
    let wKNm = magnitude;
    if(loadUnit === 'lb/ft') wKNm *= 0.0145939;
    const spanM = spanUnit === 'ft' ? span * 0.3048 : span;

    let BM = 0;
    if(loadType === 'udl') {
        BM = (wKNm * spanM ** 2) / 8;
    } else {
        BM = (wKNm * spanM) / 4;
    }
    
    document.getElementById('bm-result').innerHTML = `
        Max BM: ${BM.toFixed(2)} kN·m<br>
        (${(BM * 737.562).toFixed(2)} lb-ft)
    `;
}

// Column Load Calculator
function calculateColumnLoad() {
    const grade = parseFloat(document.getElementById('concreteGrade').value);
    const width = parseFloat(document.getElementById('colWidth').value);
    const height = parseFloat(document.getElementById('colHeight').value);

    const area = (width * height) / 1e6; // mm² to m²
    const capacity = 0.85 * grade * 1000 * area;
    
    document.getElementById('column-result').innerHTML = `
        Axial Capacity: ${capacity.toFixed(2)} kN
    `;
}

// Section Properties Calculator
function calculateSection() {
    const shape = document.getElementById('sectionShape').value;
    let I, Z;

    if(shape === 'rect') {
        const b = parseFloat(document.getElementById('secWidth').value) / 1000;
        const h = parseFloat(document.getElementById('secHeight').value) / 1000;
        I = (b * h ** 3) / 12;
        Z = (b * h ** 2) / 6;
    } else {
        const d = parseFloat(document.getElementById('secDiameter').value) / 1000;
        I = (Math.PI * d ** 4) / 64;
        Z = (Math.PI * d ** 3) / 32;
    }
    
    document.getElementById('section-result').innerHTML = `
        I = ${I.toExponential(2)} m⁴<br>
        Z = ${Z.toExponential(2)} m³
    `;
}

// Unit Weight Converter
function convertUnitWeight() {
    const material = document.getElementById('materialType').value;
    const value = parseFloat(document.getElementById('unitWtVal').value);
    const from = document.getElementById('unitWtFrom').value;
    const to = document.getElementById('unitWtTo').value;

    const materialDensity = {
        steel: { 'kg/m3': 7850, 'lb/ft3': 490 },
        concrete: { 'kg/m3': 2400, 'lb/ft3': 150 },
        soil: { 'kg/m3': 1800, 'lb/ft3': 112 }
    };

    const result = value * materialDensity[material][from] / materialDensity[material][to];
    
    document.getElementById('unitwt-result').innerHTML = `
        ${value} ${from} = ${result.toFixed(2)} ${to}
    `;
}

// Utility function
function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = `<span class="error">${message}</span>`;
}