import { FuzzySet, MamdaniInferenceSystem } from 'tiny-essentials';

/**
 * @typedef {Object} InternalFeelingStates
 * @property {number} serotonin - Mood and well-being regulator (0-100).
 * @property {number} dopamine - Reward, motivation, and pleasure center (0-100).
 * @property {number} cortisol - Primary stress hormone (0-100).
 * @property {number} oxytocin - Bonding, empathy, and trust hormone (0-100).
 * @property {number} adrenaline - Fight-or-flight response, arousal (0-100).
 * @property {number} gaba - Primary inhibitory neurotransmitter, promotes calmness (0-100).
 * @property {number} memory_intensity - The vividness of currently active past memories (0-100).
 * @property {number} affective_distance - Physical or emotional distance from an object of affection (0-100).
 * @property {number} social_interaction - Level of recent human connection and interaction (0-100).
 * @property {number} sleep_quality - Restfulness and neuro-recovery from the last sleep cycle (0-100).
 */

/**
 * @typedef {Object} BasicEmotions
 * @property {number} sadness - Degree of sorrow or unhappiness (0-1).
 * @property {number} happiness - Degree of joy or contentment (0-1).
 * @property {number} anger - Degree of hostility or frustration (0-1).
 * @property {number} fear - Degree of threat-induced distress (0-1).
 */

/**
 * @typedef {Object} ComplexEmotions
 * @property {number} longing - Melancholic desire or nostalgia (Saudade) (0-1).
 * @property {number} depression - Persistent state of low mood and aversion to activity (0-1).
 * @property {number} love - Deep affection and attachment (0-1).
 * @property {number} anxiety - Anticipatory dread and somatic tension (0-1).
 * @property {number} burnout - State of emotional, physical, and mental exhaustion (0-1).
 */

/**
 * @typedef {Object} EmotionalState
 * @property {{ basic: BasicEmotions; complex: ComplexEmotions; }} emotionalSpectrum
 * @property {InternalFeelingStates} internalState
 * @property {string} timestamp - ISO string of the exact moment the state was processed.
 */

/**
 * Advanced Human Personality and Emotion Simulation Engine
 * Uses Mamdani inference to calculate continuous emotional states mimicking neurobiological processes.
 * @beta
 */
class HumanPersonalitySimulator {
  /** * Internal state representing the raw database readings.
   * Values are kept private to force the use of getters/setters for validation.
   * @type {InternalFeelingStates}
   */
  #state = {
    serotonin: 50,
    dopamine: 50,
    cortisol: 20,
    oxytocin: 50,
    adrenaline: 20,
    gaba: 50,
    memory_intensity: 0,
    affective_distance: 0,
    social_interaction: 50,
    sleep_quality: 50,
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
   * Helper to ensure values stay within the 0-100 range required by our Fuzzy Sets.
   * @param {number} value - The raw input value.
   * @returns {number} The clamped value between 0 and 100.
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

  get oxytocin() {
    return this.#state.oxytocin;
  }
  set oxytocin(value) {
    this.#state.oxytocin = this.#clamp(value);
  }

  get adrenaline() {
    return this.#state.adrenaline;
  }
  set adrenaline(value) {
    this.#state.adrenaline = this.#clamp(value);
  }

  get gaba() {
    return this.#state.gaba;
  }
  set gaba(value) {
    this.#state.gaba = this.#clamp(value);
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

  get socialInteraction() {
    return this.#state.social_interaction;
  }
  set socialInteraction(value) {
    this.#state.social_interaction = this.#clamp(value);
  }

  get sleepQuality() {
    return this.#state.sleep_quality;
  }
  set sleepQuality(value) {
    this.#state.sleep_quality = this.#clamp(value);
  }

  // ==========================================
  // DATA MANAGEMENT (IMPORT / EXPORT)
  // ==========================================

  /**
   * Imports raw data from the database into the simulator's internal state.
   * Uses the setters to ensure all incoming data is validated.
   * @param {Partial<InternalFeelingStates>} dbReadings - Object containing the numeric values to update.
   */
  importData(dbReadings) {
    if (!dbReadings) return;
    if (dbReadings.serotonin !== undefined) this.serotonin = dbReadings.serotonin;
    if (dbReadings.dopamine !== undefined) this.dopamine = dbReadings.dopamine;
    if (dbReadings.cortisol !== undefined) this.cortisol = dbReadings.cortisol;
    if (dbReadings.oxytocin !== undefined) this.oxytocin = dbReadings.oxytocin;
    if (dbReadings.adrenaline !== undefined) this.adrenaline = dbReadings.adrenaline;
    if (dbReadings.gaba !== undefined) this.gaba = dbReadings.gaba;
    if (dbReadings.memory_intensity !== undefined)
      this.memoryIntensity = dbReadings.memory_intensity;
    if (dbReadings.affective_distance !== undefined)
      this.affectiveDistance = dbReadings.affective_distance;
    if (dbReadings.social_interaction !== undefined)
      this.socialInteraction = dbReadings.social_interaction;
    if (dbReadings.sleep_quality !== undefined) this.sleepQuality = dbReadings.sleep_quality;
  }

  /**
   * Exports the current internal raw state to be saved in a database.
   * @returns {InternalFeelingStates} The current state object.
   */
  exportData() {
    return {
      serotonin: this.serotonin,
      dopamine: this.dopamine,
      cortisol: this.cortisol,
      oxytocin: this.oxytocin,
      adrenaline: this.adrenaline,
      gaba: this.gaba,
      memory_intensity: this.memoryIntensity,
      affective_distance: this.affectiveDistance,
      social_interaction: this.socialInteraction,
      sleep_quality: this.sleepQuality,
    };
  }

  // ==========================================
  // ENGINE INITIALIZATION
  // ==========================================

  /**
   * Defines internal biological variables (Neurotransmitters/Hormones).
   * Values range from 0 to 100.
   */
  _initializeNeurochemicalInputs() {
    // Serotonin (Mood regulator)
    this.engine.addVariable('serotonin', [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Stable', 30, 50, 70, 80),
      new FuzzySet('High', 70, 90, 100, 100),
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

    this.engine.addVariable('oxytocin', [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Moderate', 30, 50, 70, 80),
      new FuzzySet('High', 70, 90, 100, 100),
    ]);

    this.engine.addVariable('adrenaline', [
      new FuzzySet('Baseline', 0, 0, 20, 40),
      new FuzzySet('Elevated', 30, 60, 80, 90),
      new FuzzySet('Spike', 80, 95, 100, 100),
    ]);

    this.engine.addVariable('gaba', [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Optimal', 30, 60, 80, 90),
      new FuzzySet('High', 80, 95, 100, 100),
    ]);
  }

  /**
   * Defines external contextual variables and lifestyle factors.
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

    this.engine.addVariable('social_interaction', [
      new FuzzySet('Isolated', 0, 0, 20, 40),
      new FuzzySet('Connected', 30, 60, 80, 100),
    ]);

    this.engine.addVariable('sleep_quality', [
      new FuzzySet('Poor', 0, 0, 20, 40),
      new FuzzySet('Adequate', 30, 60, 80, 100),
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
    const adr = this.engine.getVariable('adrenaline');
    const gab = this.engine.getVariable('gaba');

    // Happiness: Stable/High Serotonin + High Dopamine, reduced by Cortisol.
    const happinessLevel = Math.max(
      0,
      ser[1].calculate(this.serotonin) * 0.4 +
        dop[2].calculate(this.dopamine) * 0.6 -
        cor[2].calculate(this.cortisol) * 0.4,
    );

    // Anger: High Cortisol + High Adrenaline + Low GABA (Inability to calm down).
    const angerLevel = Math.min(
      1,
      cor[2].calculate(this.cortisol) * 0.5 +
        adr[1].calculate(this.adrenaline) * 0.3 +
        gab[0].calculate(this.gaba) * 0.2,
    );

    // Sadness: Low Serotonin + High Cortisol.
    const sadnessLevel = Math.min(
      1,
      ser[0].calculate(this.serotonin) * 0.7 + cor[2].calculate(this.cortisol) * 0.3,
    );

    // Fear: Adrenaline Spike + High Cortisol, unmitigated by GABA.
    const fearLevel = Math.max(
      0,
      Math.min(
        1,
        adr[2].calculate(this.adrenaline) * 0.6 +
          cor[2].calculate(this.cortisol) * 0.4 -
          gab[2].calculate(this.gaba) * 0.5,
      ),
    );

    return {
      happiness: happinessLevel,
      anger: angerLevel,
      sadness: sadnessLevel,
      fear: fearLevel,
    };
  }

  /**
   * Engine for calculating complex emotions using state combinations and psychosocial factors.
   * @param {BasicEmotions} basicEmotions
   * @returns {ComplexEmotions} Complex emotion degrees (0 to 1)
   */
  _calculateComplexEmotions(basicEmotions) {
    const mem = this.engine.getVariable('memory_intensity');
    const dist = this.engine.getVariable('affective_distance');
    const oxy = this.engine.getVariable('oxytocin');
    const dop = this.engine.getVariable('dopamine');
    const cor = this.engine.getVariable('cortisol');
    const gab = this.engine.getVariable('gaba');
    const slp = this.engine.getVariable('sleep_quality');
    const soc = this.engine.getVariable('social_interaction');

    // Longing (Saudade): Strong memory + Far affective distance + Latent sadness.
    const strongMemory = mem[2].calculate(this.memoryIntensity);
    const farDistance = dist[1].calculate(this.affectiveDistance);
    const longingLevel = Math.min(
      1,
      strongMemory * 0.4 + farDistance * 0.4 + basicEmotions.sadness * 0.2,
    );

    // Depression: Low Serotonin + Low Dopamine + Isolation.
    const lowSer = this.engine.getVariable('serotonin')[0].calculate(this.serotonin);
    const lowDop = dop[0].calculate(this.dopamine);
    const isolated = soc[0].calculate(this.socialInteraction);
    const depressionLevel = Math.min(
      1,
      lowSer * 0.4 + lowDop * 0.3 + isolated * 0.2 + basicEmotions.sadness * 0.1,
    );

    // Love/Attachment: High Oxytocin + High Dopamine + Close Distance.
    const highOxy = oxy[2].calculate(this.oxytocin);
    const highDop = dop[2].calculate(this.dopamine);
    const closeDist = dist[0].calculate(this.affectiveDistance);
    const loveLevel = Math.min(1, highOxy * 0.5 + highDop * 0.3 + closeDist * 0.2);

    // Anxiety: High Cortisol + Low GABA + Subconscious/Basic Fear.
    const highCor = cor[2].calculate(this.cortisol);
    const lowGab = gab[0].calculate(this.gaba);
    const anxietyLevel = Math.min(1, highCor * 0.5 + lowGab * 0.3 + basicEmotions.fear * 0.2);

    // Burnout: High Stress + Poor Sleep + Low Dopamine (Lack of reward/exhaustion).
    const poorSleep = slp[0].calculate(this.sleepQuality);
    const burnoutLevel = Math.min(1, highCor * 0.4 + poorSleep * 0.4 + lowDop * 0.2);

    return {
      longing: longingLevel,
      depression: depressionLevel,
      love: loveLevel,
      anxiety: anxietyLevel,
      burnout: burnoutLevel,
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
          happiness: Number((basicEmotions.happiness * 100).toFixed(2)),
          sadness: Number((basicEmotions.sadness * 100).toFixed(2)),
          anger: Number((basicEmotions.anger * 100).toFixed(2)),
          fear: Number((basicEmotions.fear * 100).toFixed(2)),
        },
        complex: {
          longing: Number((complexEmotions.longing * 100).toFixed(2)),
          depression: Number((complexEmotions.depression * 100).toFixed(2)),
          love: Number((complexEmotions.love * 100).toFixed(2)),
          anxiety: Number((complexEmotions.anxiety * 100).toFixed(2)),
          burnout: Number((complexEmotions.burnout * 100).toFixed(2)),
        },
      },
    };
  }
}

export default HumanPersonalitySimulator;
