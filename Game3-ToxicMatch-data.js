// TOXIC MATCH - Board-Accurate Categorized Data
// Focuses on high-yield, pathognomonic side effects for STEP 2/3.

const MED_SIDE_EFFECTS = {
  // SSRIs/SNRIs
  "Sertraline": ["Sexual Dysfunction", "Serotonin Syndrome"],
  "Paroxetine": ["Weight Gain", "Anticholinergic", "Teratogenic"],
  "Citalopram": ["QT Prolongation"],
  "Venlafaxine": ["Hypertension"],
  "Duloxetine": ["Hepatotoxicity"],

  // Atypical Antidepressants
  "Bupropion": ["Seizures", "Weight Loss"],
  "Mirtazapine": ["Weight Gain", "Sedation"],
  "Trazodone": ["Priapism", "Sedation"],

  // Antipsychotics
  "Clozapine": ["Agranulocytosis", "Seizures", "Myocarditis", "Metabolic Syndrome"],
  "Olanzapine": ["Weight Gain", "Metabolic Syndrome"],
  "Risperidone": ["Prolactin Elevation", "Gynecomastia", "EPS"],
  "Ziprasidone": ["QT Prolongation"],
  "Quetiapine": ["Sedation", "Orthostatic Hypotension"],
  "Haloperidol": ["EPS", "Tardive Dyskinesia", "NMS"],
  "Thioridazine": ["Retinal Pigmentation"],
  "Chlorpromazine": ["Corneal Deposits"],

  // Mood Stabilizers
  "Lithium": ["Tremor", "Nephrogenic DI", "Hypothyroidism", "Ebstein Anomaly"],
  "Valproate": ["Hepatotoxicity", "Neural Tube Defects", "Thrombocytopenia"],
  "Lamotrigine": ["Stevens-Johnson"],
  "Carbamazepine": ["Agranulocytosis", "SIADH", "Stevens-Johnson"],

  // Others
  "Prazosin": ["Orthostatic Hypotension"],
  "Methylphenidate": ["Decreased Appetite", "Insomnia"],
  "Methadone": ["QT Prolongation", "Respiratory Depression"]
};

// Organized by Clinical System for the UI Grid
const SIDE_EFFECT_CATEGORIES = [
  // ROW 1: CARDIAC / VASCULAR
  "QT Prolongation", "Hypertension", "Orthostatic Hypotension", "Myocarditis",
  
  // ROW 2: NEURO / EPS
  "EPS", "Tardive Dyskinesia", "NMS", "Seizures", "Tremor",
  
  // ROW 3: METABOLIC / ENDO
  "Metabolic Syndrome", "Weight Gain", "Prolactin Elevation", "Hypothyroidism", "Nephrogenic DI",
  
  // ROW 4: HEME / SKIN / MISC
  "Agranulocytosis", "Thrombocytopenia", "Stevens-Johnson", "Hepatotoxicity", "Priapism",
  
  // ROW 5: EYES / REPRO
  "Retinal Pigmentation", "Corneal Deposits", "Sexual Dysfunction", "Teratogenic", "Ebstein Anomaly"
];

const DIFFICULTY_LEVELS = {
  easy: { medsAtOnce: 1, fallSpeed: 4000, name: "Intern" },
  medium: { medsAtOnce: 2, fallSpeed: 3000, name: "Resident" },
  hard: { medsAtOnce: 3, fallSpeed: 2000, name: "Attending" },
  insane: { medsAtOnce: 4, fallSpeed: 1500, name: "Pharmacist" }
};
