import { FuzzySet, MamdaniInferenceSystem } from 'tiny-essentials';

/**
 * @typedef {Object} DbReadings
 * @property {number} serotonin
 * @property {number} dopamine
 * @property {number} cortisol
 * @property {number} memory_intensity
 * @property {number} affective_distance
 */

/**
 * @typedef {Object} BasicEmotions
 * @property {number} sadness
 * @property {number} happiness
 * @property {number} anger
 */

/**
 * @typedef {Object} ComplexEmotions
 * @property {number} longing
 * @property {number} depression
 */

/**
 * @typedef {Object} EmotionalState
 * @property {{ basic: BasicEmotions; complex: ComplexEmotions; }} emotionalSpectrum
 * @property {DbReadings} internalState
 * @property {string} timestamp
 */

/**
 * Advanced Human Personality and Emotion Simulation Engine
 * Uses Mamdani inference to calculate continuous emotional states.
 * @beta
 */
class HumanPersonalitySimulator {
  /** * Internal state representing the raw database readings.
   * Values are kept private to force the use of getters/setters.
   */
  #state = {
    serotonin: 50, // Default neutral state
    dopamine: 50,
    cortisol: 20,
    memory_intensity: 0,
    affective_distance: 0,
  };

  constructor() {
    /** @type {MamdaniInferenceSystem} */
    this.engine = new MamdaniInferenceSystem();
    this._initializeNeurochemicalInputs();
    this._initializeContextualInputs();
  }

  // ==========================================
  // GETTERS AND SETTERS
  // ==========================================

  /**
   * Helper to ensure values stay within the 0-100 range required by our Fuzzy Sets
   * @param {number} value
   */
  #clamp(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  get serotonin() {
    return this.#state.serotonin;
  }
  set serotonin(value) {
    this.#state.serotonin = this.#clamp(value);
  }

  get dopamine() {
    return this.#state.dopamine;
  }
  set dopamine(value) {
    this.#state.dopamine = this.#clamp(value);
  }

  get cortisol() {
    return this.#state.cortisol;
  }
  set cortisol(value) {
    this.#state.cortisol = this.#clamp(value);
  }

  get memoryIntensity() {
    return this.#state.memory_intensity;
  }
  set memoryIntensity(value) {
    this.#state.memory_intensity = this.#clamp(value);
  }

  get affectiveDistance() {
    return this.#state.affective_distance;
  }
  set affectiveDistance(value) {
    this.#state.affective_distance = this.#clamp(value);
  }

  // ==========================================
  // DATA MANAGEMENT (IMPORT / EXPORT)
  // ==========================================

  /**
   * Imports raw data from the database into the simulator's internal state.
   * Uses the setters to ensure all incoming data is validated.
   * @param {DbReadings} dbReadings - Object containing the numeric values.
   */
  importData(dbReadings) {
    if (!dbReadings) return;
    if (dbReadings.serotonin !== undefined) this.serotonin = dbReadings.serotonin;
    if (dbReadings.dopamine !== undefined) this.dopamine = dbReadings.dopamine;
    if (dbReadings.cortisol !== undefined) this.cortisol = dbReadings.cortisol;
    if (dbReadings.memory_intensity !== undefined)
      this.memoryIntensity = dbReadings.memory_intensity;
    if (dbReadings.affective_distance !== undefined)
      this.affectiveDistance = dbReadings.affective_distance;
  }

  /**
   * Exports the current internal raw state to be saved in a database.
   * @returns {DbReadings} The current state object.
   */
  exportData() {
    return {
      serotonin: this.serotonin,
      dopamine: this.dopamine,
      cortisol: this.cortisol,
      memory_intensity: this.memoryIntensity,
      affective_distance: this.affectiveDistance,
    };
  }

  // ==========================================
  // ENGINE INITIALIZATION
  // ==========================================

  _initializeNeurochemicalInputs() {
    // Serotonin (Mood regulator)
    this.engine.addVariable('serotonin', [
      new FuzzySet('Critically_Low', 0, 0, 10, 30),
      new FuzzySet('Stable', 20, 40, 60, 80),
      new FuzzySet('High', 70, 85, 100, 100),
    ]);

    // Dopamine (Reward, motivation)
    this.engine.addVariable('dopamine', [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Medium', 30, 50, 70, 80),
      new FuzzySet('High', 70, 90, 100, 100),
    ]);

    // Cortisol (Stress, alertness/threat state)
    this.engine.addVariable('cortisol', [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Moderate', 30, 50, 60, 80),
      new FuzzySet('High', 70, 90, 100, 100),
    ]);
  }

  /**
   * Defines external context variables (database triggers).
   * Values range from 0 to 100.
   */
  _initializeContextualInputs() {
    // Intensity of activated past memories (for Longing/Saudade)
    this.engine.addVariable('memory_intensity', [
      new FuzzySet('None', 0, 0, 10, 20),
      new FuzzySet('Light', 15, 30, 50, 70),
      new FuzzySet('Strong', 60, 80, 100, 100),
    ]);

    // Distance from the object of affection/situation (physical or temporal)
    this.engine.addVariable('affective_distance', [
      new FuzzySet('Close', 0, 0, 20, 40),
      new FuzzySet('Far', 50, 80, 100, 100),
    ]);
  }

  // ==========================================
  // EMOTIONAL PROCESSING
  // ==========================================

  /**
   * Core engine for calculating basic emotions.
   * Fuzzifies the crisp exact numbers into degrees of membership for linguistic sets.
   * @returns {BasicEmotions} Basic emotion degrees (0 to 1)
   */
  _calculateBasicEmotions() {
    const ser = this.engine.getVariable('serotonin');
    const dop = this.engine.getVariable('dopamine');
    const cor = this.engine.getVariable('cortisol');

    // Simulating membership calculation
    // Happiness = Avg(Serotonin Stable/High) + Avg(Dopamine High) - Cortisol High
    const happinessLevel = Math.max(
      0,
      ser[1].calculate(this.serotonin) * 0.5 +
        dop[2].calculate(this.dopamine) * 0.8 -
        cor[2].calculate(this.cortisol) * 0.5,
    );

    // Anger = Cortisol High + Dopamine High (Aggressive anger)
    const angerLevel = Math.min(
      1,
      cor[2].calculate(this.cortisol) * 0.7 + dop[2].calculate(this.dopamine) * 0.3,
    );

    // Sadness = Serotonin Critically Low + Cortisol High
    const sadnessLevel = Math.min(
      1,
      ser[0].calculate(this.serotonin) * 0.8 + cor[2].calculate(this.cortisol) * 0.4,
    );

    return {
      happiness: happinessLevel,
      anger: angerLevel,
      sadness: sadnessLevel,
    };
  }

  /**
   * Engine for calculating complex emotions using state combinations.
   * @param {BasicEmotions} basicEmotions
   * @returns {ComplexEmotions}
   */
  _calculateComplexEmotions(basicEmotions) {
    const mem = this.engine.getVariable('memory_intensity');
    const dist = this.engine.getVariable('affective_distance');

    // Longing (Saudade) = (Latent sadness) + (Strong good memory) + (Far distance)
    // Saudade is a mixture of the pain of absence and the pleasure of the memory.
    const strongMemory = mem[2].calculate(this.memoryIntensity);
    const farDistance = dist[1].calculate(this.affectiveDistance);

    const longingLevel = Math.min(
      1,
      strongMemory * 0.5 + farDistance * 0.3 + basicEmotions.sadness * 0.2,
    );

    // Clinical Depression (Simulated) = Persistent sadness + Chronically low Serotonin/Dopamine
    const lowSer = this.engine.getVariable('serotonin')[0].calculate(this.serotonin);
    const lowDop = this.engine.getVariable('dopamine')[0].calculate(this.dopamine);

    const depressionLevel = Math.min(1, lowSer * 0.6 + lowDop * 0.3 + basicEmotions.sadness * 0.1);

    return {
      longing: longingLevel,
      depression: depressionLevel,
    };
  }

  /**
   * Processes the internal state and returns the current personality/emotion profile.
   * Takes no arguments, relying entirely on the encapsulated state.
   * @returns {EmotionalState} Full emotional spectrum analysis.
   */
  processEmotionalState() {
    // 1. Validate and process basic emotions based on biology and raw stimuli
    const basicEmotions = this._calculateBasicEmotions();

    // 2. Process complex emotions based on context and basic emotions
    const complexEmotions = this._calculateComplexEmotions(basicEmotions);

    // Returns the complete emotional spectrum of the personality simulation
    return {
      timestamp: new Date().toISOString(),
      internalState: this.exportData(),
      emotionalSpectrum: {
        basic: {
          happiness: basicEmotions.happiness * 100,
          sadness: basicEmotions.sadness * 100,
          anger: basicEmotions.anger * 100,
        },
        complex: {
          longing: complexEmotions.longing * 100,
          depression: complexEmotions.depression * 100,
        },
      },
    };
  }
}

export default HumanPersonalitySimulator;
