import HumanPersonalitySimulator from '../HumanPersonalitySimulator.mjs';

// ==========================================
// USAGE EXAMPLE (Database Integration Workflow)
// ==========================================

// Instantiating the simulated mind
const psyche = new HumanPersonalitySimulator();

// 1. Importing initial data from database
psyche.importData({
  serotonin: 15,
  dopamine: 20,
  cortisol: 85,
  memory_intensity: 90,
  affective_distance: 95,
});

// 2. Modifying values directly through setters (e.g., entity ate a good meal or took medication)
psyche.serotonin += 10;
psyche.cortisol -= 20;

// 3. Processing the final emotional state based on internal data
const mentalState = psyche.processEmotionalState();
console.log('Simulated Emotional Profile:', JSON.stringify(mentalState, null, 2));

// 4. Exporting data back to save in the database
const newDbReadings = psyche.exportData();
