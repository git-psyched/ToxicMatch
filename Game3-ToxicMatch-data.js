const MED_SIDE_EFFECTS = {
  "Sertraline": ["Sexual Dysfunction", "Serotonin Syndrome"],
  "Paroxetine": ["Weight Gain", "Anticholinergic", "Teratogenic"],
  "Citalopram": ["QT Prolongation"],
  "Venlafaxine": ["Hypertension"],
  "Duloxetine": ["Hepatotoxicity"],
  "Bupropion": ["Seizures", "Weight Loss"],
  "Mirtazapine": ["Weight Gain", "Sedation"],
  "Trazodone": ["Priapism", "Sedation"],
  "Clozapine": ["Agranulocytosis", "Seizures", "Myocarditis", "Metabolic Syndrome"],
  "Olanzapine": ["Weight Gain", "Metabolic Syndrome"],
  "Risperidone": ["Prolactin Elevation", "Gynecomastia", "EPS"],
  "Ziprasidone": ["QT Prolongation"],
  "Quetiapine": ["Sedation", "Orthostatic Hypotension"],
  "Haloperidol": ["EPS", "Tardive Dyskinesia", "NMS"],
  "Lithium": ["Tremor", "Nephrogenic DI", "Hypothyroidism", "Ebstein Anomaly"],
  "Valproate": ["Hepatotoxicity", "Neural Tube Defects", "Thrombocytopenia"],
  "Lamotrigine": ["Stevens-Johnson"],
  "Carbamazepine": ["Agranulocytosis", "SIADH", "Stevens-Johnson"],
  "Methadone": ["QT Prolongation", "Respiratory Depression"]
};

const SIDE_EFFECT_GROUPS = {
  "Cardiac/Vascular": ["QT Prolongation", "Hypertension", "Orthostatic Hypotension", "Myocarditis"],
  "Neuro/EPS": ["EPS", "Tardive Dyskinesia", "NMS", "Seizures", "Tremor"],
  "Metabolic/Endo": ["Metabolic Syndrome", "Weight Gain", "Weight Loss", "Prolactin Elevation"],
  "Heme/Renal": ["Agranulocytosis", "Thrombocytopenia", "Nephrogenic DI", "Hepatotoxicity"],
  "Systemic/Other": ["Stevens-Johnson", "Priapism", "Retinal Pigmentation", "Ebstein Anomaly"]
};

const DIFFICULTY_LEVELS = {
  easy: { name: "Intern", spawnRate: 6000, speed: 0.25, lives: 5 },
  medium: { name: "Resident", spawnRate: 4000, speed: 0.5, lives: 3 },
  hard: { name: "Attending", spawnRate: 2500, speed: 0.9, lives: 1 }
};
