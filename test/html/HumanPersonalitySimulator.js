import { HumanPersonalitySimulator } from './src/tools/HumanPersonalitySimulator.mjs';

// Instancia a mente simulada
const psyche = new HumanPersonalitySimulator();

// Configuração dos Inputs para gerar a UI dinamicamente
const inputConfigs = [
  { key: 'serotonin', label: 'Serotonin (Mood)' },
  { key: 'dopamine', label: 'Dopamine (Reward)' },
  { key: 'cortisol', label: 'Cortisol (Stress)' },
  { key: 'oxytocin', label: 'Oxytocin (Bonding)' },
  { key: 'adrenaline', label: 'Adrenaline (Arousal)' },
  { key: 'gaba', label: 'GABA (Calmness)' },
  { key: 'memory_intensity', label: 'Memory Intensity' },
  { key: 'affective_distance', label: 'Affective Distance' },
  { key: 'social_interaction', label: 'Social Interaction' },
  { key: 'sleep_quality', label: 'Sleep Quality' },
  { key: 'sensory_aversion', label: 'Sensory Aversion' },
  { key: 'social_comparison', label: 'Social Comparison' },
  { key: 'social_judgment', label: 'Social Judgment' },
  { key: 'goal_blockage', label: 'Goal Blockage' },
  { key: 'future_outlook', label: 'Future Outlook' },
];

// ==========================================
// UI GENERATORS
// ==========================================

function createSliders() {
  const container = document.getElementById('controls-container');
  const currentState = psyche.exportData();

  inputConfigs.forEach((config) => {
    const value = currentState[config.key] !== undefined ? currentState[config.key] : 50;

    const html = `
            <div class="input-group">
                <div class="input-header">
                    <label>${config.label}</label>
                    <span id="val_${config.key}">${value}</span>
                </div>
                <input type="range" id="slider_${config.key}" data-key="${config.key}" min="0" max="100" value="${value}">
            </div>
        `;
    container.insertAdjacentHTML('beforeend', html);
  });

  // Adiciona Event Listeners para atualizar a IA em tempo real
  document.querySelectorAll('input[type=range]').forEach((slider) => {
    slider.addEventListener('input', (e) => {
      const key = e.target.getAttribute('data-key');
      const value = Number(e.target.value);

      // Atualiza o texto visual do valor
      document.getElementById(`val_${key}`).innerText = value;

      // Injeta o dado no simulador
      psyche.importData({ [key]: value });

      // Recalcula e atualiza a interface visual de emoções
      updateEmotionsUI();
    });
  });
}

function createEmotionBars(containerId, emotionsObj) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpa antes de gerar

  Object.keys(emotionsObj).forEach((emotion) => {
    // Formata o nome (ex: "goal_blockage" para "Goal Blockage")
    const label = emotion.charAt(0).toUpperCase() + emotion.slice(1);

    const html = `
            <div class="output-group">
                <div class="output-header">
                    <span>${label}</span>
                    <span id="txt_${emotion}">0.00%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="bar_${emotion}"></div>
                </div>
            </div>
        `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

// ==========================================
// RENDER & UPDATE CYCLE
// ==========================================

function updateEmotionsUI() {
  const state = psyche.processEmotionalState();
  const allEmotions = { ...state.emotionalSpectrum.basic, ...state.emotionalSpectrum.complex };

  Object.keys(allEmotions).forEach((emotion) => {
    const value = allEmotions[emotion]; // Valor entre 0 e 100
    const barElement = document.getElementById(`bar_${emotion}`);
    const txtElement = document.getElementById(`txt_${emotion}`);

    if (barElement && txtElement) {
      barElement.style.width = `${value}%`;
      txtElement.innerText = `${value.toFixed(2)}%`;

      // Muda a cor com base na intensidade (Feedback Visual Clínico)
      barElement.className = 'progress-fill'; // Reseta classes
      if (value > 75) barElement.classList.add('fill-high');
      else if (value > 35) barElement.classList.add('fill-med');
      else barElement.classList.add('fill-low');
    }
  });
}

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  // Pega o estado inicial para gerar as barras vazias
  const initialState = psyche.processEmotionalState();

  // Constrói o HTML dinâmico
  createSliders();
  createEmotionBars('basic-emotions-container', initialState.emotionalSpectrum.basic);
  createEmotionBars('complex-emotions-container', initialState.emotionalSpectrum.complex);

  // Dispara a primeira atualização para preencher as barras
  updateEmotionsUI();
}

// Inicia o laboratório
init();
