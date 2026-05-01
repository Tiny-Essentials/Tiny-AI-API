import {
  FuzzySet,
  MamdaniInferenceSystem,
} from '../tiny-modules/libs/TinyMamdaniInferenceSystem.mjs';

/**
 * @typedef {Object} InternalFeelingStates
 * @property {number} mindfulness - Conscious capacity to remain present, observe emotions without judgment, and self-regulate (0-100).
 * @property {number} unprocessed_trauma - Somatic and psychological load of unresolved past traumatic events (0-100).
 * @property {number} existential_meaning - Sense of purpose, meaning in life, and spiritual/philosophical grounding (0-100).
 * @property {number} ego_ideal - The internalized image of perfect achievement and self-worth (0-100).
 * @property {number} narcissistic_supply - Current level of external validation, admiration, and attention received (0-100).
 * @property {number} somatic_tension - Physical toll of unprocessed psychological stress, leading to fatigue (0-100).
 * @property {number} superego_strength - Internalized moral standards and strictness of conscience (0-100).
 * @property {number} ego_strength - Capacity to manage stress and tolerate frustration without psychological breakdown (0-100).
 * @property {number} libido - Life drive (Eros), creative energy, and vitality (0-100).
 * @property {number} death_drive - Destructive drive (Thanatos), repetition compulsion, and self-sabotage (0-100).
 * @property {number} serotonin - Mood and well-being regulator (0-100).
 * @property {number} dopamine - Reward, motivation, and pleasure center (0-100).
 * @property {number} cortisol - Primary stress hormone (0-100).
 * @property {number} oxytocin - Bonding, empathy, and trust hormone (0-100).
 * @property {number} adrenaline - Fight-or-flight response, arousal (0-100).
 * @property {number} gaba - Primary inhibitory neurotransmitter, promotes calmness (0-100).
 * @property {number} memory_intensity - Vividness of active past memories (0-100).
 * @property {number} affective_distance - Physical/emotional distance from a target (0-100).
 * @property {number} social_interaction - Level of recent human connection (0-100).
 * @property {number} sleep_quality - Neuro-recovery from the last sleep cycle (0-100).
 * @property {number} sensory_aversion - Exposure to repulsive stimuli (0-100).
 * @property {number} social_comparison - Perceived disadvantage compared to others (0-100).
 * @property {number} social_judgment - Perceived negative evaluation by peers (0-100).
 * @property {number} goal_blockage - Obstacles preventing a desired outcome (0-100).
 * @property {number} future_outlook - Cognitive expectation of future events (0=Bleak, 100=Bright).
 * @property {number} reality_testing - Capacity to differentiate internal fantasy from external reality (0-100).
 * @property {number} identity_integration - Sense of cohesive self vs identity diffusion/emptiness (0-100).
 * @property {number} id_pressure - Raw, unrefined impulsive drive seeking immediate discharge (0-100).
 * @property {number} openness - Openness to new experiences and intellectual curiosity (0-100).
 * @property {number} conscientiousness - Self-discipline, impulse control, and goal-directed behavior (0-100).
 * @property {number} extraversion - Tendency to seek stimulation and company of others (0-100).
 * @property {number} agreeableness - Tendency to be compassionate and cooperative rather than suspicious and antagonistic (0-100).
 * @property {number} neuroticism - Tendency toward psychological stress and emotional instability (0-100).
 * @property {number} fatigue - Level of physical and mental exhaustion (0-100).
 * @property {number} hunger - Caloric need, which increases irritability and impulsivity (0-100).
 * @property {number} physical_pain - Acute or chronic somatic pain, overriding higher cognitive functions (0-100).
 */

/**
 * @typedef {Object} AutonomicNervousSystem
 * @property {number} ventral_vagal - State of safety, social engagement, and calm connection (0-1).
 * @property {number} sympathetic - Mobilization state for fight or flight (0-1).
 * @property {number} dorsal_vagal - Immobilization, collapse, and freeze response due to overwhelming threat (0-1).
 */

/**
 * @typedef {Object} CognitiveState
 * @property {number} executive_bandwidth - Remaining prefrontal cortex capacity for logic, planning, and focus (0-1).
 * @property {number} brain_fog - Level of cognitive impairment, confusion, and memory retrieval difficulty (0-1).
 */

/**
 * @typedef {Object} BasicEmotions
 * @property {number} sadness - Degree of sorrow or unhappiness (0-1).
 * @property {number} happiness - Degree of joy or contentment (0-1).
 * @property {number} anger - Degree of hostility or frustration (0-1).
 * @property {number} fear - Degree of threat-induced distress (0-1).
 * @property {number} disgust - Revulsion toward offensive stimuli (0-1).
 * @property {number} interest - Focused attention and curiosity (0-1).
 * @property {number} boredom - Lack of interest and environmental stimulation (0-1).
 */

/**
 * @typedef {Object} ComplexEmotions
 * @property {number} angst - Existential dread, feeling of fundamental meaninglessness or void (0-1).
 * @property {number} awe - Profound reverence mixed with wonder, often triggered by meaning/openness (0-1).
 * @property {number} playfulness - Mammalian drive for joyful engagement, exploration, and humor (0-1).
 * @property {number} humiliation - Deep psychological wound to the narcissistic core (0-1).
 * @property {number} pride - Joy and self-satisfaction derived from living up to the Ego Ideal (0-1).
 * @property {number} guilt - Deep remorse for violating internalized moral codes (0-1).
 * @property {number} longing - Melancholic desire or nostalgia (Saudade) (0-1).
 * @property {number} depression - Persistent state of low mood and aversion to activity (0-1).
 * @property {number} love - Deep affection and romantic attachment (0-1).
 * @property {number} anxiety - Anticipatory dread and somatic tension (0-1).
 * @property {number} burnout - State of emotional, physical, and mental exhaustion (0-1).
 * @property {number} envy - Resentful longing for someone else's traits/status (0-1).
 * @property {number} shame - Painful feeling of humiliation or distress based on exposure (0-1).
 * @property {number} hostility - Unfriendly or antagonistic attitude (0-1).
 * @property {number} frustration - Annoyance at being hindered from a goal (0-1).
 * @property {number} aversion - Strong dislike or disinclination (0-1).
 * @property {number} affection - Gentle feeling of fondness or liking (0-1).
 * @property {number} trust - Firm belief in the reliability of someone/something (0-1).
 * @property {number} jealousy - Fear of losing a relationship to a rival (0-1).
 * @property {number} compassion - Sympathetic pity and concern for the sufferings of others (0-1).
 * @property {number} empathy - Ability to understand and share the feelings of another (0-1).
 * @property {number} hope - Expectation and desire for a certain thing to happen (0-1).
 * @property {number} passion - Strong and barely controllable emotion/desire (0-1).
 * @property {number} desire - Strong feeling of wanting to have something (0-1).
 */

/**
 * @typedef {Object} SocialPosture
 * @property {number} dominance - Tendency to assert control and influence over others (0-1).
 * @property {number} submission - Tendency to yield, appease, and surrender autonomy to avoid conflict (0-1).
 * @property {number} withdrawal - Tendency to completely avoid social contact due to overwhelm (0-1).
 */

/**
 * @typedef {Object} AttachmentDynamics
 * @property {number} secure - Comfortable with intimacy and autonomy (0-1).
 * @property {number} anxious - Craves closeness but fears abandonment, high clinging behavior (0-1).
 * @property {number} avoidant - Equates intimacy with loss of independence, emotional withdrawal (0-1).
 * @property {number} disorganized - Desires connection but fears it due to trauma, chaotic relationships (0-1).
 */

/**
 * @typedef {Object} PsychiatricVectors
 * @property {number} paranoia - Delusional fear and suspicion, driven by projection and stress (0-1).
 * @property {number} anhedonia - Complete inability to feel pleasure or interest, core of severe depression (0-1).
 * @property {number} mania - Euphoric, hyperactive, and delusional state driven by sleep deprivation and dopamine spikes (0-1).
 * @property {number} substance_craving - Conscious coping urge to self-medicate via addiction due to ego depletion (0-1).
 * @property {number} somatic_symptom_load - Acute physical manifestation of psychological pain (0-1).
 */

/**
 * @typedef {Object} EmotionalState
 * @property {{ unconscious_raw: BasicEmotions; conscious_experienced: BasicEmotions; unconscious_complex: ComplexEmotions; conscious_complex: ComplexEmotions; }} emotionalSpectrum
 * @property {PsychiatricVectors} clinical_psychiatry
 * @property {PsychologicalStructure} psychologicalStructure
 * @property {CognitiveDistortions} cognitive_distortions
 * @property {InternalFeelingStates} internalState
 * @property {AutonomicNervousSystem} polyvagal_state
 * @property {CognitiveState} cognition
 * @property {string} timestamp - ISO string of the exact moment the state was processed.
 */

/**
 * @typedef {Object} ObjectRelations
 * @property {number} idealization - Exaggerating the positive virtues of an object/person to protect from anxiety (0-1).
 * @property {number} devaluation - Exaggerating the negative qualities of an object/person to protect self-esteem (0-1).
 */

/**
 * @typedef {Object} DefenseMechanisms
 * @property {number} intellectualization - Stripping emotion from an event and treating it purely analytically to avoid distress (0-1).
 * @property {number} somatization - Converting psychological distress into physical symptoms like pain or fatigue (0-1).
 * @property {number} humor - Mature defense: acknowledging painful realities with playfulness to discharge tension (0-1).
 * @property {number} repression - Unconscious blocking of unacceptable emotions (0-1).
 * @property {number} projection - Attributing one's own unacceptable feelings to others (0-1).
 * @property {number} sublimation - Channeling unacceptable impulses into constructive behaviors (0-1).
 * @property {number} dissociation - Disconnecting from thoughts, feelings, or sense of identity to avoid pain (0-1).
 * @property {number} reaction_formation - Converting unacceptable impulses into their exact opposites (0-1).
 * @property {number} denial - Primitive refusal to accept painful reality or facts (0-1).
 * @property {number} splitting - Dividing beliefs, people, or self into all-good or all-bad (0-1).
 * @property {number} projective_identification - Forcing projected unacceptable feelings into another person (0-1).
 */

/**
 * Otto Kernberg's personality organization.
 * @typedef {'neurotic' | 'borderline' | 'psychotic'} StructuralDiagnosis
 */

/**
 * @typedef {Object} PsychologicalStructure
 * @property {DefenseMechanisms} defenses
 * @property {SocialPosture} social_posture
 * @property {AttachmentDynamics} attachment_style
 * @property {ObjectRelations} object_relations
 * @property {StructuralDiagnosis} structural_diagnosis
 */

/**
 * @typedef {Object} Temperament (Big Five)
 * @property {number} openness - Openness to new experiences and intellectual curiosity (0-1).
 * @property {number} conscientiousness - Self-discipline, impulse control, and goal-directed behavior (0-1).
 * @property {number} extraversion - Tendency to seek stimulation and company of others (0-1).
 * @property {number} agreeableness - Tendency to be compassionate and cooperative rather than suspicious and antagonistic (0-1).
 * @property {number} neuroticism - Tendency toward psychological stress and emotional instability (0-1).
 */

/**
 * @typedef {Object} CognitiveDistortions (Immediate Conscious Processing)
 * @property {number} catastrophizing - Exaggerating the danger or negative outcomes of a situation (0-1).
 * @property {number} mind_reading - Assuming negative intentions or judgments from others without evidence (0-1).
 */

/**
 * @typedef {Object} PhysiologicalState (The Body in Now)
 * @property {number} fatigue - Level of physical and mental exhaustion (0-1).
 * @property {number} hunger - Caloric need, which can increase irritability and impulsivity (0-1).
 * @property {number} physical_pain - Acute or chronic somatic pain, overriding higher cognitive functions (0-1).
 */

/**
 * Advanced Human Personality and Emotion Simulation Engine
 * Uses Mamdani inference to calculate continuous emotional states mimicking neurobiological
 * and psychosocial processes. Designed for realistic psychiatric modeling.
 * @beta
 */
class HumanPersonalitySimulator {
  /** * Internal state representing the raw database readings.
   * Values are kept private to force the use of getters/setters for validation.
   * @type {InternalFeelingStates}
   */
  #state = {
    mindfulness: 20,
    // Core Psychiatric/Metapsychological
    unprocessed_trauma: 0,
    existential_meaning: 50,
    superego_strength: 50,
    ego_strength: 50,
    libido: 50,
    death_drive: 20,
    ego_ideal: 50,
    narcissistic_supply: 50,
    somatic_tension: 0,

    // Neurochemical
    serotonin: 50,
    dopamine: 50,
    cortisol: 20,
    oxytocin: 50,
    adrenaline: 20,
    gaba: 50,

    // Contextual/Psychosocial
    memory_intensity: 0,
    affective_distance: 50,
    social_interaction: 50,
    sleep_quality: 50,
    sensory_aversion: 0,
    social_comparison: 0,
    social_judgment: 0,
    goal_blockage: 0,
    future_outlook: 50,
    reality_testing: 90,
    identity_integration: 80,
    id_pressure: 40,

    // Temperament (Big Five)
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,

    // Physiological Modulators
    fatigue: 0,
    hunger: 0,
    physical_pain: 0,
  };

  constructor() {
    /** @type {MamdaniInferenceSystem} */
    this.engine = new MamdaniInferenceSystem();
    this._initializeNeurochemicalInputs();
    this._initializeContextualInputs();
  }

  // ==========================================
  // GETTERS AND SETTERS (Auto-clamped 0-100)
  // ==========================================

  /**
   * Helper to ensure values stay within the 0-100 range required by our Fuzzy Sets.
   * @param {number|string} value - The raw input value.
   * @returns {number} The clamped value between 0 and 100.
   */
  #clamp(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  get mindfulness() {
    return this.#state.mindfulness;
  }
  set mindfulness(v) {
    this.#state.mindfulness = this.#clamp(v);
  }
  get superego_strength() {
    return this.#state.superego_strength;
  }
  set superego_strength(v) {
    this.#state.superego_strength = this.#clamp(v);
  }
  get ego_strength() {
    return this.#state.ego_strength;
  }
  set ego_strength(v) {
    this.#state.ego_strength = this.#clamp(v);
  }
  get libido() {
    return this.#state.libido;
  }
  set libido(v) {
    this.#state.libido = this.#clamp(v);
  }
  get death_drive() {
    return this.#state.death_drive;
  }
  set death_drive(v) {
    this.#state.death_drive = this.#clamp(v);
  }
  get egoIdeal() {
    return this.#state.ego_ideal;
  }
  set egoIdeal(v) {
    this.#state.ego_ideal = this.#clamp(v);
  }
  get narcissisticSupply() {
    return this.#state.narcissistic_supply;
  }
  set narcissisticSupply(v) {
    this.#state.narcissistic_supply = this.#clamp(v);
  }
  get somaticTension() {
    return this.#state.somatic_tension;
  }
  set somaticTension(v) {
    this.#state.somatic_tension = this.#clamp(v);
  }
  get serotonin() {
    return this.#state.serotonin;
  }
  set serotonin(v) {
    this.#state.serotonin = this.#clamp(v);
  }
  get dopamine() {
    return this.#state.dopamine;
  }
  set dopamine(v) {
    this.#state.dopamine = this.#clamp(v);
  }
  get cortisol() {
    return this.#state.cortisol;
  }
  set cortisol(v) {
    this.#state.cortisol = this.#clamp(v);
  }
  get oxytocin() {
    return this.#state.oxytocin;
  }
  set oxytocin(v) {
    this.#state.oxytocin = this.#clamp(v);
  }
  get adrenaline() {
    return this.#state.adrenaline;
  }
  set adrenaline(v) {
    this.#state.adrenaline = this.#clamp(v);
  }
  get gaba() {
    return this.#state.gaba;
  }
  set gaba(v) {
    this.#state.gaba = this.#clamp(v);
  }
  get memoryIntensity() {
    return this.#state.memory_intensity;
  }
  set memoryIntensity(v) {
    this.#state.memory_intensity = this.#clamp(v);
  }
  get affectiveDistance() {
    return this.#state.affective_distance;
  }
  set affectiveDistance(v) {
    this.#state.affective_distance = this.#clamp(v);
  }
  get socialInteraction() {
    return this.#state.social_interaction;
  }
  set socialInteraction(v) {
    this.#state.social_interaction = this.#clamp(v);
  }
  get sleepQuality() {
    return this.#state.sleep_quality;
  }
  set sleepQuality(v) {
    this.#state.sleep_quality = this.#clamp(v);
  }
  get sensoryAversion() {
    return this.#state.sensory_aversion;
  }
  set sensoryAversion(v) {
    this.#state.sensory_aversion = this.#clamp(v);
  }
  get socialComparison() {
    return this.#state.social_comparison;
  }
  set socialComparison(v) {
    this.#state.social_comparison = this.#clamp(v);
  }
  get socialJudgment() {
    return this.#state.social_judgment;
  }
  set socialJudgment(v) {
    this.#state.social_judgment = this.#clamp(v);
  }
  get goalBlockage() {
    return this.#state.goal_blockage;
  }
  set goalBlockage(v) {
    this.#state.goal_blockage = this.#clamp(v);
  }
  get futureOutlook() {
    return this.#state.future_outlook;
  }
  set futureOutlook(v) {
    this.#state.future_outlook = this.#clamp(v);
  }
  get realityTesting() {
    return this.#state.reality_testing;
  }
  set realityTesting(v) {
    this.#state.reality_testing = this.#clamp(v);
  }
  get identityIntegration() {
    return this.#state.identity_integration;
  }
  set identityIntegration(v) {
    this.#state.identity_integration = this.#clamp(v);
  }
  get idPressure() {
    return this.#state.id_pressure;
  }
  set idPressure(v) {
    this.#state.id_pressure = this.#clamp(v);
  }
  get openness() {
    return this.#state.openness;
  }
  set openness(v) {
    this.#state.openness = this.#clamp(v);
  }
  get conscientiousness() {
    return this.#state.conscientiousness;
  }
  set conscientiousness(v) {
    this.#state.conscientiousness = this.#clamp(v);
  }
  get extraversion() {
    return this.#state.extraversion;
  }
  set extraversion(v) {
    this.#state.extraversion = this.#clamp(v);
  }
  get agreeableness() {
    return this.#state.agreeableness;
  }
  set agreeableness(v) {
    this.#state.agreeableness = this.#clamp(v);
  }
  get neuroticism() {
    return this.#state.neuroticism;
  }
  set neuroticism(v) {
    this.#state.neuroticism = this.#clamp(v);
  }
  get fatigue() {
    return this.#state.fatigue;
  }
  set fatigue(v) {
    this.#state.fatigue = this.#clamp(v);
  }
  get hunger() {
    return this.#state.hunger;
  }
  set hunger(v) {
    this.#state.hunger = this.#clamp(v);
  }
  get physicalPain() {
    return this.#state.physical_pain;
  }
  set physicalPain(v) {
    this.#state.physical_pain = this.#clamp(v);
  }
  get unprocessedTrauma() {
    return this.#state.unprocessed_trauma;
  }
  set unprocessedTrauma(v) {
    this.#state.unprocessed_trauma = this.#clamp(v);
  }
  get existentialMeaning() {
    return this.#state.existential_meaning;
  }
  set existentialMeaning(v) {
    this.#state.existential_meaning = this.#clamp(v);
  }

  // ==========================================
  // DATA MANAGEMENT
  // ==========================================

  /**
   * Imports raw data from the database into the simulator's internal state.
   * Uses the setters to ensure all incoming data is validated.
   * @param {Partial<InternalFeelingStates>} dbReadings - Object containing the numeric values to update.
   */
  importData(dbReadings) {
    if (!dbReadings) return;
    Object.keys(this.#state).forEach((key) => {
      // @ts-ignore: mapping dynamic keys to explicit setters
      if (dbReadings[key] !== undefined) this[this.#snakeToCamel(key)] = dbReadings[key];
    });
  }

  /**
   * Exports the current internal raw state to be saved in a database.
   * @returns {InternalFeelingStates} The current state object.
   */
  exportData() {
    return { ...this.#state };
  }

  /**
   * Utility to convert snake_case database keys to camelCase setter properties.
   * @param {string} str - The snake_case string (e.g., "memory_intensity").
   * @returns {string} The camelCase string (e.g., "memoryIntensity").
   */
  #snakeToCamel(str) {
    return str.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
  }

  // ==========================================
  // ENGINE INITIALIZATION
  // ==========================================

  /**
   * Defines internal biological variables (Neurotransmitters/Hormones).
   * Values range from 0 to 100.
   * Sets are configured as [0: Low, 1: Medium/Stable, 2: High].
   */
  _initializeNeurochemicalInputs() {
    ['serotonin', 'dopamine', 'cortisol', 'oxytocin'].forEach((name) => {
      this.engine.addVariable(name, [
        new FuzzySet('Low', 0, 0, 20, 40),
        new FuzzySet('Medium', 30, 50, 70, 80),
        new FuzzySet('High', 70, 90, 100, 100),
      ]);
    });
    this.engine.addVariable('adrenaline', [
      new FuzzySet('Low', 0, 0, 20, 40),
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
   * Sets are configured as [0: Low/None, 1: Medium, 2: High/Strong].
   */
  _initializeContextualInputs() {
    const defaultSets = [
      new FuzzySet('Low', 0, 0, 20, 40),
      new FuzzySet('Medium', 30, 50, 70, 80),
      new FuzzySet('High', 70, 90, 100, 100),
    ];

    [
      'superego_strength',
      'ego_strength',
      'libido',
      'death_drive',
      'memory_intensity',
      'affective_distance',
      'sensory_aversion',
      'social_comparison',
      'social_judgment',
      'goal_blockage',
      'future_outlook',
      'social_interaction',
      'sleep_quality',
      'reality_testing',
      'identity_integration',
      'id_pressure',
      'ego_ideal',
      'narcissistic_supply',
      'unprocessed_trauma',
      'existential_meaning',
      'mindfulness',
    ].forEach((name) => {
      if (!this.engine.hasVariable(name)) this.engine.addVariable(name, defaultSets);
    });
  }

  // ==========================================
  // EMOTIONAL PROCESSING
  // ==========================================

  /**
   * Calculates the Polyvagal states based on Stephen Porges' theory.
   * Dictates the raw physiological platform from which all psychology emerges.
   * @returns {AutonomicNervousSystem}
   */
  _calculatePolyvagalState() {
    const oxyHigh = this.engine.getVariable('oxytocin')[2].calculate(this.#state.oxytocin);
    const gabHigh = this.engine.getVariable('gaba')[2].calculate(this.#state.gaba);
    const adrElevated = this.engine.getVariable('adrenaline')[1].calculate(this.#state.adrenaline);
    const corHigh = this.engine.getVariable('cortisol')[2].calculate(this.#state.cortisol);
    const traumaHigh = this.engine
      .getVariable('unprocessed_trauma')[2]
      .calculate(this.#state.unprocessed_trauma);

    // 1. Ventral Vagal (Safety): High Oxytocin, High GABA, Low Stress.
    const ventral_vagal = Math.max(0, oxyHigh * 0.6 + gabHigh * 0.4 - corHigh * 0.5);

    // 2. Sympathetic (Fight/Flight): Adrenaline + Cortisol overriding safety.
    const sympathetic = Math.min(1, adrElevated * 0.6 + corHigh * 0.4);

    // 3. Dorsal Vagal happens when trauma is high and sympathetic arousal collapses
    const dorsal_vagal = Math.min(
      1,
      traumaHigh * 0.5 + corHigh * 0.3 + (1 - this.#state.adrenaline / 100) * 0.2,
    );

    return { ventral_vagal, sympathetic, dorsal_vagal };
  }

  /**
   * Calculates conscious cognitive capacity. Emotion fundamentally alters logic.
   * @param {AutonomicNervousSystem} polyvagal
   * @param {number} burnout
   * @returns {CognitiveState}
   */
  _calculateCognitiveState(polyvagal, burnout) {
    const sleepLow = this.engine
      .getVariable('sleep_quality')[0]
      .calculate(this.#state.sleep_quality);
    const fatigue = this.#state.fatigue / 100;

    // Mindfulness acts as a shield to preserve bandwidth.
    const mindfulness = this.#state.mindfulness / 100;

    // Brain Fog increases with shutdown, exhaustion, and lack of sleep.
    const brain_fog = Math.min(
      1,
      polyvagal.dorsal_vagal * 0.4 + burnout * 0.3 + fatigue * 0.2 + sleepLow * 0.2,
    );

    // Executive Bandwidth is destroyed by sympathetic arousal (panic) and brain fog, protected by mindfulness.
    const penalty = Math.min(1, polyvagal.sympathetic * 0.4 + brain_fog * 0.6);
    const executive_bandwidth = Math.max(0, Math.min(1, 1 - penalty + mindfulness * 0.3));

    return { executive_bandwidth, brain_fog };
  }

  /**
   * Applies physiological modifiers.
   * Returns temporary capacity values rather than mutating the baseline state.
   */
  _applyPhysiologicalPenalties() {
    // Normalizing 0-100 to 0-1 for percentage calculation
    const fatigue = this.#state.fatigue / 100;
    const hunger = this.#state.hunger / 100;
    const pain = this.#state.physical_pain / 100;

    // Hunger, pain, and fatigue severely deplete cognitive resources.
    const penalty = fatigue * 0.4 + hunger * 0.3 + pain * 0.3;

    // Trauma actively depletes the Ego's base capacity to handle physiological stress
    const traumaLoad = this.#state.unprocessed_trauma / 100;
    const compoundedPenalty = Math.min(1, penalty + traumaLoad * 0.2);

    // Ego loses the capacity to contain impulses and utilize mature defenses.
    const temporaryEgoStrength = Math.max(
      0,
      this.#state.ego_strength - this.#state.ego_strength * compoundedPenalty,
    );

    // Moral tolerance (Superego) loosens when exhausted or in pain.
    const temporarySuperego = Math.max(
      0,
      this.#state.superego_strength - this.#state.superego_strength * compoundedPenalty,
    );

    return { temporaryEgoStrength, temporarySuperego };
  }

  /**
   * Calculates Cognitive Distortions.
   * @param {BasicEmotions} basic
   * @returns {CognitiveDistortions}
   */
  _calculateCognitiveDistortions(basic) {
    // Catastrophizing: Fueled by fear, high neuroticism, and high stress.
    const neuroticism = this.#state.neuroticism / 100;
    const agreeableness = this.#state.agreeableness / 100;
    const stressLevel = this.#state.cortisol / 100;
    const mindfulness = this.#state.mindfulness / 100; // The Antidote

    // Full Attention (Mindfulness) actively reduces the ability of the mind to catastrophize
    const catastrophizing = Math.max(
      0,
      Math.min(1, basic.fear * 0.4 + neuroticism * 0.4 + stressLevel * 0.2 - mindfulness * 0.5),
    );
    const mind_reading = Math.max(
      0,
      Math.min(
        1,
        basic.fear * 0.3 + (1 - agreeableness) * 0.3 + neuroticism * 0.4 - mindfulness * 0.4,
      ),
    );

    return { catastrophizing, mind_reading };
  }

  /**
   * Engine for calculating Psychoanalytic Defense Mechanisms.
   * @param {BasicEmotions} basic
   * @param {ComplexEmotions} complex
   * @param {number} activeEgoStrength - Ego strength after physical penalties
   * @param {number} activeSuperegoStrength - Superego strength after physical penalties
   * @returns {DefenseMechanisms}
   */
  _calculateDefenseMechanisms(basic, complex, activeEgoStrength, activeSuperegoStrength) {
    // Calculate Fuzzy Logic based on the PENALIZED values. This simulates ego depletion.
    const egoStrong = this.engine.getVariable('ego_strength')[2].calculate(activeEgoStrength);
    const egoWeak = this.engine.getVariable('ego_strength')[0].calculate(activeEgoStrength);
    const superHigh = this.engine
      .getVariable('superego_strength')[2]
      .calculate(activeSuperegoStrength);

    const realityWeak = this.engine
      .getVariable('reality_testing')[0]
      .calculate(this.#state.reality_testing);
    const identityWeak = this.engine
      .getVariable('identity_integration')[0]
      .calculate(this.#state.identity_integration);
    const erosHigh = this.engine.getVariable('libido')[2].calculate(this.#state.libido);

    // Trauma directly fuels the Death Drive and weakens Reality Testing inherently
    const rawThanatos = Math.min(
      100,
      this.#state.death_drive + this.#state.unprocessed_trauma * 0.5,
    );
    const thanatosHigh = this.engine.getVariable('death_drive')[2].calculate(rawThanatos);
    const traumaHigh = this.engine
      .getVariable('unprocessed_trauma')[2]
      .calculate(this.#state.unprocessed_trauma);

    const mindfulnessBuffer = this.#state.mindfulness / 100;
    const distress = Math.max(basic.fear, basic.sadness, complex.anxiety, complex.shame);

    // NEUROTIC DEFENSES

    // Repression: Triggered by high distress but a weak/moderate ego trying to cope.
    // It pushes the emotion down, but often increases internal cortisol (anxiety).
    const repression = Math.min(1, distress * 0.6 + egoWeak * 0.4);

    // Projection: Taking internal hostility or shame and blaming the outside world.
    // Highly correlated with low ego strength and high Thanatos (Death Drive).
    // Primitive Defenses buffered by mindfulness
    const projection = Math.max(
      0,
      Math.min(1, complex.hostility * 0.4 + complex.shame * 0.3 + thanatosHigh * 0.3) -
        mindfulnessBuffer * 0.4,
    );

    // Denial: Rejection of external reality due to overwhelming anxiety or low reality testing.
    const denial = Math.max(
      0,
      Math.min(1, basic.fear * 0.4 + realityWeak * 0.4 + egoWeak * 0.2) - mindfulnessBuffer * 0.5,
    );

    // Splitting: Inability to integrate good and bad. Driven by identity diffusion (Borderline core).
    const splitting = Math.max(
      0,
      Math.min(1, complex.anxiety * 0.3 + identityWeak * 0.4 + traumaHigh * 0.3) -
        mindfulnessBuffer * 0.5,
    );

    // Projective Identification: Projecting bad parts onto others and trying to control them.
    const projective_identification = Math.max(
      0,
      Math.min(1, complex.hostility * 0.4 + splitting * 0.4 + egoWeak * 0.2) -
        mindfulnessBuffer * 0.4,
    );

    // Sublimation: A mature defense. Taking high distress or high anger/passion
    // and turning it into something useful. Requires high Ego Strength and high Libido.
    // Mature defenses enhanced by mindfulness
    const sublimation = Math.min(
      1,
      (basic.anger + complex.desire) * 0.3 +
        egoStrong * 0.4 +
        erosHigh * 0.3 +
        mindfulnessBuffer * 0.3,
    );
    const humor = Math.min(
      1,
      basic.sadness * 0.3 + egoStrong * 0.4 + erosHigh * 0.3 + mindfulnessBuffer * 0.3,
    );

    // Reaction Formation: Superego strictly forbids the impulse, forcing ego to express the opposite.
    const reaction_formation = Math.min(
      1,
      complex.hostility * 0.4 + superHigh * 0.4 + egoStrong * 0.2,
    );

    // PRIMITIVE & TRAUMA DEFENSES

    // Dissociation is heavily anchored in Trauma now
    const dissociation = Math.min(
      1,
      basic.fear * 0.4 + complex.burnout * 0.3 + traumaHigh * 0.4 + egoWeak * 0.2,
    );
    // Intellectualization: High intelligence/ego strength dealing with high distress by cutting off affect.
    const intellectualization = Math.min(1, complex.anxiety * 0.5 + egoStrong * 0.5);
    // Somatization: Occurs when distress is high, repression fails to calm the body, and the Ego is overwhelmed.
    const somatization = Math.min(1, distress * 0.4 + repression * 0.3 + traumaHigh * 0.3);

    return {
      repression,
      projection,
      sublimation,
      dissociation,
      reaction_formation,
      denial,
      splitting,
      projective_identification,
      intellectualization,
      somatization,
      humor,
    };
  }

  /**
   * Evaluates Object Relations (Klein/Kernberg)
   * How the subject perceives others internally based on their defenses.
   * @param {ComplexEmotions} complex
   * @param {DefenseMechanisms} defenses
   * @param {AttachmentDynamics} attachment
   */
  _calculateObjectRelations(complex, defenses, attachment) {
    // Idealization: Craving a perfect savior. Follows splitting and anxious attachment.
    const idealization = Math.min(
      1,
      defenses.splitting * 0.4 + attachment.anxious * 0.4 + complex.desire * 0.2,
    );
    // Devaluation: Trashing the object to protect the ego. Linked to avoidant/splitting.
    const devaluation = Math.min(
      1,
      defenses.splitting * 0.4 + complex.hostility * 0.4 + attachment.avoidant * 0.2,
    );

    return { idealization, devaluation };
  }

  /**
   * Structural Diagnosis based on Otto Kernberg's Model.
   * Defines the overarching psychiatric functioning of the personality.
   * @returns {StructuralDiagnosis}
   */
  _diagnoseStructuralOrganization() {
    if (this.realityTesting <= 30)
      return 'psychotic'; // Loss of reality testing
    else if (this.identityIntegration <= 40 || this.ego_strength <= 40)
      return 'borderline'; // Reality intact, but identity diffused + primitive defenses
    else return 'neurotic'; // Integrated identity, mature/neurotic defenses
  }

  /**
   * Engine for calculating Interpersonal/Social Postures.
   * Determines how the human behaves in a group setting (Submission vs Dominance).
   * @param {BasicEmotions} basic
   * @param {ComplexEmotions} complex
   * @param {AutonomicNervousSystem} polyvagal
   * @returns {SocialPosture}
   */
  _calculateSocialPosture(basic, complex, polyvagal) {
    const egoStrong = this.engine.getVariable('ego_strength')[2].calculate(this.ego_strength);
    const egoWeak = this.engine.getVariable('ego_strength')[0].calculate(this.ego_strength);

    const adrElevated = this.engine.getVariable('adrenaline')[1].calculate(this.adrenaline);
    const dopHigh = this.engine.getVariable('dopamine')[2].calculate(this.dopamine);
    const compHigh = this.engine
      .getVariable('social_comparison')[2]
      .calculate(this.socialComparison); // Feeling inferior

    // Dominance: Requires confidence (ego), reward drive (dopamine), and assertiveness (adrenaline/anger).
    let dominance = Math.min(
      1,
      egoStrong * 0.4 + dopHigh * 0.3 + (basic.anger + adrElevated) * 0.3,
    );
    dominance = Math.max(0, dominance - polyvagal.dorsal_vagal * 0.8);

    // Submission (Fawning/Appeasement): Triggered when feeling inferior (high comparison),
    // facing threat (fear), lacking defense capability (weak ego), and desperate for bonding/mercy (oxytocin).
    let submission = Math.min(
      1,
      compHigh * 0.4 + basic.fear * 0.3 + egoWeak * 0.2 + complex.affection * 0.1,
    );

    // Withdrawal (Isolamento): Complete social retreat. High burnout, aversion, and depression.
    let withdrawal = Math.min(
      1,
      complex.burnout * 0.4 + complex.aversion * 0.3 + complex.depression * 0.3,
    );
    withdrawal = Math.min(1, withdrawal + polyvagal.dorsal_vagal * 0.8); // Dorsal vagal = Collapse/Isolation

    return { dominance, submission, withdrawal };
  }

  /**
   * Engine for calculating Interpersonal Attachment Styles.
   * Based on John Bowlby's Attachment Theory. Defines how the entity bonds.
   * @param {BasicEmotions} basic
   * @param {ComplexEmotions} complex
   */
  _calculateAttachmentDynamics(basic, complex) {
    const egoStrong = this.engine.getVariable('ego_strength')[2].calculate(this.ego_strength);
    const oxyHigh = this.engine.getVariable('oxytocin')[2].calculate(this.oxytocin);
    const corHigh = this.engine.getVariable('cortisol')[2].calculate(this.cortisol);
    const distHigh = this.engine
      .getVariable('affective_distance')[2]
      .calculate(this.affectiveDistance);

    // Secure: Trusting, emotionally available, independent.
    const secure = Math.min(1, egoStrong * 0.5 + oxyHigh * 0.3 + complex.trust * 0.2);

    // Anxious: Desperate for connection, terrified of abandonment.
    const anxious = Math.min(1, oxyHigh * 0.4 + corHigh * 0.3 + complex.jealousy * 0.3);

    // Avoidant: Distances self to avoid vulnerability.
    const avoidant = Math.min(
      1,
      distHigh * 0.5 + complex.aversion * 0.3 + Math.max(0, 1 - oxyHigh) * 0.2,
    );

    // Disorganized: Wants connection but fears it (trauma response).
    const disorganized = Math.min(
      1,
      basic.fear * 0.4 + complex.longing * 0.3 + complex.hostility * 0.3,
    );

    return { secure, anxious, avoidant, disorganized };
  }

  /**
   * Core engine for calculating basic emotions (Primary affects).
   * Models the immediate evolutionary responses to physiological baselines.
   * Psychiatric logic:
   * - Happiness: Tied to reward (Dopamine) and mood stability (Serotonin), suppressed by stress (Cortisol).
   * - Anger: A hyper-aroused threat response (Adrenaline + Cortisol) lacking inhibitory control (Low GABA).
   * - Fear: Acute arousal (Adrenaline) and stress (Cortisol), also exacerbated by low GABA.
   * - Boredom: Low dopamine + Low adrenaline + Isolation.
   * - Interest: High dopamine (motivation) + moderate arousal.
   * - Disgust: Repulsive stimuli overriding neutral state.
   * - Sadness: Low Serotonin + High Cortisol.
   * @returns {BasicEmotions} Basic emotion degrees (0 to 1)
   */
  _calculateBasicEmotions() {
    const ser = this.engine.getVariable('serotonin');
    const dop = this.engine.getVariable('dopamine');
    const cor = this.engine.getVariable('cortisol');
    const adr = this.engine.getVariable('adrenaline');
    const gab = this.engine.getVariable('gaba');
    const avr = this.engine.getVariable('sensory_aversion');
    const soc = this.engine.getVariable('social_interaction');

    return {
      happiness: Math.max(
        0,
        ser[1].calculate(this.serotonin) * 0.4 +
          dop[2].calculate(this.dopamine) * 0.6 -
          cor[2].calculate(this.cortisol) * 0.4,
      ),
      anger: Math.min(
        1,
        cor[2].calculate(this.cortisol) * 0.5 +
          adr[1].calculate(this.adrenaline) * 0.3 +
          gab[0].calculate(this.gaba) * 0.2,
      ),
      sadness: Math.min(
        1,
        ser[0].calculate(this.serotonin) * 0.7 + cor[2].calculate(this.cortisol) * 0.3,
      ),
      fear: Math.max(
        0,
        Math.min(
          1,
          adr[2].calculate(this.adrenaline) * 0.6 +
            cor[2].calculate(this.cortisol) * 0.4 -
            gab[2].calculate(this.gaba) * 0.5,
        ),
      ),
      disgust: Math.min(
        1,
        avr[2].calculate(this.sensoryAversion) * 0.8 + gab[0].calculate(this.gaba) * 0.2,
      ),
      interest: Math.min(
        1,
        dop[2].calculate(this.dopamine) * 0.6 + adr[1].calculate(this.adrenaline) * 0.4,
      ),
      boredom: Math.min(
        1,
        dop[0].calculate(this.dopamine) * 0.5 +
          adr[0].calculate(this.adrenaline) * 0.3 +
          soc[0].calculate(this.socialInteraction) * 0.2,
      ),
    };
  }

  /**
   * Engine for calculating complex emotions (Secondary affects).
   * From a psychiatric perspective, complex emotions are higher-order cognitive appraisals
   * of basic states mixed with psychosocial contexts (like judgment, comparison, and bonding).
   * @param {BasicEmotions} basic - The foundational emotional states.
   * @returns {ComplexEmotions} The calculated degrees of complex emotions (0 to 1).
   */
  _calculateComplexEmotions(basic) {
    // Indexes: 0 = Low, 1 = Medium, 2 = High
    const superHigh = this.engine
      .getVariable('superego_strength')[2]
      .calculate(this.#state.superego_strength);
    const thanatosHigh = this.engine
      .getVariable('death_drive')[2]
      .calculate(this.#state.death_drive);
    const erosHigh = this.engine.getVariable('libido')[2].calculate(this.#state.libido);

    // Narcissistic Axis integration
    const egoIdealHigh = this.engine.getVariable('ego_ideal')[2].calculate(this.#state.ego_ideal);
    const narcSupplyHigh = this.engine
      .getVariable('narcissistic_supply')[2]
      .calculate(this.#state.narcissistic_supply);
    const narcSupplyLow = this.engine
      .getVariable('narcissistic_supply')[0]
      .calculate(this.#state.narcissistic_supply);
    const meaningHigh = this.engine
      .getVariable('existential_meaning')[2]
      .calculate(this.#state.existential_meaning);
    const meaningLow = this.engine
      .getVariable('existential_meaning')[0]
      .calculate(this.#state.existential_meaning);

    const mem = this.engine
      .getVariable('memory_intensity')[2]
      .calculate(this.#state.memory_intensity);
    const dist = this.engine
      .getVariable('affective_distance')[2]
      .calculate(this.#state.affective_distance); // High distance
    const closeDist = this.engine
      .getVariable('affective_distance')[0]
      .calculate(this.#state.affective_distance); // Low distance

    const oxyLow = this.engine.getVariable('oxytocin')[0].calculate(this.#state.oxytocin);
    const oxyHigh = this.engine.getVariable('oxytocin')[2].calculate(this.#state.oxytocin);

    const dopHigh = this.engine.getVariable('dopamine')[2].calculate(this.#state.dopamine);
    const dopLow = this.engine.getVariable('dopamine')[0].calculate(this.#state.dopamine);
    const serLow = this.engine.getVariable('serotonin')[0].calculate(this.#state.serotonin);
    const serHigh = this.engine.getVariable('serotonin')[2].calculate(this.#state.serotonin);

    const corHigh = this.engine.getVariable('cortisol')[2].calculate(this.#state.cortisol);
    const gabHigh = this.engine.getVariable('gaba')[2].calculate(this.#state.gaba);
    const adrSpike = this.engine.getVariable('adrenaline')[2].calculate(this.#state.adrenaline);

    const compHigh = this.engine
      .getVariable('social_comparison')[2]
      .calculate(this.#state.social_comparison);
    const judgHigh = this.engine
      .getVariable('social_judgment')[2]
      .calculate(this.#state.social_judgment);
    const blockHigh = this.engine
      .getVariable('goal_blockage')[2]
      .calculate(this.#state.goal_blockage);
    const futureBright = this.engine
      .getVariable('future_outlook')[2]
      .calculate(this.#state.future_outlook);

    // ==========================================
    // PSYCHOLOGICAL APPRAISALS
    // ==========================================

    // Narcissistic Axis & Play

    // EXISTENTIAL & NEW EMOTIONS
    const angst = Math.min(1, meaningLow * 0.6 + basic.sadness * 0.2 + corHigh * 0.2); // Void / Dread
    const awe = Math.min(1, meaningHigh * 0.5 + (this.#state.openness / 100) * 0.3 + dopHigh * 0.2);
    const pride = Math.min(1, narcSupplyHigh * 0.4 + egoIdealHigh * 0.4 + dopHigh * 0.2);
    const humiliation = Math.min(1, judgHigh * 0.5 + narcSupplyLow * 0.3 + basic.sadness * 0.2);
    const playfulness = Math.max(0, dopHigh * 0.4 + erosHigh * 0.4 + oxyHigh * 0.2 - corHigh * 0.5);

    // Existing Appraisals
    const longing = Math.min(1, mem * 0.4 + dist * 0.4 + basic.sadness * 0.2);

    // Meaning acts as a powerful buffer against depression and burnout

    const depression = Math.max(
      0,
      Math.min(1, serLow * 0.4 + dopLow * 0.3 + basic.sadness * 0.3 - meaningHigh * 0.3),
    );
    const love = Math.min(1, oxyHigh * 0.5 + dopHigh * 0.3 + closeDist * 0.2);
    const anxiety = Math.min(
      1,
      corHigh * 0.5 +
        this.engine.getVariable('gaba')[0].calculate(this.#state.gaba) * 0.3 +
        basic.fear * 0.2,
    );
    const burnout = Math.max(
      0,
      Math.min(
        1,
        corHigh * 0.4 +
          this.engine.getVariable('sleep_quality')[0].calculate(this.#state.sleep_quality) * 0.4 +
          serLow * 0.2 -
          meaningHigh * 0.2,
      ),
    );

    // Social & Ego Emotions
    const envy = Math.min(1, compHigh * 0.6 + basic.sadness * 0.2 + basic.anger * 0.2);
    const shame = Math.min(1, judgHigh * 0.6 + corHigh * 0.2 + serLow * 0.2); // Perception of judgment dropping serotonin (status)
    const guilt = Math.min(1, superHigh * 0.5 + basic.sadness * 0.3 + thanatosHigh * 0.2);
    const jealousy = Math.min(
      1,
      compHigh * 0.3 + basic.fear * 0.3 + basic.anger * 0.2 + oxyHigh * 0.2,
    ); // Threat to a bond

    // Conflict Emotions
    const hostility = Math.min(1, basic.anger * 0.5 + basic.disgust * 0.3 + oxyLow * 0.2); // Anger stripped of empathy (low oxytocin)
    const frustration = Math.min(1, blockHigh * 0.5 + dopHigh * 0.3 + corHigh * 0.2); // High motivation (dopamine) meeting an obstacle
    const aversion = Math.min(1, basic.disgust * 0.5 + basic.fear * 0.3 + dist * 0.2); // Need to increase distance from stimulus

    // Pro-Social & Attachment Emotions
    const affection = Math.min(1, oxyHigh * 0.6 + serHigh * 0.4);
    const trust = Math.max(0, oxyHigh * 0.5 + gabHigh * 0.3 - corHigh * 0.2); // High bonding and calm, low stress
    const empathy = Math.min(1, oxyHigh * 0.6 + basic.interest * 0.4);
    const compassion = Math.min(1, empathy * 0.5 + basic.sadness * 0.3 + gabHigh * 0.2); // Requires empathy, shared sadness, but enough GABA to act

    // Future & Motivation Emotions
    const hope = Math.min(1, futureBright * 0.5 + dopHigh * 0.3 + meaningHigh * 0.4);
    const passion = Math.min(1, adrSpike * 0.4 + dopHigh * 0.3 + oxyHigh * 0.3); // High arousal, reward, and bonding
    const desire = Math.min(1, dopHigh * 0.5 + mem * 0.3 + serLow * 0.2); // Anticipation of reward + memory + a sense of lack (low serotonin)

    return {
      angst,
      awe,
      playfulness,
      humiliation,
      pride,
      guilt,
      longing,
      depression,
      love,
      anxiety,
      burnout,
      envy,
      shame,
      hostility,
      frustration,
      aversion,
      affection,
      trust,
      jealousy,
      compassion,
      empathy,
      hope,
      passion,
      desire,
    };
  }

  /**
   * Evaluates overt clinical psychiatric symptoms based on the collision of defenses, trauma, and biochemistry.
   * @param {ComplexEmotions} complex
   * @param {CognitiveDistortions} distortions
   * @param {DefenseMechanisms} defenses
   * @returns {PsychiatricVectors}
   */
  _calculateClinicalVectors(complex, distortions, defenses) {
    const dopHigh = this.engine.getVariable('dopamine')[2].calculate(this.#state.dopamine);
    const sleepLow = this.engine
      .getVariable('sleep_quality')[0]
      .calculate(this.#state.sleep_quality);
    const libidoHigh = this.engine.getVariable('libido')[2].calculate(this.#state.libido);

    // Paranoia: Projection + Mind Reading + High Dopamine (Salience/Pattern finding)
    const paranoia = Math.min(
      1,
      defenses.projection * 0.4 + distortions.mind_reading * 0.4 + dopHigh * 0.2,
    );

    // Anhedonia: Flat dopamine + Burnout + Loss of meaning. Distinct from sadness.
    const anhedonia = Math.min(
      1,
      this.engine.getVariable('dopamine')[0].calculate(this.#state.dopamine) * 0.5 +
        complex.burnout * 0.3 +
        complex.angst * 0.2,
    );

    // Mania: Dangerous high energy state. High dopamine, high libido, but critically low sleep and reality testing.
    const mania = Math.min(1, dopHigh * 0.3 + libidoHigh * 0.3 + sleepLow * 0.4);

    // Substance Craving: The ego is desperate to change the internal state. High stress, low dopamine, high trauma.
    const distress = complex.anxiety + complex.depression + complex.angst;
    const traumaHigh = this.engine
      .getVariable('unprocessed_trauma')[2]
      .calculate(this.#state.unprocessed_trauma);
    const substance_craving = Math.min(
      1,
      (distress / 3) * 0.4 +
        this.engine.getVariable('dopamine')[0].calculate(this.#state.dopamine) * 0.3 +
        traumaHigh * 0.3,
    );

    const somatic_symptom_load = Math.min(1, defenses.somatization * 0.8 + complex.anxiety * 0.2);

    return { paranoia, anhedonia, mania, substance_craving, somatic_symptom_load };
  }

  /**
   * Processes the internal state and returns the full personality/emotion profile.
   * Formats all fractional values (0-1) into standardized percentages (0-100%).
   * @returns {EmotionalState} Full emotional spectrum analysis.
   */
  processEmotionalState() {
    // 1. Core Biology
    const basic = this._calculateBasicEmotions();
    const complex = this._calculateComplexEmotions(basic);

    const polyvagal_state = this._calculatePolyvagalState();
    const cognition = this._calculateCognitiveState(polyvagal_state, complex.burnout);

    // 2. Immediate Physiology overrides baseline capacities
    const { temporaryEgoStrength, temporarySuperego } = this._applyPhysiologicalPenalties();

    // 3. Cognitive Filters (The conscious mind running amok)
    const distortions = this._calculateCognitiveDistortions(basic);

    // 4. Defense Mechanisms (Ego trying to survive, using depleted energy)
    const defenses = this._calculateDefenseMechanisms(
      basic,
      complex,
      temporaryEgoStrength,
      temporarySuperego,
    );

    const clinicalVectors = this._calculateClinicalVectors(complex, distortions, defenses);

    // 5. Psychosocial Output
    const posture = this._calculateSocialPosture(basic, complex, polyvagal_state);

    // Trauma infects Attachment
    const attachment = this._calculateAttachmentDynamics(basic, complex);
    const traumaHigh = this.engine
      .getVariable('unprocessed_trauma')[2]
      .calculate(this.#state.unprocessed_trauma);
    attachment.disorganized = Math.min(1, attachment.disorganized + traumaHigh * 0.5);

    const objectRelations = this._calculateObjectRelations(complex, defenses, attachment);
    const diagnosis = this._diagnoseStructuralOrganization();

    // PSYCHOANALYTIC MASKING: Ego's defense mechanisms + Cognitive Distortions
    let consciousBasic = { ...basic };
    let consciousComplex = { ...complex };

    // 1. REPRESSION: In reality, high repression reduces conscious manifestations of sadness and fear.
    if (defenses.repression > 0.5) {
      consciousBasic.sadness = Math.max(0, consciousBasic.sadness - defenses.repression * 0.4);
      consciousBasic.fear = Math.max(0, consciousBasic.fear - defenses.repression * 0.4);

      // The somatic toll of repression (pushing emotions down spikes tension):
      consciousComplex.anxiety = Math.min(1, consciousComplex.anxiety + defenses.repression * 0.3);
    }

    // 2. PROJECTION: Displacing internal inadequacy onto others. Lowers shame, spikes external hostility.
    if (defenses.projection > 0.5) {
      consciousComplex.shame = Math.max(0, consciousComplex.shame - defenses.projection * 0.5);
      consciousBasic.anger = Math.min(1, consciousBasic.anger + defenses.projection * 0.3);
      consciousComplex.hostility = Math.min(
        1,
        consciousComplex.hostility + defenses.projection * 0.4,
      );
    }

    // 3. SUBLIMATION: Channeling dark drives into productive energy. Lowers anger/frustration, increases passion.
    if (defenses.sublimation > 0.5) {
      consciousBasic.anger = Math.max(0, consciousBasic.anger - defenses.sublimation * 0.5);
      consciousComplex.frustration = Math.max(
        0,
        consciousComplex.frustration - defenses.sublimation * 0.5,
      );

      consciousBasic.interest = Math.min(1, consciousBasic.interest + defenses.sublimation * 0.3);
      consciousComplex.passion = Math.min(1, consciousComplex.passion + defenses.sublimation * 0.3);
    }

    // 4. DISSOCIATION: The extreme trauma response. Affective flattening (numbing) across the board.
    if (defenses.dissociation > 0.5) {
      const numbingFactor = 1 - defenses.dissociation * 0.8; // Retains only a small fraction of emotion

      // @ts-ignore
      Object.keys(consciousBasic).forEach((key) => (consciousBasic[key] *= numbingFactor));

      // Deep depressive states and burnout often pierce through dissociation, the rest is numbed.
      Object.keys(consciousComplex).forEach((key) => {
        if (key !== 'burnout' && key !== 'depression') {
          // @ts-ignore
          consciousComplex[key] *= numbingFactor;
        }
      });
    }

    // 5. REACTION FORMATION: Inverting hostile feelings consciously.
    if (defenses.reaction_formation > 0.5) {
      consciousComplex.affection = Math.min(
        1,
        consciousComplex.affection + defenses.reaction_formation * 0.6,
      );
      consciousComplex.hostility = Math.max(
        0,
        consciousComplex.hostility - defenses.reaction_formation * 0.8,
      );
      consciousBasic.anger = Math.max(0, consciousBasic.anger - defenses.reaction_formation * 0.5);
    }

    // 6. DENIAL: Severe erasure of reality, but underlying somatic anxiety remains untouched.
    if (defenses.denial > 0.5) {
      consciousBasic.fear = Math.max(0, consciousBasic.fear - defenses.denial * 0.9);
      consciousBasic.sadness = Math.max(0, consciousBasic.sadness - defenses.denial * 0.9);
      // Notice how anxiety does NOT decrease. The body knows.
    }

    // 7. SPLITTING: Polarizing the emotional spectrum. No ambivalence is allowed.
    if (defenses.splitting > 0.5) {
      if (consciousComplex.love > consciousComplex.hostility) {
        // Total idealization
        consciousComplex.love = Math.min(1, consciousComplex.love * 1.3);
        consciousComplex.hostility = 0;
        consciousComplex.trust = Math.min(1, consciousComplex.trust * 1.2);
        consciousBasic.anger = 0;
      } else {
        // Total devaluation
        consciousComplex.hostility = Math.min(1, consciousComplex.hostility * 1.3);
        consciousComplex.love = 0;
        consciousComplex.affection = 0;
        consciousComplex.trust = 0;
      }
    }

    // 8. INTELLECTUALIZATION: The individual knows they "should" be sad or scared,
    // but the emotion is not felt raw. It becomes sterile and logical.
    if (defenses.intellectualization > 0.5) {
      consciousBasic.fear = Math.max(0, consciousBasic.fear - defenses.intellectualization * 0.6);
      consciousBasic.sadness = Math.max(
        0,
        consciousBasic.sadness - defenses.intellectualization * 0.6,
      );
      consciousBasic.anger = Math.max(0, consciousBasic.anger - defenses.intellectualization * 0.6);
      // However, ideological or cognitive hostility may increase
      consciousComplex.hostility = Math.min(
        1,
        consciousComplex.hostility + defenses.intellectualization * 0.2,
      );
    }

    // 9. SOMATIZATION: The pain leaves the mind and goes to the body (generating fatigue and chronic tension).
    if (defenses.somatization > 0.5) {
      consciousBasic.sadness = Math.max(0, consciousBasic.sadness - defenses.somatization * 0.4);
      consciousComplex.burnout = Math.min(
        1,
        consciousComplex.burnout + defenses.somatization * 0.7,
      );
      // CORREÇÃO: Removido o side-effect que mutava artificialmente o banco de dados interno na linha abaixo:
      // this.#state.somatic_tension = Math.min(100, (this.#state.somatic_tension || 0) + defenses.somatization * 10);
    }

    // 10. HUMOR: Reduces the impact of depression and anger through cathartic relief.
    if (defenses.humor > 0.5) {
      consciousComplex.depression = Math.max(0, consciousComplex.depression - defenses.humor * 0.5);
      consciousComplex.anxiety = Math.max(0, consciousComplex.anxiety - defenses.humor * 0.4);
    }

    // 11. CATASTROPHIZING FILTER (The conscious emotion explodes beyond what the body actually feels)
    // If the individual is catastrophizing, conscious fear becomes LARGER than biological fear.
    if (distortions.catastrophizing > 0.5) {
      consciousBasic.fear = Math.min(1, consciousBasic.fear * (1 + distortions.catastrophizing));
      consciousComplex.anxiety = Math.min(
        1,
        consciousComplex.anxiety * (1 + distortions.catastrophizing),
      );
    }

    // 12. MIND READING FILTER (Generates social hostility based on illusion)
    if (distortions.mind_reading > 0.5) {
      consciousComplex.shame = Math.min(1, consciousComplex.shame + distortions.mind_reading * 0.5);
      consciousComplex.hostility = Math.min(
        1,
        consciousComplex.hostility + distortions.mind_reading * 0.4,
      );
    }

    /**
     * Internal formatter to convert raw 0-1 values into 2-decimal percentages.
     * @template {ComplexEmotions|BasicEmotions|DefenseMechanisms|SocialPosture|AttachmentDynamics|ObjectRelations|CognitiveDistortions|PsychiatricVectors|CognitiveState|AutonomicNervousSystem} T
     * @param {T} obj - The emotion object.
     * @returns {T} Formatted object.
     */
    const format = (obj) =>
      // @ts-ignore
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Number((v * 100).toFixed(2))]));

    // Returns the complete emotional spectrum of the personality simulation
    return {
      timestamp: new Date().toISOString(),
      internalState: this.exportData(),
      cognitive_distortions: format(distortions),
      clinical_psychiatry: format(clinicalVectors),
      polyvagal_state: format(polyvagal_state),
      cognition: format(cognition),
      psychologicalStructure: {
        structural_diagnosis: diagnosis,
        defenses: format(defenses),
        social_posture: format(posture),
        attachment_style: format(attachment),
        object_relations: format(objectRelations),
      },
      emotionalSpectrum: {
        unconscious_raw: format(basic), // What the body actually experiences neurologically
        conscious_experienced: format(consciousBasic), // What the ego consciously perceives
        unconscious_complex: format(complex), // Unfiltered cognitive-emotional appraisals
        conscious_complex: format(consciousComplex), // Appraisals after defense mechanisms distort them
      },
    };
  }
}

export default HumanPersonalitySimulator;
