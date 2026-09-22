/**
 * Normalizes course names to allow flexible fuzzy/substring matching
 * between LMS records and certification program rules.
 */
function normalizeString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Finds a matching completion from a learner's transcript for a given requirement.
 */
function findMatchingCompletion(
  condition,
  learner
) {
  const normTarget = normalizeString(condition.courseName);
  
  return learner.completions.find((comp) => {
    const isPlatformMatch = comp.platform === condition.platform;
    const normActual = normalizeString(comp.courseName);
    const isNameMatch =
      normActual === normTarget ||
      normActual.includes(normTarget) ||
      normTarget.includes(normActual);
    return isPlatformMatch && isNameMatch;
  });
}

/**
 * Evaluates a single condition against a learner's transcripts.
 */
function evaluateCondition(
  condition,
  learner
) {
  const completion = findMatchingCompletion(condition, learner);

  if (!completion) {
    return {
      id: condition.id,
      platform: condition.platform,
      courseName: condition.courseName,
      expectedCompletion: condition.completionRequired,
      expectedScore: condition.minimumScore,
      actualCompletion: false,
      actualScore: undefined,
      isSatisfied: false,
      statusReason: 'No completion record found on this platform.',
    };
  }

  if (condition.completionRequired && !completion.completed) {
    return {
      id: condition.id,
      platform: condition.platform,
      courseName: condition.courseName,
      expectedCompletion: true,
      expectedScore: condition.minimumScore,
      actualCompletion: false,
      actualScore: completion.score,
      isSatisfied: false,
      statusReason: 'Course started but not fully marked as completed.',
    };
  }

  if (
    condition.minimumScore !== undefined &&
    (completion.score === undefined || completion.score < condition.minimumScore)
  ) {
    return {
      id: condition.id,
      platform: condition.platform,
      courseName: condition.courseName,
      expectedCompletion: condition.completionRequired,
      expectedScore: condition.minimumScore,
      actualCompletion: completion.completed,
      actualScore: completion.score,
      isSatisfied: false,
      statusReason: `Score ${completion.score ?? 0}% is below the required ${condition.minimumScore}%.`,
    };
  }

  return {
    id: condition.id,
    platform: condition.platform,
    courseName: condition.courseName,
    expectedCompletion: condition.completionRequired,
    expectedScore: condition.minimumScore,
    actualCompletion: true,
    actualScore: completion.score,
    isSatisfied: true,
    statusReason: condition.minimumScore
      ? `Verified completion with passing score of ${completion.score}% (min ${condition.minimumScore}%).`
      : 'Verified completion recorded.',
  };
}

/**
 * Main Rule Evaluation Engine: Evaluates a learner against a Certification Program
 * with 100% explainability.
 */
export function evaluateEligibility(
  program,
  learner
) {
  // Extract conditions from ruleGroups or fallback to milestones
  const conditions =
    program.ruleGroups && program.ruleGroups.conditions.length > 0
      ? program.ruleGroups.conditions
      : program.milestones.map((m) => ({
          id: m.id,
          platform: m.platform,
          courseName: m.courseName,
          completionRequired: m.completionRequired,
          minimumScore: m.minimumScore,
          mandatory: m.mandatory,
        }));

  const evaluations = conditions.map((cond) =>
    evaluateCondition(cond, learner)
  );

  const matchType = program.ruleGroups?.matchType || 'ALL';
  const totalRequirements = evaluations.length;
  const satisfiedRequirements = evaluations.filter((e) => e.isSatisfied).length;

  let isEligible = false;
  if (matchType === 'ALL') {
    isEligible = totalRequirements > 0 && satisfiedRequirements === totalRequirements;
  } else {
    // ANY match type
    isEligible = satisfiedRequirements > 0;
  }

  if (isEligible) {
    return {
      learnerId: learner.id,
      programId: program.id,
      isEligible: true,
      decisionTitle: 'PASS & ISSUE',
      status: 'PASS',
      summary: `${satisfiedRequirements} of ${totalRequirements} required milestone${totalRequirements === 1 ? '' : 's'} satisfied.`,
      totalRequirements,
      satisfiedRequirements,
      evaluations,
      explanation:
        'Fully Qualified — Learner has satisfied all required certification milestones, verification checks, and minimum passing thresholds.',
    };
  }

  // Not eligible: Build concise reason
  const failedEvaluations = evaluations.filter((e) => !e.isSatisfied);
  let failedReason = '';
  if (failedEvaluations.length > 0) {
    const firstFail = failedEvaluations[0];
    if (!firstFail.actualCompletion) {
      failedReason = `Missing requirement: ${firstFail.platform} — "${firstFail.courseName}" is not completed.`;
    } else if (firstFail.expectedScore && firstFail.actualScore !== undefined) {
      failedReason = `Failed score requirement on ${firstFail.platform} ("${firstFail.courseName}"): Achieved ${firstFail.actualScore}%, Required ${firstFail.expectedScore}%.`;
    } else {
      failedReason = `Failed requirement on ${firstFail.platform} — "${firstFail.courseName}".`;
    }
  }

  return {
    learnerId: learner.id,
    programId: program.id,
    isEligible: false,
    decisionTitle: 'NOT ELIGIBLE',
    status: 'FAIL',
    summary: `${satisfiedRequirements} of ${totalRequirements} required milestone${totalRequirements === 1 ? '' : 's'} satisfied.`,
    totalRequirements,
    satisfiedRequirements,
    evaluations,
    explanation:
      'Candidate has not met the mandatory criteria for automated credential issuance.',
    failedReason,
  };
}
