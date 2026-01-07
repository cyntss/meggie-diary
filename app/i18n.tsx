import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Language = 'en' | 'es';

type TranslationParams = Record<string, number | string>;

type TranslationValue = string | ((params: TranslationParams) => string);

type TranslationDictionary = Record<string, TranslationValue>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
};

const LANGUAGE_STORAGE_KEY = 'meggie-diary-language';

const translations: Record<Language, TranslationDictionary> = {
  en: {
    navHome: 'Home',
    navFaq: 'FAQ',
    navEmergency: 'Emergencys',
    navAriaLabel: 'Primary navigation',
    languageEnglish: 'EN',
    languageSpanish: 'ES',
    homeDiary: "Meggie's diary",
    homeTitle: "Gaby & Steve's sweet Meggie guide",
    homeIntro:
      "Thanks for looking after Meggie — here's her routine at a glance.",
    homeBerlinTime: 'Current time in Berlin:',
    homeRightNow: 'Right now',
    homeActiveItems: ({ count }) =>
      `${count} item${Number(count) === 1 ? '' : 's'} happening now`,
    homeNoActive: 'No scheduled meal',
    homeMarkAsDone: 'Mark as done',
    homeMarkedAsDone: 'Marked as done',
    homeServingWindow: 'Serving window',
    homeTotalGrams: 'Total grams',
    homePriority: 'Priority',
    homeWaiting: 'Waiting',
    homeScheduleEmpty:
      "Nothing on Meggie's schedule right now. We'll show the next item as soon as it begins.",
    homePlanTitle: "Today's plan",
    homeShowDetails: 'Show details',
    homeHideDetails: 'Hide details',
    homeDone: 'Done',
    homeMarkDone: 'Mark done',
    homeTotalLabel: 'g total',
    homeGrams: 'grams',
    scheduleBreakfast: 'Breakfast',
    scheduleTreats: 'Treats',
    scheduleThyroidPills: 'Thyroid pills',
    scheduleSecondMeal: 'Second meal',
    scheduleDinner: 'Dinner',
    scheduleFirstWalk: 'First walk',
    scheduleAfternoonWalk: 'Afternoon walk',
    scheduleLastWalk: 'Last walk',
    scheduleWalk: 'Walk',
    schedulePortions2: '2 portions',
    schedulePortions1: '1 portion',
    scheduleTreats2: '2 treats',
    scheduleTreats1: '1 treat',
    scheduleDoseQuarter: '1/4 dose',
    scheduleWalkTime: 'Walk time',
    scheduleFoodRegularHorse: 'Normal wet food',
    scheduleFoodDiet: 'Diet wet food',
    scheduleFoodGelenke: 'Gelenke treat once per day',
    scheduleFoodTeethClean: 'Teeth cleaning treat',
    scheduleFoodDry: 'Dry food',
    scheduleFoodMorningFirst: 'Morning walk first',
    scheduleFoodPoopGoal: 'Aim for a poop walk',
    scheduleFoodQuickPee: 'Quick pee break',
    labelFood: 'Food',
    labelMedication: 'Medication',
    labelDogWalking: 'Dog walking',
    faqEyebrow: 'Care FAQ',
    faqTitle: 'Frequently asked questions',
    faqIntro:
      "Quick answers to the most common questions about Meggie's daily routine.",
    faqQuestionFeedingOrder:
      'What is the feeding order when schedules overlap?',
    faqAnswerFeedingOrder:
      'Start with the highest priority item first. Use the schedule cards to confirm the time window before marking anything as done.',
    faqQuestionWalkLength: 'How long should walks be?',
    faqAnswerWalkLength:
      'Aim for 15-20 minutes per walk unless otherwise noted. She needs at least one longer walk (around 20 minutes) so she can poop. The afternoon walk can be shorter if needed. Sometimes she can poop, but try to keep her walking a bit, even if it is just 5 minutes. The evening walk can be just a quick pee and return, which is exactly what she needs.',
    faqQuestionPillsRefill: 'The pills are finished. What should I do next?',
    faqAnswerPillsRefill:
      'In the small front pocket of the Gray Bag you will find 2 blisters. Take 3 pills and, using a knife, cut each one into 4 pieces. This will refill the next 6 days, with one day left empty. We always do it this way so we do not accidentally place more than 1 portion (one quarter pill) in a single slot of her pill container box.',
    faqQuestionBags: "What's inside Meggie's bags?",
    faqAnswerBags:
      '- Dog Sana food (12 cans)\n- Diet food (3 cans)\n- Pills in blister packs (2 blisters - in small pocket in front)\n- Pills treat fridge tupperware\n- Pills treat - new bag (in case they run out from the tupperware)\n- Refrigerator food\n- Food and water bowls\n- Scale\n- Container with dry food\n- Container with Gelenke treats\n- Container with teeth treats + 1 new bag\n- Plush toys: Fishy and Donut\n- Round bed\n- Square bed\n- Hall carpet\n- Training treats\n- Poop bags (3)\n- Wet wipes\n- Intimate-area cleaning kit\n- Towel\n- Comb',
    faqQuestionSnowPlay: 'Should she play in the snow?',
    faqAnswerSnowPlay:
      'It is absolutely forbidden for her to play in the snow. She loves it and will try, so please do not follow her lead. Her spine is still in recovery, so she should not run or jump for 6 months. If there is a lot of snow, please check her feet after walks since small snow stones can get stuck between her pads and burn her feet.',
    faqQuestionPoopColor:
      'What should I do if her poop becomes yellow or soft?',
    faqAnswerPoopColor:
      'Please increase the portion of Diet food immediately. You should essentially reverse the current ratios.\n\n- Current:  20g Diet (Hills) / 60g Normal (Dog Sana)\n- Switch to: 60g Diet (Hills) / 20g Normal (Dog Sana)\n\nPlease contact me if you need to make this switch so I can provide further guidance.',
    faqChecklistTitle: 'Quick checklist',
    faqChecklistItemTime: 'Confirm Berlin time before giving meals or meds.',
    faqChecklistItemTasks:
      'Mark tasks done immediately to keep the schedule accurate.',
    faqChecklistItemWhatsApp:
      'Send a quick whatsapp message if anything changes or feels unusual.',
    emergencyEyebrow: 'Support network',
    emergencyTitle: 'Emergency contacts',
    emergencyIntro:
      'Keep these numbers handy in case Meggie needs urgent help.',
    emergencyPrimaryVet: 'Primary veterinarian',
    emergencyClinic: '24/7 emergency clinic',
    emergencyPhoneLabel: 'Phone:',
    emergencyLocationLabel: 'Location:',
    emergencyPrimaryNotes: 'Website: kleintierpraxis-uhlenhorst.de',
    emergencyClinicNotes: 'Go to the website: https://haustierdocs.de/',
    emergencyNotesTitle: 'Emergency notes',
    emergencyNoteBleeding:
      'If there is bleeding, vomiting, or unusual lethargy, call the emergency clinic immediately.',
    emergencyNoteCleaning:
      "If she's cleaning herself too much, please check her vagina area to make sure she doesn't cause irritation to her skin.",
    emergencyNotePoopTitle:
      "If she eats something she shouldn't and has blood in her stool:",
    emergencyNotePoopSignificant:
      'Significant blood: Take her to the vet immediately.',
    emergencyNotePoopSmall:
      'Small trace: Switch to 100% (80gr) Diet food only (NO dry food at night).',
    emergencyNotePoopContact:
      'Please contact me if either occurs, though it is very unlikely.',
    emergencyOnline: 'online',
    errorOops: 'Oops!',
    errorUnexpected: 'An unexpected error occurred.',
    errorNotFound: 'The requested page could not be found.',
    errorError: 'Error',
    welcomeNext: "What's next?",
    welcomeDocs: 'React Router Docs',
    welcomeDiscord: 'Join Discord',
  },
  es: {
    navHome: 'Inicio',
    navFaq: 'FAQ',
    navEmergency: 'Emergencia',
    navAriaLabel: 'Navegación principal',
    languageEnglish: 'EN',
    languageSpanish: 'ES',
    homeDiary: 'Diario de Meggie',
    homeTitle: 'La guía de Meggie para Gaby y Steve',
    homeIntro:
      'Gracias por cuidar de Meggie — aquí está su rutina de un vistazo.',
    homeBerlinTime: 'Hora actual en Berlín:',
    homeRightNow: 'En este momento',
    homeActiveItems: ({ count }) =>
      `${count} elemento${Number(count) === 1 ? '' : 's'} en curso`,
    homeNoActive: 'No hay comida programada',
    homeMarkAsDone: 'Marcar como hecho',
    homeMarkedAsDone: 'Marcado como hecho',
    homeServingWindow: 'Franja de servicio',
    homeTotalGrams: 'Gramos totales',
    homePriority: 'Prioridad',
    homeWaiting: 'En espera',
    homeScheduleEmpty:
      'Ahora mismo no hay nada en el horario de Meggie. Mostraremos el siguiente elemento en cuanto comience.',
    homePlanTitle: 'Plan de hoy',
    homeShowDetails: 'Mostrar detalles',
    homeHideDetails: 'Ocultar detalles',
    homeDone: 'Hecho',
    homeMarkDone: 'Marcar hecho',
    homeTotalLabel: 'g total',
    homeGrams: 'gramos',
    scheduleBreakfast: 'Desayuno',
    scheduleTreats: 'Premios',
    scheduleThyroidPills: 'Pastillas de tiroides',
    scheduleSecondMeal: 'Segunda comida',
    scheduleDinner: 'Cena',
    scheduleFirstWalk: 'Primer paseo',
    scheduleAfternoonWalk: 'Paseo de la tarde',
    scheduleLastWalk: 'Último paseo',
    scheduleWalk: 'Paseo',
    schedulePortions2: '2 porciones',
    schedulePortions1: '1 porción',
    scheduleTreats2: '2 premios',
    scheduleTreats1: '1 premio',
    scheduleDoseQuarter: '1/4 de dosis',
    scheduleWalkTime: 'Tiempo de paseo',
    scheduleFoodRegularHorse: 'Comida húmeda regular',
    scheduleFoodDiet: 'Comida húmeda de dieta',
    scheduleFoodGelenke: 'Premio de articulaciones una vez al día',
    scheduleFoodTeethClean: 'Premio de limpieza dental',
    scheduleFoodDry: 'Comida seca',
    scheduleFoodMorningFirst: 'Primero paseo matutino',
    scheduleFoodPoopGoal: 'Objetivo: paseo para hacer caca',
    scheduleFoodQuickPee: 'Paseo rápido para hacer pis',
    labelFood: 'Comida',
    labelMedication: 'Medicación',
    labelDogWalking: 'Paseo de perros',
    faqEyebrow: 'Preguntas de cuidado',
    faqTitle: 'Preguntas frecuentes',
    faqIntro:
      'Respuestas rápidas a las preguntas más comunes sobre la rutina diaria de Meggie.',
    faqQuestionFeedingOrder:
      '¿Cuál es el orden de alimentación cuando se superponen los horarios?',
    faqAnswerFeedingOrder:
      'Empieza con el elemento de mayor prioridad. Usa las tarjetas de horario para confirmar la franja antes de marcar algo como hecho.',
    faqQuestionWalkLength: '¿Cuánto deben durar los paseos?',
    faqAnswerWalkLength:
      'Apunta a 15-20 minutos por paseo salvo indicación contraria. Necesita al menos un paseo más largo (unos 20 minutos) para que pueda hacer caca. El paseo de la tarde puede ser más corto si es necesario. A veces puede hacer caca, pero intenta que siga caminando un poco, aunque sean solo 5 minutos. El paseo de la noche puede ser solo un pipí rápido y volver, que es exactamente lo que necesita.',
    faqQuestionPillsRefill:
      'Se terminaron las pastillas. ¿Qué debo hacer ahora?',
    faqAnswerPillsRefill:
      'En el bolsillo pequeño delantero de la bolsa gris encontrarás 2 blísteres. Toma 3 pastillas y, con un cuchillo, corta cada una en 4 partes. Esto alcanza para rellenar los próximos 6 días, con un día vacío. Siempre lo hacemos así para no poner por error más de 1 porción (un cuarto de pastilla) en un solo compartimento de su pastillero.',
    faqQuestionBags: '¿Qué hay dentro de las bolsas de Meggie?',
    faqAnswerBags:
      '- Comida Dog Sana (12 latas)\n- Comida dietética (3 latas)\n- Pastillas en blíster (2 blísteres - en bolsillo pequeño delantero)\n- Pasti treat táper de heladera\n- Pasti treat - bolsa nueva\n- Comida de heladera\n- Platos de comida y agua\n- Balanza\n- Táper con comida Dry\n- Táper con Gelenkes\n- Táper con teeth treats y 1 bolsa nueva\n- Peluches: Fishy y Donut\n- Cama redonda\n- Cama cuadrada\n- Carpet hall\n- Treats training\n- Bolsas de caca (3)\n- Wet wipes\n- Kit limpieza zona vaginal\n- Toalla\n- Peine',
    faqQuestionSnowPlay: '¿Debe jugar en la nieve?',
    faqAnswerSnowPlay:
      'Está absolutamente prohibido que juegue en la nieve. Le encanta y lo intentará, así que por favor no sigas su ejemplo. Su columna aún se está recuperando, por lo que no debe correr ni saltar durante 6 meses. Si hay mucha nieve, revisa sus patas después de los paseos porque pequeñas bolitas de nieve pueden quedarse entre las almohadillas y quemarle las patas.',
    faqQuestionPoopColor:
      '¿Qué debo hacer si su caca se vuelve amarilla o blanda?',
    faqAnswerPoopColor:
      'Por favor aumenta la porción de comida Diet inmediatamente. Básicamente debes invertir las proporciones actuales.\n\n- Actual: 20g Diet (Hills) / 60g Normal (Dog Sana)\n- Cambiar a: 60g Diet (Hills) / 20g Normal (Dog Sana)\n\nPor favor contáctame si necesitas hacer este cambio para poder orientarte.',
    faqChecklistTitle: 'Lista rápida',
    faqChecklistItemTime:
      'Confirma la hora de Berlín antes de dar comidas o medicinas.',
    faqChecklistItemTasks:
      'Marca las tareas como hechas de inmediato para mantener el horario actualizado.',
    faqChecklistItemWhatsApp:
      'Envía un mensaje rápido por WhatsApp si algo cambia o se siente inusual.',
    emergencyEyebrow: 'Red de apoyo',
    emergencyTitle: 'Contactos de emergencia',
    emergencyIntro:
      'Ten estos números a mano por si Meggie necesita ayuda urgente.',
    emergencyPrimaryVet: 'Veterinario principal',
    emergencyClinic: 'Clínica de emergencia 24/7',
    emergencyPhoneLabel: 'Teléfono:',
    emergencyLocationLabel: 'Ubicación:',
    emergencyPrimaryNotes: 'Sitio web: kleintierpraxis-uhlenhorst.de',
    emergencyClinicNotes: 'Visita el sitio web: https://haustierdocs.de/',
    emergencyNotesTitle: 'Notas de emergencia',
    emergencyNoteBleeding:
      'Si hay sangrado, vómitos o letargo inusual, llama a la clínica de emergencia de inmediato.',
    emergencyNoteCleaning:
      'Si se está limpiando demasiado, revisa el área de su vagina para asegurarte de que no cause irritación en la piel.',
    emergencyNotePoopTitle:
      'Si come algo que no debería y tiene sangre en sus heces:',
    emergencyNotePoopSignificant:
      'Sangrado significativo: llévala al veterinario de inmediato.',
    emergencyNotePoopSmall:
      'Rastro pequeño: cambia a 100% (80gr) comida Dietetica solamente (SIN comida seca a la noche).',
    emergencyNotePoopContact:
      'Por favor contáctame si ocurre cualquiera de los dos, aunque es muy poco probable.',
    emergencyOnline: 'en línea',
    errorOops: '¡Ups!',
    errorUnexpected: 'Ocurrió un error inesperado.',
    errorNotFound: 'No se pudo encontrar la página solicitada.',
    errorError: 'Error',
    welcomeNext: '¿Qué sigue?',
    welcomeDocs: 'Documentación de React Router',
    welcomeDiscord: 'Únete a Discord',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'es') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: string, params: TranslationParams = {}) => {
      const value = translations[language][key] ?? translations.en[key];
      if (typeof value === 'function') {
        return value(params);
      }
      return value ?? key;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
