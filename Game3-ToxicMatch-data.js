// TOXIC MATCH - Psych Meds & Side Effects
// High-yield meds for shelf/rotation

const MED_SIDE_EFFECTS = {
  // SSRIs
  "Fluoxetine": ["Sexual Dysfunction", "GI Upset", "Serotonin Syndrome", "Weight Changes"],
  "Sertraline": ["Sexual Dysfunction", "GI Upset", "Serotonin Syndrome", "Insomnia"],
  "Escitalopram": ["Sexual Dysfunction", "GI Upset", "Serotonin Syndrome", "QT Prolongation"],
  "Paroxetine": ["Sexual Dysfunction", "GI Upset", "Weight Gain", "Anticholinergic"],
  "Citalopram": ["Sexual Dysfunction", "GI Upset", "QT Prolongation", "Serotonin Syndrome"],
  
  // SNRIs
  "Venlafaxine": ["Hypertension", "Sexual Dysfunction", "Nausea", "Serotonin Syndrome"],
  "Duloxetine": ["Nausea", "Sexual Dysfunction", "Hepatotoxicity", "Hypertension"],
  
  // Atypical Antidepressants
  "Bupropion": ["Seizures", "Agitation", "Weight Loss", "Insomnia"],
  "Mirtazapine": ["Weight Gain", "Sedation", "Increased Appetite", "Dry Mouth"],
  "Trazodone": ["Sedation", "Priapism", "Orthostatic Hypotension", "QT Prolongation"],
  
  // TCAs
  "Amitriptyline": ["Anticholinergic", "Cardiotoxic", "Sedation", "Weight Gain"],
  "Nortriptyline": ["Anticholinergic", "Cardiotoxic", "Orthostatic Hypotension", "Dry Mouth"],
  "Imipramine": ["Anticholinergic", "Cardiotoxic", "Urinary Retention", "Sedation"],
  
  // MAOIs
  "Phenelzine": ["Hypertensive Crisis", "Tyramine Reaction", "Weight Gain", "Sexual Dysfunction"],
  "Tranylcypromine": ["Hypertensive Crisis", "Tyramine Reaction", "Insomnia", "Orthostatic Hypotension"],
  
  // Typical Antipsychotics
  "Haloperidol": ["EPS", "Tardive Dyskinesia", "NMS", "QT Prolongation"],
  "Fluphenazine": ["EPS", "Tardive Dyskinesia", "Akathisia", "NMS"],
  "Chlorpromazine": ["Sedation", "Anticholinergic", "Orthostatic Hypotension", "EPS"],
  
  // Atypical Antipsychotics
  "Clozapine": ["Agranulocytosis", "Seizures", "Myocarditis", "Weight Gain"],
  "Olanzapine": ["Weight Gain", "Metabolic Syndrome", "Sedation", "Diabetes"],
  "Risperidone": ["Prolactin Elevation", "EPS", "Weight Gain", "Orthostatic Hypotension"],
  "Quetiapine": ["Sedation", "Weight Gain", "Orthostatic Hypotension", "Cataracts"],
  "Aripiprazole": ["Akathisia", "Nausea", "Insomnia", "Weight Neutral"],
  "Ziprasidone": ["QT Prolongation", "Akathisia", "Weight Neutral", "Sedation"],
  "Lurasidone": ["Akathisia", "Nausea", "Weight Neutral", "EPS"],
  "Paliperidone": ["Prolactin Elevation", "EPS", "Weight Gain", "Tachycardia"],
  
  // Mood Stabilizers
  "Lithium": ["Tremor", "Nephrogenic DI", "Hypothyroidism", "Teratogenic"],
  "Valproate": ["Hepatotoxicity", "Teratogenic", "Weight Gain", "Thrombocytopenia"],
  "Carbamazepine": ["Agranulocytosis", "SIADH", "Stevens-Johnson", "Hepatotoxicity"],
  "Lamotrigine": ["Stevens-Johnson", "Rash", "Dizziness", "Headache"],
  
  // Benzodiazepines
  "Lorazepam": ["Sedation", "Dependence", "Respiratory Depression", "Amnesia"],
  "Alprazolam": ["Sedation", "Dependence", "Rebound Anxiety", "Withdrawal"],
  "Clonazepam": ["Sedation", "Dependence", "Ataxia", "Cognitive Impairment"],
  "Diazepam": ["Sedation", "Dependence", "Respiratory Depression", "Hepatic Metabolism"],
  
  // Stimulants
  "Methylphenidate": ["Insomnia", "Decreased Appetite", "Growth Suppression", "Tachycardia"],
  "Amphetamine": ["Insomnia", "Decreased Appetite", "Hypertension", "Psychosis"],
  "Lisdexamfetamine": ["Insomnia", "Decreased Appetite", "Cardiovascular Effects", "Dry Mouth"],
  "Atomoxetine": ["Decreased Appetite", "Nausea", "Hepatotoxicity", "Suicidality"],
  
  // Others
  "Buspirone": ["Dizziness", "Nausea", "Headache", "Nervousness"],
  "Hydroxyzine": ["Sedation", "Anticholinergic", "QT Prolongation", "Dry Mouth"],
  "Naltrexone": ["Nausea", "Headache", "Hepatotoxicity", "Insomnia"],
  "Acamprosate": ["Diarrhea", "Nausea", "Headache", "Insomnia"],
  "Disulfiram": ["Hepatotoxicity", "Alcohol Reaction", "Neuropathy", "Metallic Taste"],
  "Buprenorphine": ["Sedation", "Respiratory Depression", "Constipation", "Hepatotoxicity"],
  "Methadone": ["Sedation", "QT Prolongation", "Respiratory Depression", "Constipation"],
  "Modafinil": ["Insomnia", "Headache", "Nausea", "Stevens-Johnson"],
  "Prazosin": ["Orthostatic Hypotension", "Dizziness", "Headache", "Drowsiness"]
};

// All unique side effects for the buckets at bottom
const SIDE_EFFECT_CATEGORIES = [
  "Sexual Dysfunction",
  "GI Upset",
  "Serotonin Syndrome",
  "Weight Gain",
  "Sedation",
  "EPS",
  "Tardive Dyskinesia",
  "Anticholinergic",
  "Cardiotoxic",
  "Hypertensive Crisis",
  "Agranulocytosis",
  "Seizures",
  "Metabolic Syndrome",
  "Prolactin Elevation",
  "QT Prolongation",
  "Tremor",
  "Nephrogenic DI",
  "Hypothyroidism",
  "Teratogenic",
  "Hepatotoxicity",
  "Stevens-Johnson",
  "Dependence",
  "Respiratory Depression",
  "Insomnia",
  "Decreased Appetite",
  "Hypertension",
  "Orthostatic Hypotension",
  "NMS",
  "Akathisia",
  "Weight Loss",
  "Priapism",
  "Myocarditis",
  "Nausea",
  "Tyramine Reaction"
];

// Difficulty levels - how many meds fall at once
const DIFFICULTY_LEVELS = {
  easy: { medsAtOnce: 1, fallSpeed: 3000, name: "Intern" },
  medium: { medsAtOnce: 2, fallSpeed: 2500, name: "Resident" },
  hard: { medsAtOnce: 3, fallSpeed: 2000, name: "Attending" },
  insane: { medsAtOnce: 4, fallSpeed: 1500, name: "Pharmacist" }
};

// Get random med
function getRandomMed() {
  const meds = Object.keys(MED_SIDE_EFFECTS);
  return meds[Math.floor(Math.random() * meds.length)];
}

// Check if med matches side effect
function isCorrectMatch(med, sideEffect) {
  return MED_SIDE_EFFECTS[med] && MED_SIDE_EFFECTS[med].includes(sideEffect);
}
