import { FuzzySet, MamdaniInferenceSystem } from 'tiny-essentials';

/**
 * @typedef {Object} InternalFeelingStates
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
 * @property {number} guilt - Deep remorse for violating internalized moral codes (0-1).
 * @property {number} longing - Melancholic desire or nostalgia (Saudade) (0-1).
 * @property {number} depression - Persistent state of low mood and aversion to activity (0-1).
 * @property {number} love - Deep affection and romantic attachment (0-1).
 * @property {number} anxiety - Anticipatory dread and somatic tension (0-1).
 * @property {number} burnout - State of emotional, physical, and mental exhaustion (0-1).
 * @property {number} envy - Resentful longing for someone else's traits/status (0-1).
 * @property {number} shame - Painful feeling of humiliation or distress (0-1).
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
 * @typedef {Object} EmotionalState
 * @property {{ unconscious_raw: BasicEmotions; conscious_experienced: BasicEmotions; unconscious_complex: ComplexEmotions; conscious_complex: ComplexEmotions; }} emotionalSpectrum
 * @property {{ defenses: DefenseMechanisms; social_posture: SocialPosture; attachment_style: AttachmentDynamics }} psychologicalStructure
 * @property {InternalFeelingStates} internalState
 * @property {string} timestamp - ISO string of the exact moment the state was processed.
 */

/**
 * @typedef {Object} DefenseMechanisms
 * @property {number} repression - Unconscious blocking of unacceptable emotions (0-1).
 * @property {number} projection - Attributing one's own unacceptable feelings to others (0-1).
 * @property {number} sublimation - Channeling unacceptable impulses into constructive behaviors (0-1).
 * @property {number} dissociation - Disconnecting from thoughts, feelings, or sense of identity to avoid pain (0-1).
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
    superego_strength: 50,
    ego_strength: 50,
    libido: 50,
    death_drive: 20,
    serotonin: 50,
    dopamine: 50,
    cortisol: 20,
    oxytocin: 50,
    adrenaline: 20,
    gaba: 50,
    memory_intensity: 0,
    affective_distance: 50,
    social_interaction: 50,
    sleep_quality: 50,
    sensory_aversion: 0,
    social_comparison: 0,
    social_judgment: 0,
    goal_blockage: 0,
    future_outlook: 50,
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
   * @param {number|string} value - The raw input value.
   * @returns {number} The clamped value between 0 and 100.
   */
  #clamp(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
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
    ].forEach((name) => {
      this.engine.addVariable(name, defaultSets);
    });
  }

  // ==========================================
  // EMOTIONAL PROCESSING
  // ==========================================

  /**
   * Engine for calculating Psychoanalytic Defense Mechanisms.
   * Defenses are mobilized when the Ego is threatened by intense basic/complex emotions,
   * modulated by the inherent Ego Strength and Unconscious Drives.
   * @param {BasicEmotions} basic
   * @param {ComplexEmotions} complex
   * @returns {DefenseMechanisms}
   */
  _calculateDefenseMechanisms(basic, complex) {
    const egoStrong = this.engine.getVariable('ego_strength')[2].calculate(this.ego_strength);
    const egoWeak = this.engine.getVariable('ego_strength')[0].calculate(this.ego_strength);

    const erosHigh = this.engine.getVariable('libido')[2].calculate(this.libido);
    const thanatosHigh = this.engine.getVariable('death_drive')[2].calculate(this.death_drive);

    const distress = Math.max(basic.fear, basic.sadness, complex.anxiety, complex.shame);

    // Repression: Triggered by high distress but a weak/moderate ego trying to cope.
    // It pushes the emotion down, but often increases internal cortisol (anxiety).
    const repression = Math.min(1, distress * 0.6 + egoWeak * 0.4);

    // Projection: Taking internal hostility or shame and blaming the outside world.
    // Highly correlated with low ego strength and high Thanatos (Death Drive).
    const projection = Math.min(
      1,
      complex.hostility * 0.4 + complex.shame * 0.3 + thanatosHigh * 0.3,
    );

    // Sublimation: A mature defense. Taking high distress or high anger/passion
    // and turning it into something useful. Requires high Ego Strength and high Libido.
    const sublimation = Math.min(
      1,
      (basic.anger + complex.desire) * 0.3 + egoStrong * 0.4 + erosHigh * 0.3,
    );

    // Dissociation: A primitive defense against extreme trauma/fear when the Ego completely collapses.
    const dissociation = Math.min(1, basic.fear * 0.5 + complex.burnout * 0.3 + egoWeak * 0.4);

    return { repression, projection, sublimation, dissociation };
  }

  /**
   * Engine for calculating Interpersonal/Social Postures.
   * Determines how the human behaves in a group setting (Submission vs Dominance).
   * @param {BasicEmotions} basic
   * @param {ComplexEmotions} complex
   * @returns {SocialPosture}
   */
  _calculateSocialPosture(basic, complex) {
    const egoStrong = this.engine.getVariable('ego_strength')[2].calculate(this.ego_strength);
    const egoWeak = this.engine.getVariable('ego_strength')[0].calculate(this.ego_strength);

    const adrElevated = this.engine.getVariable('adrenaline')[1].calculate(this.adrenaline);
    const dopHigh = this.engine.getVariable('dopamine')[2].calculate(this.dopamine);
    const compHigh = this.engine
      .getVariable('social_comparison')[2]
      .calculate(this.socialComparison); // Feeling inferior

    // Dominance: Requires confidence (ego), reward drive (dopamine), and assertiveness (adrenaline/anger).
    const dominance = Math.min(
      1,
      egoStrong * 0.4 + dopHigh * 0.3 + (basic.anger + adrElevated) * 0.3,
    );

    // Submission (Fawning/Appeasement): Triggered when feeling inferior (high comparison),
    // facing threat (fear), lacking defense capability (weak ego), and desperate for bonding/mercy (oxytocin).
    const submission = Math.min(
      1,
      compHigh * 0.4 + basic.fear * 0.3 + egoWeak * 0.2 + complex.affection * 0.1,
    );

    // Withdrawal (Isolamento): Complete social retreat. High burnout, aversion, and depression.
    const withdrawal = Math.min(
      1,
      complex.burnout * 0.4 + complex.aversion * 0.3 + complex.depression * 0.3,
    );

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

    const happinessLevel = Math.max(
      0,
      ser[1].calculate(this.serotonin) * 0.4 +
        dop[2].calculate(this.dopamine) * 0.6 -
        cor[2].calculate(this.cortisol) * 0.4,
    );
    const angerLevel = Math.min(
      1,
      cor[2].calculate(this.cortisol) * 0.5 +
        adr[1].calculate(this.adrenaline) * 0.3 +
        gab[0].calculate(this.gaba) * 0.2,
    );
    const sadnessLevel = Math.min(
      1,
      ser[0].calculate(this.serotonin) * 0.7 + cor[2].calculate(this.cortisol) * 0.3,
    );
    const fearLevel = Math.max(
      0,
      Math.min(
        1,
        adr[2].calculate(this.adrenaline) * 0.6 +
          cor[2].calculate(this.cortisol) * 0.4 -
          gab[2].calculate(this.gaba) * 0.5,
      ),
    );
    const disgustLevel = Math.min(
      1,
      avr[2].calculate(this.sensoryAversion) * 0.8 + gab[0].calculate(this.gaba) * 0.2,
    );
    const interestLevel = Math.min(
      1,
      dop[2].calculate(this.dopamine) * 0.6 + adr[1].calculate(this.adrenaline) * 0.4,
    );
    const boredomLevel = Math.min(
      1,
      dop[0].calculate(this.dopamine) * 0.5 +
        adr[0].calculate(this.adrenaline) * 0.3 +
        soc[0].calculate(this.socialInteraction) * 0.2,
    );

    return {
      happiness: happinessLevel,
      anger: angerLevel,
      sadness: sadnessLevel,
      fear: fearLevel,
      disgust: disgustLevel,
      interest: interestLevel,
      boredom: boredomLevel,
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
      .calculate(this.superego_strength);
    const thanatosHigh = this.engine.getVariable('death_drive')[2].calculate(this.death_drive);

    const mem = this.engine.getVariable('memory_intensity')[2].calculate(this.memoryIntensity);
    const dist = this.engine.getVariable('affective_distance')[2].calculate(this.affectiveDistance); // High distance
    const closeDist = this.engine
      .getVariable('affective_distance')[0]
      .calculate(this.affectiveDistance); // Low distance

    const oxyLow = this.engine.getVariable('oxytocin')[0].calculate(this.oxytocin);
    const oxyHigh = this.engine.getVariable('oxytocin')[2].calculate(this.oxytocin);

    const dopHigh = this.engine.getVariable('dopamine')[2].calculate(this.dopamine);
    const dopLow = this.engine.getVariable('dopamine')[0].calculate(this.dopamine);
    const serLow = this.engine.getVariable('serotonin')[0].calculate(this.serotonin);
    const serHigh = this.engine.getVariable('serotonin')[2].calculate(this.serotonin);

    const corHigh = this.engine.getVariable('cortisol')[2].calculate(this.cortisol);
    const gabHigh = this.engine.getVariable('gaba')[2].calculate(this.gaba);
    const adrSpike = this.engine.getVariable('adrenaline')[2].calculate(this.adrenaline);

    const compHigh = this.engine
      .getVariable('social_comparison')[2]
      .calculate(this.socialComparison);
    const judgHigh = this.engine.getVariable('social_judgment')[2].calculate(this.socialJudgment);
    const blockHigh = this.engine.getVariable('goal_blockage')[2].calculate(this.goalBlockage);
    const futureBright = this.engine.getVariable('future_outlook')[2].calculate(this.futureOutlook);

    // ==========================================
    // PSYCHOLOGICAL APPRAISALS
    // ==========================================

    const longing = Math.min(1, mem * 0.4 + dist * 0.4 + basic.sadness * 0.2);
    const depression = Math.min(1, serLow * 0.4 + dopLow * 0.3 + basic.sadness * 0.3);
    const love = Math.min(1, oxyHigh * 0.5 + dopHigh * 0.3 + closeDist * 0.2);
    const anxiety = Math.min(
      1,
      corHigh * 0.5 +
        this.engine.getVariable('gaba')[0].calculate(this.gaba) * 0.3 +
        basic.fear * 0.2,
    );
    const burnout = Math.min(
      1,
      corHigh * 0.4 +
        this.engine.getVariable('sleep_quality')[0].calculate(this.sleepQuality) * 0.4 +
        serLow * 0.2,
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
    const hope = Math.min(1, futureBright * 0.5 + dopHigh * 0.3 + serHigh * 0.2);
    const passion = Math.min(1, adrSpike * 0.4 + dopHigh * 0.3 + oxyHigh * 0.3); // High arousal, reward, and bonding
    const desire = Math.min(1, dopHigh * 0.5 + mem * 0.3 + serLow * 0.2); // Anticipation of reward + memory + a sense of lack (low serotonin)

    return {
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
   * Processes the internal state and returns the full personality/emotion profile.
   * Formats all fractional values (0-1) into standardized percentages (0-100%).
   * @returns {EmotionalState} Full emotional spectrum analysis.
   */
  processEmotionalState() {
    const basic = this._calculateBasicEmotions();
    const complex = this._calculateComplexEmotions(basic);

    // Core Psychological Structures
    const defenses = this._calculateDefenseMechanisms(basic, complex);
    const posture = this._calculateSocialPosture(basic, complex);
    const attachment = this._calculateAttachmentDynamics(basic, complex);

    // PSYCHOANALYTIC MASKING: Simulating the Ego's defense mechanisms altering conscious perception.
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

    /**
     * Internal formatter to convert raw 0-1 values into 2-decimal percentages.
     * @template {ComplexEmotions|BasicEmotions|DefenseMechanisms|SocialPosture|AttachmentDynamics} T
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
      psychologicalStructure: {
        defenses: format(defenses),
        social_posture: format(posture),
        attachment_style: format(attachment),
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
