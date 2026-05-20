export type SignCategory = 'symptoms' | 'body_parts' | 'procedures' | 'history' | 'conversational';

export interface FSLSign {
  id: string;
  label: string;
  labelFil: string;
  category: SignCategory;
  description: string;
  emoji: string;
}

export const FSL_SIGNS: FSLSign[] = [
  // Symptoms (Medical Vocabulary)
  { id: 'pain', label: 'Pain', labelFil: 'Sakit', category: 'symptoms', description: 'Indicate area of pain', emoji: '😣' },
  { id: 'fever', label: 'Fever', labelFil: 'Lagnat', category: 'symptoms', description: 'High body temperature', emoji: '🤒' },
  { id: 'headache', label: 'Headache', labelFil: 'Sakit ng Ulo', category: 'symptoms', description: 'Head pain or pressure', emoji: '🤕' },
  { id: 'cough', label: 'Cough', labelFil: 'Ubo', category: 'symptoms', description: 'Coughing symptom', emoji: '😮‍💨' },
  { id: 'vomiting', label: 'Vomiting', labelFil: 'Pagsusuka', category: 'symptoms', description: 'Nausea/vomiting', emoji: '🤢' },
  { id: 'dizziness', label: 'Dizziness', labelFil: 'Nahihilo', category: 'symptoms', description: 'Feeling dizzy', emoji: '😵' },
  { id: 'fatigue', label: 'Fatigue', labelFil: 'Pagod', category: 'symptoms', description: 'Extreme tiredness', emoji: '😴' },
  { id: 'swelling', label: 'Swelling', labelFil: 'Pamamaga', category: 'symptoms', description: 'Body part swelling', emoji: '🫸' },
  { id: 'bleeding', label: 'Bleeding', labelFil: 'Pagdurugo', category: 'symptoms', description: 'Bleeding symptom', emoji: '🩸' },
  { id: 'shortness_breath', label: 'Shortness of Breath', labelFil: 'Hirap Huminga', category: 'symptoms', description: 'Difficulty breathing', emoji: '😤' },

  // Body Parts
  { id: 'head', label: 'Head', labelFil: 'Ulo', category: 'body_parts', description: 'Head region', emoji: '🧠' },
  { id: 'chest', label: 'Chest', labelFil: 'Dibdib', category: 'body_parts', description: 'Chest area', emoji: '🫀' },
  { id: 'stomach', label: 'Stomach', labelFil: 'Tiyan', category: 'body_parts', description: 'Stomach/abdomen', emoji: '🫃' },
  { id: 'arm', label: 'Arm', labelFil: 'Braso', category: 'body_parts', description: 'Arm region', emoji: '💪' },
  { id: 'leg', label: 'Leg', labelFil: 'Binti', category: 'body_parts', description: 'Leg region', emoji: '🦵' },
  { id: 'back', label: 'Back', labelFil: 'Likod', category: 'body_parts', description: 'Back area', emoji: '🔙' },
  { id: 'neck', label: 'Neck', labelFil: 'Leeg', category: 'body_parts', description: 'Neck region', emoji: '🫳' },
  { id: 'eye', label: 'Eye', labelFil: 'Mata', category: 'body_parts', description: 'Eye area', emoji: '👁️' },
  { id: 'ear', label: 'Ear', labelFil: 'Tainga', category: 'body_parts', description: 'Ear region', emoji: '👂' },
  { id: 'mouth', label: 'Mouth', labelFil: 'Bibig', category: 'body_parts', description: 'Mouth area', emoji: '👄' },

  // Procedures
  { id: 'surgery', label: 'Surgery', labelFil: 'Operasyon', category: 'procedures', description: 'Surgical procedure', emoji: '🔪' },
  { id: 'injection', label: 'Injection', labelFil: 'Iniksyon', category: 'procedures', description: 'Needle injection', emoji: '💉' },
  { id: 'xray', label: 'X-Ray', labelFil: 'X-Ray', category: 'procedures', description: 'X-ray examination', emoji: '🩻' },
  { id: 'blood_test', label: 'Blood Test', labelFil: 'Pagsusuri ng Dugo', category: 'procedures', description: 'Blood sample test', emoji: '🩸' },
  { id: 'medication', label: 'Medication', labelFil: 'Gamot', category: 'procedures', description: 'Medicine/drugs', emoji: '💊' },
  { id: 'fasting', label: 'Fasting', labelFil: 'Pag-aayuno', category: 'procedures', description: 'No food/drink', emoji: '🚫' },

  // Medical History
  { id: 'allergy', label: 'Allergy', labelFil: 'Alerhi', category: 'history', description: 'Allergic reactions', emoji: '🤧' },
  { id: 'diabetes', label: 'Diabetes', labelFil: 'Diabetes', category: 'history', description: 'Diabetes condition', emoji: '🩺' },
  { id: 'hypertension', label: 'Hypertension', labelFil: 'Mataas na Presyon', category: 'history', description: 'High blood pressure', emoji: '❤️' },
  { id: 'pregnant', label: 'Pregnant', labelFil: 'Buntis', category: 'history', description: 'Pregnancy status', emoji: '🤰' },
  { id: 'miscarriage', label: 'Miscarriage', labelFil: 'Miscarriage', category: 'history', description: 'Pregnancy loss history', emoji: '🏥' },

  // Conversational
  { id: 'salamat', label: 'Thank You', labelFil: 'Salamat Po', category: 'conversational', description: 'Express gratitude', emoji: '🙏' },
  { id: 'magandang_umaga', label: 'Good Morning', labelFil: 'Magandang Umaga', category: 'conversational', description: 'Morning greeting', emoji: '🌅' },
  { id: 'gaano_sakit', label: 'How Much Pain', labelFil: 'Gaano Kasakit', category: 'conversational', description: 'Pain scale question', emoji: '😖' },
  { id: 'oo', label: 'Yes', labelFil: 'Oo', category: 'conversational', description: 'Affirmative response', emoji: '✅' },
  { id: 'hindi', label: 'No', labelFil: 'Hindi', category: 'conversational', description: 'Negative response', emoji: '❌' },
  { id: 'tulong', label: 'Help', labelFil: 'Tulong', category: 'conversational', description: 'Asking for help', emoji: '🆘' },
];

export const SIGN_CATEGORIES: { key: SignCategory; label: string; color: string }[] = [
  { key: 'symptoms', label: 'Symptoms', color: '#F85149' },
  { key: 'body_parts', label: 'Body Parts', color: '#58A6FF' },
  { key: 'procedures', label: 'Procedures', color: '#E3B341' },
  { key: 'history', label: 'Medical History', color: '#BC8CFF' },
  { key: 'conversational', label: 'Conversational', color: '#3FB950' },
];