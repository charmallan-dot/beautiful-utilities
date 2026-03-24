/* ========================================
   BEAUTIFUL UTILS - Main JavaScript
   All 5 Utility Tools
   ======================================== */

// ============================================
// 1. WORLD CLOCK
// ============================================
const WorldClock = {
  timezones: [
    { name: 'New York', zone: 'America/New_York' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'Paris', zone: 'Europe/Paris' },
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'Sydney', zone: 'Australia/Sydney' },
    { name: 'Dubai', zone: 'Asia/Dubai' },
    { name: 'Singapore', zone: 'Asia/Singapore' },
    { name: 'Los Angeles', zone: 'America/Los_Angeles' }
  ],

  init() {
    this.updateClocks();
    setInterval(() => this.updateClocks(), 1000);
  },

  updateClocks() {
    const container = document.getElementById('clocks-container');
    if (!container) return;

    container.innerHTML = '';
    const now = new Date();

    this.timezones.forEach(tz => {
      const time = new Date(now.toLocaleString('en-US', { timeZone: tz.zone }));
      const timeStr = time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
      const dateStr = time.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });

      const item = document.createElement('div');
      item.className = 'timezone-item';
      item.innerHTML = `
        <div>
          <strong style="font-size: 1.2rem;">${tz.name}</strong>
          <div style="color: var(--text-secondary); font-size: 0.9rem;">${dateStr}</div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">
          ${timeStr}
        </div>
      `;
      container.appendChild(item);
    });
  },

  addTimezone() {
    const select = document.getElementById('timezone-select');
    const zone = select.value;
    const name = select.options[select.selectedIndex].text;
    
    if (!this.timezones.find(tz => tz.zone === zone)) {
      this.timezones.push({ name, zone });
      this.updateClocks();
    }
  }
};

// ============================================
// 2. CURRENCY CONVERTER
// ============================================
const CurrencyConverter = {
  rates: {},
  baseCurrency: 'USD',

  async init() {
    await this.fetchRates();
  },

  async fetchRates() {
    try {
      // Using free API - exchangerate-api.com (free tier)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      this.rates = data.rates;
      this.populateSelects();
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Fallback rates
      this.rates = {
        USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, AUD: 1.35,
        CAD: 1.25, CHF: 0.92, CNY: 6.45, INR: 74.5, MXN: 20.1,
        BRL: 5.25, ZAR: 14.8, SGD: 1.35, HKD: 7.78, NZD: 1.42
      };
      this.populateSelects();
    }
  },

  populateSelects() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    if (!fromSelect || !toSelect) return;

    const currencies = Object.keys(this.rates);
    const options = currencies.map(code => 
      `<option value="${code}">${code}</option>`
    ).join('');

    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    
    toSelect.value = 'EUR';
  },

  convert() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const resultDiv = document.getElementById('conversion-result');

    if (isNaN(amount) || !this.rates[from] || !this.rates[to]) {
      resultDiv.innerHTML = '<p style="color: var(--error-color);">Please enter a valid amount</p>';
      return;
    }

    // Convert through USD
    const inUSD = amount / this.rates[from];
    const result = inUSD * this.rates[to];

    resultDiv.innerHTML = `
      <div class="result-value">
        ${amount.toLocaleString()} ${from} = ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}
      </div>
      <p style="color: var(--text-secondary); margin-top: 0.5rem;">
        1 ${from} = ${(this.rates[to] / this.rates[from]).toFixed(4)} ${to}
      </p>
    `;
  }
};

// ============================================
// 3. MOON PHASE CALCULATOR
// ============================================
const MoonPhase = {
  init() {
    this.calculatePhase();
  },

  calculatePhase(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Conway's algorithm for moon phase
    let c = Math.floor((year / 100));
    let e = 2 - c + Math.floor(c / 4);
    let jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
    
    // Days since known new moon (Jan 6, 2000)
    const daysSinceNew = jd - 2451550.1;
    const newMoons = daysSinceNew / 29.53058867;
    let phase = newMoons - Math.floor(newMoons);
    
    if (phase < 0) phase += 1;

    this.displayPhase(phase, date);
  },

  displayPhase(phase, date) {
    const phases = [
      { name: 'New Moon', icon: '🌑', range: [0, 0.03] },
      { name: 'Waxing Crescent', icon: '🌒', range: [0.03, 0.22] },
      { name: 'First Quarter', icon: '🌓', range: [0.22, 0.28] },
      { name: 'Waxing Gibbous', icon: '🌔', range: [0.28, 0.47] },
      { name: 'Full Moon', icon: '🌕', range: [0.47, 0.53] },
      { name: 'Waning Gibbous', icon: '🌖', range: [0.53, 0.72] },
      { name: 'Last Quarter', icon: '🌗', range: [0.72, 0.78] },
      { name: 'Waning Crescent', icon: '🌘', range: [0.78, 0.97] },
      { name: 'New Moon', icon: '🌑', range: [0.97, 1] }
    ];

    const currentPhase = phases.find(p => phase >= p.range[0] && phase < p.range[1]);
    const illumination = Math.round((1 - Math.abs(0.5 - phase) * 2) * 100);

    const display = document.getElementById('moon-display');
    if (!display) return;

    display.innerHTML = `
      <div class="moon-phase-display">${currentPhase.icon}</div>
      <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${currentPhase.name}</h3>
      <p style="color: var(--text-secondary);">Illumination: ${illumination}%</p>
      <p style="color: var(--text-secondary); margin-top: 0.5rem;">
        Age: ${(phase * 29.53).toFixed(1)} days
      </p>
      <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px;">
        <p style="font-size: 0.9rem; color: var(--text-secondary);">Phase: ${(phase * 100).toFixed(1)}% through cycle</p>
      </div>
    `;
  },

  calculateForDate() {
    const dateInput = document.getElementById('moon-date').value;
    if (dateInput) {
      this.calculatePhase(new Date(dateInput));
    }
  }
};

// ============================================
// 4. SUNRISE/SUNSET CALCULATOR
// ============================================
const SunCalculator = {
  async init() {
    // Default to user's location or New York
    this.calculateSunTimes(40.7128, -74.0060, 'New York');
  },

  async calculateSunTimes(lat, lon, cityName = 'Your Location') {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    try {
      // Using free API - sunrise-sunset.org
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${dateStr}&formatted=0`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        this.displaySunTimes(data.results, cityName);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      // Fallback calculation (simplified)
      this.displaySunTimes(this.calculateApproximate(lat, lon, today), cityName);
    }
  },

  calculateApproximate(lat, lon, date) {
    // Simplified calculation for fallback
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Approximate sunrise/sunset based on latitude and day of year
    const latFactor = Math.abs(lat) / 90;
    const seasonalVar = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 2;
    
    const baseSunrise = 6 + latFactor * seasonalVar;
    const baseSunset = 18 - latFactor * seasonalVar;

    return {
      sunrise: new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(baseSunrise), (baseSunrise % 1) * 60),
      sunset: new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(baseSunset), (baseSunset % 1) * 60),
      solar_noon: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0),
      day_length: (baseSunset - baseSunrise) * 60 * 60
    };
  },

  displaySunTimes(results, cityName) {
    const display = document.getElementById('sun-times-display');
    if (!display) return;

    const sunrise = new Date(results.sunrise);
    const sunset = new Date(results.sunset);
    const solarNoon = results.solar_noon ? new Date(results.solar_noon) : null;
    const dayLength = results.day_length ? this.formatDayLength(results.day_length) : this.calculateDayLength(sunrise, sunset);

    display.innerHTML = `
      <h3 style="text-align: center; margin-bottom: 1.5rem; font-size: 1.5rem;">📍 ${cityName}</h3>
      <div class="sun-times">
        <div class="sun-item">
          <div class="sun-icon">🌅</div>
          <div style="color: var(--text-secondary);">Sunrise</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #ffaa00;">
            ${sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div class="sun-item">
          <div class="sun-icon">🌇</div>
          <div style="color: var(--text-secondary);">Sunset</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: #ff6b6b;">
            ${sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      ${solarNoon ? `
      <div class="sun-item" style="margin-top: 1rem;">
        <div class="sun-icon">☀️</div>
        <div style="color: var(--text-secondary);">Solar Noon</div>
        <div style="font-size: 1.3rem; font-weight: 700;">
          ${solarNoon.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      ` : ''}
      <div class="sun-item" style="margin-top: 1rem;">
        <div class="sun-icon">⏱️</div>
        <div style="color: var(--text-secondary);">Day Length</div>
        <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-color);">
          ${dayLength}
        </div>
      </div>
    `;
  },

  calculateDayLength(sunrise, sunset) {
    const diff = sunset - sunrise;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  },

  formatDayLength(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  },

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.calculateSunTimes(
            position.coords.latitude,
            position.coords.longitude,
            'Your Location'
          );
        },
        () => {
          // Use default if permission denied
          this.calculateSunTimes(40.7128, -74.0060, 'New York');
        }
      );
    } else {
      this.calculateSunTimes(40.7128, -74.0060, 'New York');
    }
  }
};

// ============================================
// 5. BMI CALCULATOR
// ============================================
const BMICalculator = {
  calculate() {
    const unit = document.getElementById('bmi-unit').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const heightFt = parseFloat(document.getElementById('height-ft').value) || 0;
    const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
    const heightCm = parseFloat(document.getElementById('height-cm').value) || 0;
    
    const resultDiv = document.getElementById('bmi-result');
    
    if (!weight || (!heightCm && (!heightFt || !heightIn))) {
      resultDiv.innerHTML = '<p style="color: var(--error-color);">Please enter valid weight and height</p>';
      return;
    }

    let weightKg, heightM;

    if (unit === 'metric') {
      weightKg = weight;
      heightM = heightCm / 100;
    } else {
      weightKg = weight * 0.453592;
      const totalInches = (heightFt * 12) + heightIn;
      heightM = totalInches * 0.0254;
    }

    const bmi = weightKg / (heightM * heightM);
    this.displayResult(bmi, resultDiv);
  },

  displayResult(bmi, container) {
    let category, categoryClass, advice;

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryClass = 'bmi-underweight';
      advice = 'Consider consulting a healthcare provider about healthy weight gain.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      categoryClass = 'bmi-normal';
      advice = 'Great! Maintain your healthy lifestyle with balanced diet and exercise.';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryClass = 'bmi-overweight';
      advice = 'Consider adopting healthier eating habits and regular physical activity.';
    } else {
      category = 'Obese';
      categoryClass = 'bmi-obese';
      advice = 'Consult a healthcare provider for personalized weight management advice.';
    }

    container.innerHTML = `
      <div class="bmi-result">
        <div style="font-size: 4rem; font-weight: 700; color: var(--accent-color);">
          ${bmi.toFixed(1)}
        </div>
        <div style="color: var(--text-secondary); margin-bottom: 1rem;">Your BMI</div>
        <div class="bmi-category ${categoryClass}">
          ${category}
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
          <p style="color: var(--text-secondary); font-size: 0.95rem;">${advice}</p>
        </div>
        
        <div style="margin-top: 2rem; text-align: left;">
          <h4 style="color: var(--accent-color); margin-bottom: 1rem;">BMI Categories:</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
            <div><span style="color: #00d9ff;">◉</span> Underweight: &lt; 18.5</div>
            <div><span style="color: #00ff88;">◉</span> Normal: 18.5 - 24.9</div>
            <div><span style="color: #ffaa00;">◉</span> Overweight: 25 - 29.9</div>
            <div><span style="color: #ff4466;">◉</span> Obese: ≥ 30</div>
          </div>
        </div>
      </div>
    `;
  },

  toggleUnits() {
    const unit = document.getElementById('bmi-unit').value;
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');

    if (unit === 'metric') {
      metricInputs.classList.remove('hidden');
      imperialInputs.classList.add('hidden');
    } else {
      metricInputs.classList.add('hidden');
      imperialInputs.classList.remove('hidden');
    }
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize tools based on current page
  if (document.getElementById('clocks-container')) {
    WorldClock.init();
  }
  
  if (document.getElementById('from-currency')) {
    CurrencyConverter.init();
  }
  
  if (document.getElementById('moon-display')) {
    MoonPhase.init();
  }
  
  if (document.getElementById('sun-times-display')) {
    SunCalculator.getUserLocation();
  }
  
  if (document.getElementById('bmi-result')) {
    // BMI calculator initialized on button click
  }

  // Create particles
  createParticles();
});

// ============================================
// PARTICLE EFFECTS
// ============================================
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 5 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    container.appendChild(particle);
  }
}

// ============================================
// NAVIGATION
// ============================================
function navigateTo(page) {
  window.location.href = page + '.html';
}
