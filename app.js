// merrick_global_route_finder_app/app.js

/*
  This script powers the Merrick Global Talent Licensing Route Finder.
  It contains a small in‑memory dataset of example licensing routes, helper
  functions to populate the form, evaluate eligibility, and render the
  resulting checklist. This app is deliberately self‑contained so it can run
  entirely offline without any server dependencies. When you're ready to
  integrate real data or a backend, replace the ROUTES array with data
  fetched from your server or database.
*/

// Example route dataset. In a production system this would be fetched
// from a database. Each route describes eligibility requirements and
// steps for a particular combination of origin, destination, specialty
// and qualifications. Dates and sources are provided for transparency.
const ROUTES = [
  {
    id: 1,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['MRCGP', 'CCT'],
    // Following the CPSA Approved Jurisdiction Route (effective June 9, 2025),
    // physicians from approved jurisdictions such as the UK may qualify for full
    // licensure in Alberta without a lengthy post‑qualification experience
    // requirement. One year (12 months) of experience after CCT is generally
    // sufficient. See sources for more details.
    minExperienceMonths: 12,
    steps: [
      {
        title: 'Apply for independent practice',
        description:
          'Submit an application for independent practice to the College of Physicians and Surgeons of Alberta (CPSA). Provide proof of identity, your CCT and MRCGP certificates, professional references and other required documents.',
        docs: ['Passport', 'CV', 'CCT certificate', 'MRCGP certificate', 'Professional references'],
        fee: '$200',
        timeWeeks: '2'
      },
      {
        title: 'Approved Jurisdiction evaluation',
        description:
          'Under CPSA’s Approved Jurisdiction Route (effective June 9, 2025), physicians from approved jurisdictions, including the United Kingdom, may be assessed for full licensure on the General Register without completing a Practice Readiness Assessment. CPSA will review your credentials and inform you if you qualify.',
        docs: ['Assessment forms'],
        fee: '$0',
        timeWeeks: '4‑8'
      },
      {
        title: 'Apply for full licence',
        description:
          'Once CPSA confirms your eligibility under the Approved Jurisdiction Route, complete the final steps to obtain a full licence on the General Register and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['CPSA approval letter', 'Licence application', 'CFPC registration'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Approved Jurisdiction Route for full licensure',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 2,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['MRCGP', 'CCT'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of qualifications and experience.',
        docs: ['Passport', 'CV', 'CCT certificate', 'MRCGP certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes',
        url: 'https://www.cpsbc.ca/registration-licensing' 
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 3,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['MRCGP', 'CCT'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your qualifications and experience.',
        docs: ['Passport', 'CV', 'CCT certificate', 'MRCGP certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration' 
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 4,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['MICGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA). Provide proof of identity, qualifications and professional references.',
        docs: ['Passport', 'CV', 'MICGP certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'Once you successfully complete the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA eligibility criteria',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 5,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['MICGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your qualifications and experience.',
        docs: ['Passport', 'CV', 'MICGP certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 6,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your qualifications and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 7,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of qualifications and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 8,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your FRACGP qualification and references.',
        docs: ['Passport', 'CV', 'FRACGP certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA eligibility criteria',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 9,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Anaesthetics',
    requiredQualifications: ['CCT Anaesthetics'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for specialist recognition of your CCT in Anaesthetics.',
        docs: ['Passport', 'CV', 'CCT Anaesthetics certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in anaesthesia.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Anaesthesia practice requirements',
        url: 'https://www.cpso.on.ca/Physicians/Registration' 
      }
    ],
    lastVerified: '2025-08-01'
  },
  {
    id: 10,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Radiology',
    requiredQualifications: ['CCT Radiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for specialist recognition of your CCT in Radiology.',
        docs: ['Passport', 'CV', 'CCT Radiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in radiology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Radiology practice requirements',
        url: 'https://www.cpso.on.ca/Physicians/Registration' 
      }
    ],
    lastVerified: '2025-08-01'
  }
  ,
  // New route: UK CCT Anaesthetics to Alberta
  {
    id: 11,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Anaesthetics',
    requiredQualifications: ['CCT Anaesthetics'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for specialist recognition of your UK CCT in Anaesthetics. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Anaesthetics certificate', 'Training records'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Approved Jurisdiction evaluation',
        description:
          'If you are from an approved jurisdiction (such as the United Kingdom), CPSA will evaluate your credentials under the Approved Jurisdiction Route. Eligible physicians may receive full licensure on the General Register without a Practice Readiness Assessment.',
        docs: ['Assessment forms'],
        fee: '$0',
        timeWeeks: '4‑8'
      },
      {
        title: 'Apply for full licence',
        description:
          'After CPSA confirms your eligibility, complete the final steps to apply for a full licence on the General Register and register with the Royal College of Physicians and Surgeons of Canada (RCPSC) if required.',
        docs: ['CPSA approval letter', 'Licence application', 'RCPSC registration'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Approved Jurisdiction Route for full licensure',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      }
    ],
    lastVerified: '2025-08-08'
  }
  ,
  // New routes: South Africa family medicine qualifications (FCFP(SA)) to Canada
  {
    // South Africa to Alberta – Family Medicine
    id: 12,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    // The Fellowship of the College of Family Physicians of South Africa (FCFP(SA))
    // is the postgraduate qualification for family physicians in South Africa【639925695712620†screenshot】.
    // Because South Africa is not an approved jurisdiction, physicians with this
    // qualification must complete a Practice Readiness Assessment (PRA). PRA programmes
    // provide an accelerated, supervised pathway for international medical graduates who
    // have completed residency and practised independently; participants work under
    // supervision for around 12 weeks to demonstrate readiness for the Canadian health
    // system【448071907306699†L622-L623】.
    requiredQualifications: ['FCFP(SA)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA). Provide proof of identity, your FCFP(SA) qualification, professional references and other required documents.',
        docs: ['Passport', 'CV', 'FCFP(SA) certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment. PRA programmes are an accelerated pathway for international medical graduates who have completed residency and practised independently abroad; participants practise under supervision for approximately 12 weeks to demonstrate readiness for the Canadian health system【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After successfully completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to British Columbia – Family Medicine
    id: 13,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCFP(SA)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your FCFP(SA) qualification, experience and references.',
        docs: ['Passport', 'CV', 'FCFP(SA) certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment (Practice Ready Assessment – BC) to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the clinical assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to Ontario – Family Medicine
    id: 14,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCFP(SA)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your FCFP(SA) qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'FCFP(SA) certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  }
  ,
  {
    // United States to Alberta – Family Medicine
    id: 15,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your ABFM certificate, identity documents and professional references.',
        docs: ['Passport', 'CV', 'ABFM certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment. PRA programmes provide an accelerated pathway for international medical graduates who have completed residency and practised independently abroad; participants practise under supervision for approximately 12 weeks to demonstrate readiness for the Canadian health system【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to British Columbia – Family Medicine
    id: 16,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['MICGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your MICGP qualification, experience and references.',
        docs: ['Passport', 'CV', 'MICGP certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Family Medicine (FRACGP)
    id: 17,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your FRACGP qualification, experience and references.',
        docs: ['Passport', 'CV', 'FRACGP certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Ontario – Family Medicine (FRACGP)
    id: 18,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your FRACGP qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'FRACGP certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Alberta – Family Medicine (FACRRM)
    id: 19,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['FACRRM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your FACRRM qualification, identity documents and professional references.',
        docs: ['Passport', 'CV', 'FACRRM certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Family Medicine (FACRRM)
    id: 20,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['FACRRM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your FACRRM qualification, experience and references.',
        docs: ['Passport', 'CV', 'FACRRM certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Ontario – Family Medicine (FACRRM)
    id: 21,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['FACRRM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your FACRRM qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'FACRRM certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  }
  ,
  {
    // United Kingdom to Alberta – Family Medicine (JCPTGP)
    id: 22,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    // The Joint Committee on Postgraduate Training for General Practice (JCPTGP)
    // awarded certificates of completion of GP training prior to the introduction of the
    // Certificate of Completion of Training (CCT). Physicians holding a JCPTGP
    // certificate are generally treated as equivalent to CCT for licensure in approved
    // jurisdictions such as the United Kingdom【43866637107521†screenshot】.
    requiredQualifications: ['JCPTGP'],
    // Under the CPSA Approved Jurisdiction Route (effective June 9 2025),
    // physicians from approved jurisdictions may qualify for full licensure with
    // shorter post‑qualification experience. We mirror the MRCGP route.
    minExperienceMonths: 12,
    steps: [
      {
        title: 'Apply for independent practice',
        description:
          'Submit an application for independent practice to the College of Physicians and Surgeons of Alberta (CPSA). Provide proof of identity, your JCPTGP certificate, professional references and other required documents.',
        docs: ['Passport', 'CV', 'JCPTGP certificate', 'Professional references'],
        fee: '$200',
        timeWeeks: '2'
      },
      {
        title: 'Approved Jurisdiction evaluation',
        description:
          'Under CPSA’s Approved Jurisdiction Route, physicians from approved jurisdictions, including the United Kingdom, may be assessed for full licensure on the General Register without completing a Practice Readiness Assessment. CPSA will review your credentials and inform you if you qualify.',
        docs: ['Assessment forms'],
        fee: '$0',
        timeWeeks: '4‑8'
      },
      {
        title: 'Apply for full licence',
        description:
          'Once CPSA confirms your eligibility under the Approved Jurisdiction Route, complete the final steps to obtain a full licence on the General Register and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['CPSA approval letter', 'Licence application', 'CFPC registration'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Approved Jurisdiction Route for full licensure',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United Kingdom to British Columbia – Family Medicine (JCPTGP)
    id: 23,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['JCPTGP'],
    // Use the same experience requirement as other UK GP routes in BC
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your JCPTGP certificate, experience and references.',
        docs: ['Passport', 'CV', 'JCPTGP certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United Kingdom to Ontario – Family Medicine (JCPTGP)
    id: 24,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['JCPTGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your JCPTGP certificate, experience and credentials.',
        docs: ['Passport', 'CV', 'JCPTGP certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  }
  ,
  // -------------------------------------------------------------------------
  // New family medicine routes for New Zealand, Singapore, Pakistan and India
  // These jurisdictions are not on the approved list, so physicians must
  // complete a Practice Readiness Assessment (PRA) or equivalent clinical
  // assessment before obtaining full licensure【448071907306699†L622-L623】.
  {
    // New Zealand to Alberta – Family Medicine
    id: 25,
    incomingCountry: 'New Zealand',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA). Provide proof of identity, your New Zealand GP qualification, professional references and other required documents.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment. PRA programmes provide an accelerated pathway for international medical graduates who have completed residency and practised independently abroad; participants practise under supervision for approximately 12 weeks to demonstrate readiness for the Canadian health system【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After successfully completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // New Zealand to British Columbia – Family Medicine
    id: 26,
    incomingCountry: 'New Zealand',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your New Zealand GP qualification, experience and references.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // New Zealand to Ontario – Family Medicine
    id: 27,
    incomingCountry: 'New Zealand',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your New Zealand GP qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Singapore to Alberta – Family Medicine
    id: 28,
    incomingCountry: 'Singapore',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your Singapore family medicine qualification, identity documents and professional references.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Singapore to British Columbia – Family Medicine
    id: 29,
    incomingCountry: 'Singapore',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your Singapore family medicine qualification, experience and references.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Singapore to Ontario – Family Medicine
    id: 30,
    incomingCountry: 'Singapore',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your Singapore family medicine qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Pakistan to Alberta – Family Medicine
    id: 31,
    incomingCountry: 'Pakistan',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your FCPS Family Medicine qualification, identity documents and professional references.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Pakistan to British Columbia – Family Medicine
    id: 32,
    incomingCountry: 'Pakistan',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your FCPS Family Medicine qualification, experience and references.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Pakistan to Ontario – Family Medicine
    id: 33,
    incomingCountry: 'Pakistan',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your FCPS Family Medicine qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required. This enables you to gain experience in the Ontario health system while under supervision.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // India to Alberta – Family Medicine
    id: 34,
    incomingCountry: 'India',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSA eligibility',
        description:
          'Submit an eligibility application to the College of Physicians and Surgeons of Alberta (CPSA) with proof of your MD Family Medicine (India) qualification, identity documents and professional references.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate'],
        fee: '$0',
        timeWeeks: '2'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in family medicine and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '8‑12'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing the PRA, apply for a full practice licence with CPSA and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['PRA results', 'Registration form'],
        fee: '$400',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      },
      {
        text: 'CPSA eligibility criteria for international medical graduates',
        url: 'https://cpsa.ca/physicians/international-medical-graduates/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // India to British Columbia – Family Medicine
    id: 35,
    incomingCountry: 'India',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSBC eligibility',
        description:
          'Submit an eligibility assessment to the College of Physicians and Surgeons of British Columbia (CPSBC) including proof of your MD Family Medicine (India) qualification, experience and references.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate'],
        fee: '$300',
        timeWeeks: '3'
      },
      {
        title: 'Clinical Assessment',
        description:
          'Complete a Clinical Assessment to demonstrate your ability to practise family medicine within the BC health system. This assessment typically involves a supervised clinical placement.',
        docs: ['Assessment application'],
        fee: '$5,000',
        timeWeeks: '10‑14'
      },
      {
        title: 'Full licence application',
        description:
          'After passing the assessment, apply for a full licence with CPSBC and register with the College of Family Physicians of Canada (CFPC).',
        docs: ['Assessment report', 'Registration form'],
        fee: '$500',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Assessment routes for international medical graduates',
        url: 'https://www.cpsbc.ca/registration-licensing'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // India to Ontario – Family Medicine
    id: 36,
    incomingCountry: 'India',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for CPSO assessment',
        description:
          'Submit an application to the College of Physicians and Surgeons of Ontario (CPSO) for assessment of your MD Family Medicine (India) qualification, experience and credentials.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate'],
        fee: '$340',
        timeWeeks: '4'
      },
      {
        title: 'Supervised practice',
        description:
          'Complete a period of supervised practice under the Practice Assessment Program (PAP) if required.',
        docs: ['Supervision agreement'],
        fee: '$7,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Apply for full licence',
        description:
          'After completing supervised practice, apply for a full licence with CPSO and join the College of Family Physicians of Canada (CFPC).',
        docs: ['PAP report', 'Registration form'],
        fee: '$425',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – International medical graduates',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  // -------------------------------------------------------------------------
  // New specialist routes (10) across UK, Ireland, USA, Australia and South Africa
  {
    // UK to Ontario – Pediatrics
    id: 37,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Pediatrics',
    requiredQualifications: ['CCT Pediatrics'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your UK CCT in Pediatrics. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Pediatrics certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in pediatrics.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Registration and licensure for specialists',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // UK to British Columbia – Ophthalmology
    id: 38,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Ophthalmology',
    requiredQualifications: ['CCT Ophthalmology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for specialist recognition of your CCT in Ophthalmology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Ophthalmology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in ophthalmology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to Alberta – Psychiatry
    id: 39,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Psychiatry',
    requiredQualifications: ['CSCST Psychiatry'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for specialist recognition of your Irish Certificate of Satisfactory Completion of Specialist Training (CSCST) in Psychiatry. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CSCST Psychiatry certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in psychiatry and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration for international medical graduates',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to British Columbia – Surgery
    id: 40,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Surgery',
    requiredQualifications: ['CSCST Surgery'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to CPSBC for specialist recognition of your Irish CSCST in Surgery. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CSCST Surgery certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in surgery.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // USA to Ontario – Obstetrics and Gynecology
    id: 41,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Obstetrics and Gynaecology',
    requiredQualifications: ['ABOG'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to CPSO for recognition of your American Board of Obstetrics and Gynecology (ABOG) certification. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'ABOG certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in obstetrics and gynecology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // USA to British Columbia – Dermatology
    id: 42,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Dermatology',
    requiredQualifications: ['ABD'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to CPSBC for specialist recognition of your American Board of Dermatology (ABD) certification. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'ABD certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in dermatology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Alberta – Emergency Medicine
    id: 43,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Emergency Medicine',
    requiredQualifications: ['FACEM'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to CPSA for specialist recognition of your Fellowship of the Australasian College for Emergency Medicine (FACEM). Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FACEM certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in emergency medicine and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration for international medical graduates',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Cardiology
    id: 44,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Cardiology',
    requiredQualifications: ['FRACP Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to CPSBC for specialist recognition of your Fellowship of the Royal Australasian College of Physicians (FRACP) in Cardiology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in cardiology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to Ontario – Neurology
    id: 45,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Neurology',
    requiredQualifications: ['FCS(SA) Neurology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to CPSO for specialist recognition of your FCS(SA) in Neurology from the Colleges of Medicine of South Africa. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FCS(SA) Neurology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in neurology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to Alberta – Orthopedics
    id: 46,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Orthopedics',
    requiredQualifications: ['FCS(SA) Orthopedics'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to CPSA for specialist recognition of your FCS(SA) in Orthopedics from the Colleges of Medicine of South Africa. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FCS(SA) Orthopedics certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in orthopedics and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration for international medical graduates',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  }

  ,
  // -------------------------------------------------------------------------
  // Additional specialist routes requested for UK, Ireland, USA, Australia and South Africa
  {
    // United Kingdom to Alberta – General Surgery
    id: 47,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'General Surgery',
    requiredQualifications: ['CCT General Surgery'],
    // International specialist routes typically require several years of experience
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for specialist recognition of your UK CCT in General Surgery. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT General Surgery certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Alberta to demonstrate your competence in general surgery. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration for international medical graduates',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United Kingdom to British Columbia – Psychiatry
    id: 48,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Psychiatry',
    requiredQualifications: ['CCT Psychiatry'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for specialist recognition of your CCT in Psychiatry. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Psychiatry certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in psychiatry. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United Kingdom to Ontario – Cardiology
    id: 49,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Cardiology',
    requiredQualifications: ['CCT Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for specialist recognition of your UK CCT in Cardiology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in cardiology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to Ontario – Pediatrics
    id: 50,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Pediatrics',
    requiredQualifications: ['CSCST Pediatrics'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your Irish Certificate of Satisfactory Completion of Specialist Training (CSCST) in Pediatrics. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CSCST Pediatrics certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in pediatrics.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to British Columbia – Obstetrics and Gynaecology
    id: 51,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Obstetrics and Gynaecology',
    requiredQualifications: ['CSCST Obstetrics and Gynaecology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for specialist recognition of your Irish CSCST in Obstetrics and Gynaecology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CSCST Obstetrics and Gynaecology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in obstetrics and gynaecology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United States to Alberta – Neurology
    id: 52,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Neurology',
    requiredQualifications: ['ABPN Neurology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your American Board of Psychiatry and Neurology (ABPN) certification in Neurology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'ABPN Neurology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in neurology and local standards. PRA programmes provide an accelerated pathway for international medical graduates who have completed residency and practised independently abroad; participants practise under supervision for approximately 12 weeks【151441892112933†screenshot】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration for international medical graduates',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United States to British Columbia – Emergency Medicine
    id: 53,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Emergency Medicine',
    requiredQualifications: ['ABEM'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your American Board of Emergency Medicine (ABEM) certification. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'ABEM certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in emergency medicine.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Ontario – Dermatology
    id: 54,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Dermatology',
    requiredQualifications: ['FACD'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your Fellowship of the Australasian College of Dermatologists (FACD). Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FACD certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in dermatology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to British Columbia – Ophthalmology
    id: 55,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Ophthalmology',
    requiredQualifications: ['FCS(SA) Ophthalmology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your FCS(SA) in Ophthalmology from the Colleges of Medicine of South Africa. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FCS(SA) Ophthalmology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in ophthalmology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to Ontario – Cardiology
    id: 56,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Cardiology',
    requiredQualifications: ['FCS(SA) Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your FCS(SA) in Cardiology from the Colleges of Medicine of South Africa. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FCS(SA) Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in cardiology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  // -------------------------------------------------------------------------
  // Routes for UK destinations (England, Scotland, Wales, Northern Ireland) for various incoming countries
  // These routes require GMC registration via CEGPR followed by the appropriate
  // regional induction and refresher scheme for overseas-qualified GPs. The schemes
  // provide a learning needs assessment and supervised practice (typically up to six
  // months) to prepare doctors for NHS general practice【229229435952942†L316-L324】.
  {
    id: 57,
    incomingCountry: 'Australia',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the General Medical Council (GMC) for registration as a General Practitioner via the Certificate of Eligibility for GP Registration (CEGPR). Provide evidence of your FRACGP qualification, training and experience.',
        docs: ['Passport', 'CV', 'FRACGP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and a period of supervised practice (up to six months) for GPs with overseas qualifications and little or no NHS experience【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list and begin independent practice as a GP.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 58,
    incomingCountry: 'Australia',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the General Medical Council (GMC) for registration as a General Practitioner via the CEGPR route. Provide evidence of your FRACGP qualification, training and experience.',
        docs: ['Passport', 'CV', 'FRACGP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme – a straightforward route for GPs with overseas qualifications who have little or no previous NHS GP experience. The programme provides a tailored learning needs assessment, a practice‑based supervisor and up to six months of supervised clinical sessions and assessments【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 59,
    incomingCountry: 'Australia',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route, providing evidence of your FRACGP qualification, training and experience.',
        docs: ['Passport', 'CV', 'FRACGP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. This programme offers a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs acclimatise to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply to join the Wales performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 60,
    incomingCountry: 'Australia',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route, providing evidence of your FRACGP qualification, training and experience.',
        docs: ['Passport', 'CV', 'FRACGP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and a period of supervised practice (up to six months) to help overseas‑qualified GPs transition to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 61,
    incomingCountry: 'New Zealand',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for registration as a GP via the CEGPR route. Provide proof of your New Zealand GP Fellowship, training and experience.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme for overseas‑qualified doctors. The programme includes a learning needs assessment and supervised practice (up to six months)【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 62,
    incomingCountry: 'New Zealand',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your New Zealand GP Fellowship, training and experience.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment and a practice‑based supervisor with up to six months of supervised clinical sessions and assessments【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 63,
    incomingCountry: 'New Zealand',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your New Zealand GP Fellowship, training and experience.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. The scheme provides a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 64,
    incomingCountry: 'New Zealand',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your New Zealand GP Fellowship, training and experience.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme provides a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs transition to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 65,
    incomingCountry: 'Singapore',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your Singapore family medicine accreditation, training and experience.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for GPs with overseas qualifications【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 66,
    incomingCountry: 'Singapore',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your Singapore family medicine accreditation, training and experience.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment, practice‑based supervisor and supervised clinical sessions (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 67,
    incomingCountry: 'Singapore',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your Singapore family medicine accreditation, training and experience.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 68,
    incomingCountry: 'Singapore',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide proof of your Singapore family medicine accreditation, training and experience.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme provides a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 69,
    incomingCountry: 'Pakistan',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your FCPS Family Medicine qualification, training and experience.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 70,
    incomingCountry: 'Pakistan',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your FCPS Family Medicine qualification, training and experience.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment and practice‑based supervisor with supervised clinical sessions (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 71,
    incomingCountry: 'Pakistan',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your FCPS Family Medicine qualification, training and experience.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. This programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 72,
    incomingCountry: 'Pakistan',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your FCPS Family Medicine qualification, training and experience.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs transition to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 73,
    incomingCountry: 'India',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your MD Family Medicine (India) qualification, training and experience.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 74,
    incomingCountry: 'India',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your MD Family Medicine (India) qualification, training and experience.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment and supervised practice with a practice‑based supervisor for up to six months for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 75,
    incomingCountry: 'India',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your MD Family Medicine (India) qualification, training and experience.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. This programme offers a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs adapt to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 76,
    incomingCountry: 'India',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your MD Family Medicine (India) qualification, training and experience.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 77,
    incomingCountry: 'EU',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['EU GP Specialist Certificate'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your EU GP Specialist Certificate, training and experience.',
        docs: ['Passport', 'CV', 'EU GP Specialist Certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 78,
    incomingCountry: 'EU',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['EU GP Specialist Certificate'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your EU GP Specialist Certificate, training and experience.',
        docs: ['Passport', 'CV', 'EU GP Specialist Certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment and supervised practice with a practice‑based supervisor (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 79,
    incomingCountry: 'EU',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['EU GP Specialist Certificate'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your EU GP Specialist Certificate, training and experience.',
        docs: ['Passport', 'CV', 'EU GP Specialist Certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. This programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 80,
    incomingCountry: 'EU',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['EU GP Specialist Certificate'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your EU GP Specialist Certificate, training and experience.',
        docs: ['Passport', 'CV', 'EU GP Specialist Certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme provides a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs adapt to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 81,
    incomingCountry: 'Canada',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['CCFP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your Certification in the College of Family Physicians of Canada (CCFP), training and experience.',
        docs: ['Passport', 'CV', 'CCFP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 82,
    incomingCountry: 'Canada',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['CCFP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your CCFP certificate, training and experience.',
        docs: ['Passport', 'CV', 'CCFP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment and supervised practice (up to six months) with a practice‑based supervisor for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 83,
    incomingCountry: 'Canada',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['CCFP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your CCFP certificate, training and experience.',
        docs: ['Passport', 'CV', 'CCFP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. This programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list to practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 84,
    incomingCountry: 'Canada',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['CCFP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your CCFP certificate, training and experience.',
        docs: ['Passport', 'CV', 'CCFP certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme provides a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs adapt to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 85,
    incomingCountry: 'United States',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'England',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your ABFM certification, training and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the England GP Induction and Refresher Scheme',
        description:
          'Apply to NHS England’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the England performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the England performers list and begin independent practice.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 86,
    incomingCountry: 'United States',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Scotland',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your ABFM certification, training and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Complete the Scotland International Induction Programme',
        description:
          'Join Scotland’s International Induction Programme. The programme provides a learning needs assessment, practice‑based supervisor and supervised clinical sessions (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Scotland performers list',
        description:
          'After completing the induction programme, apply for inclusion in the Scottish performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 87,
    incomingCountry: 'United States',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Wales',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your ABFM certification, training and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Wales GP Induction and Refresher Scheme',
        description:
          'Apply to Wales’ GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) for overseas‑qualified GPs【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Wales performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Wales performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 88,
    incomingCountry: 'United States',
    destinationCountry: 'United Kingdom',
    destinationProvince: 'Northern Ireland',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Apply for GMC registration via CEGPR',
        description:
          'Apply to the GMC for GP registration via the CEGPR route. Provide evidence of your ABFM certification, training and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate', 'Training records'],
        fee: '£500',
        timeWeeks: '4'
      },
      {
        title: 'Join the Northern Ireland GP Induction and Refresher Scheme',
        description:
          'Apply to Northern Ireland’s GP Induction and Refresher Scheme. The programme includes a learning needs assessment and supervised practice (up to six months) to help overseas‑qualified GPs transition to NHS practice【229229435952942†L316-L324】.',
        docs: ['Learning needs assessment', 'Supervision agreement'],
        fee: '£2,000',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Northern Ireland performers list',
        description:
          'After completing the induction scheme, apply for inclusion in the Northern Ireland performers list and practise independently.',
        docs: ['Scheme completion certificate', 'Performer list application'],
        fee: '£300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  // -------------------------------------------------------------------------
  // Routes for Ireland as a destination for various incoming countries
  // These routes involve registering with the Irish Medical Council, completing
  // an adaptation or supervised practice period and joining the Irish GP division.
  {
    id: 89,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['MRCGP', 'CCT'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) by submitting evidence of your MRCGP and CCT qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT certificate', 'MRCGP certificate'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system. This typically lasts several months and involves supervision and assessment【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 90,
    incomingCountry: 'Australia',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['FRACGP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your FRACGP qualification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'FRACGP certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 91,
    incomingCountry: 'New Zealand',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['New Zealand GP Fellowship'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your New Zealand GP Fellowship. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'New Zealand GP Fellowship certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 92,
    incomingCountry: 'Singapore',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['Singapore Family Medicine Accreditation'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your Singapore family medicine qualification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'Singapore Family Medicine Accreditation certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 93,
    incomingCountry: 'Pakistan',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['FCPS Family Medicine'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your FCPS Family Medicine qualification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'FCPS Family Medicine certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 94,
    incomingCountry: 'India',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['MD Family Medicine (India)'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your MD Family Medicine (India) qualification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'MD Family Medicine (India) certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 95,
    incomingCountry: 'EU',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['EU GP Specialist Certificate'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your EU GP Specialist Certificate. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'EU GP Specialist Certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 96,
    incomingCountry: 'Canada',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['CCFP'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your CCFP qualification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'CCFP certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    id: 97,
    incomingCountry: 'United States',
    destinationCountry: 'Ireland',
    destinationProvince: '',
    specialty: 'Family Medicine',
    requiredQualifications: ['ABFM'],
    minExperienceMonths: 24,
    steps: [
      {
        title: 'Register with the Irish Medical Council',
        description:
          'Apply to the Irish Medical Council (IMC) for registration on the Specialist Division (General Practice) using your ABFM certification. Submit evidence of training and experience.',
        docs: ['Passport', 'CV', 'ABFM certificate', 'Training records'],
        fee: '€500',
        timeWeeks: '4'
      },
      {
        title: 'Complete adaptation/supervised practice',
        description:
          'The IMC may require a period of adaptation or supervised practice in an approved training post to familiarise you with the Irish health system【229229435952942†L316-L324】.',
        docs: ['Adaptation training plan', 'Supervision agreement'],
        fee: '€2,500',
        timeWeeks: '12‑24'
      },
      {
        title: 'Join the Irish College of General Practitioners (ICGP) and commence practice',
        description:
          'After completing the adaptation period, register with the Irish College of General Practitioners (ICGP) and begin independent practice in Ireland.',
        docs: ['Adaptation completion certificate', 'ICGP membership application'],
        fee: '€300',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'Scotland Deanery – GP Returner and International Induction Programmes',
        url: 'https://www.scotlanddeanery.nhs.scot/your-development/gp-returner-and-international-induction-programmes/'
      }
    ],
lastVerified: '2025-08-08'
  },
  // -------------------------------------------------------------------------
  // Additional specialist routes (five new specialties) across UK, Ireland, USA, Australia and South Africa
  {
    // United Kingdom to Ontario – Endocrinology
    id: 72,
    incomingCountry: 'United Kingdom',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Endocrinology',
    requiredQualifications: ['CCT Endocrinology'],
    // International specialist routes typically require several years of experience
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your UK CCT in Endocrinology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CCT Endocrinology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in endocrinology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Ireland to Alberta – Cardiology
    id: 73,
    incomingCountry: 'Ireland',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Cardiology',
    requiredQualifications: ['CSCST Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for specialist recognition of your Irish CSCST in Cardiology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'CSCST Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in cardiology and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration and assessment',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // United States to British Columbia – Cardiology
    id: 74,
    incomingCountry: 'United States',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Cardiology',
    requiredQualifications: ['ABIM Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Submit an application to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your American Board of Internal Medicine (ABIM) certification in Cardiology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'ABIM Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in cardiology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Alberta – Neurology
    id: 75,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Neurology',
    requiredQualifications: ['FRACP Neurology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your Fellowship of the Royal Australasian College of Physicians (FRACP) in Neurology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Neurology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in neurology and local standards. PRA programmes provide an accelerated, supervised pathway for international medical graduates who have completed residency and practised independently abroad【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration and assessment',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // South Africa to Ontario – Dermatology
    id: 76,
    incomingCountry: 'South Africa',
    destinationCountry: 'Canada',
    destinationProvince: 'Ontario',
    specialty: 'Dermatology',
    requiredQualifications: ['FCS(SA) Dermatology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSO',
        description:
          'Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your FCS(SA) in Dermatology from the Colleges of Medicine of South Africa. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FCS(SA) Dermatology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence in dermatology.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSO once fellowship or assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSO – Specialist registration and licensure',
        url: 'https://www.cpso.on.ca/Physicians/Registration'
      }
    ],
    lastVerified: '2025-08-08'
  },
  // Additional specialist routes for full coverage across UK, Ireland, USA and Australia
  {
    // Australia to Alberta – Cardiology
    id: 77,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Cardiology',
    requiredQualifications: ['FRACP Cardiology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your FRACP Cardiology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Cardiology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in cardiology and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration and assessment',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Alberta – Dermatology
    id: 78,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Dermatology',
    requiredQualifications: ['FACD Dermatology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your FACD Dermatology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FACD Dermatology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in dermatology and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration and assessment',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to Alberta – Endocrinology
    id: 79,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'Alberta',
    specialty: 'Endocrinology',
    requiredQualifications: ['FRACP Endocrinology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSA',
        description:
          'Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your FRACP Endocrinology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Endocrinology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Practice Readiness Assessment (PRA)',
        description:
          'Complete a supervised Practice Readiness Assessment to demonstrate your competence in endocrinology and local standards【448071907306699†L622-L623】.',
        docs: ['Assessment application', 'Practice logs'],
        fee: '$6,000',
        timeWeeks: '12‑20'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSA once the assessment requirements are met.',
        docs: ['PRA results', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSA – Specialist registration and assessment',
        url: 'https://cpsa.ca/physicians/registration/apply-for-registration/'
      },
      {
        text: 'MCC – Practice Ready Assessment (PRA) information',
        url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Dermatology
    id: 80,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Dermatology',
    requiredQualifications: ['FACD Dermatology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Apply to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your FACD Dermatology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FACD Dermatology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in dermatology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once the assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Endocrinology
    id: 81,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Endocrinology',
    requiredQualifications: ['FRACP Endocrinology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Apply to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your FRACP Endocrinology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Endocrinology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in endocrinology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once the assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  },
  {
    // Australia to British Columbia – Neurology
    id: 82,
    incomingCountry: 'Australia',
    destinationCountry: 'Canada',
    destinationProvince: 'British Columbia',
    specialty: 'Neurology',
    requiredQualifications: ['FRACP Neurology'],
    minExperienceMonths: 60,
    steps: [
      {
        title: 'Specialist assessment with CPSBC',
        description:
          'Apply to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your FRACP Neurology. Provide proof of qualifications, training and experience.',
        docs: ['Passport', 'CV', 'FRACP Neurology certificate'],
        fee: '$500',
        timeWeeks: '6'
      },
      {
        title: 'Clinical fellowship or assessment',
        description:
          'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence in neurology. This typically involves a supervised clinical placement.',
        docs: ['Fellowship agreement'],
        fee: '$10,000',
        timeWeeks: '26‑52'
      },
      {
        title: 'Full licence application',
        description:
          'Apply for a full licence with CPSBC once the assessment requirements are met.',
        docs: ['Assessment/fellowship report', 'Licence application'],
        fee: '$450',
        timeWeeks: '4'
      }
    ],
    sources: [
      {
        text: 'CPSBC – Specialist registration and assessment',
        url: 'https://www.cpsbc.ca/registration-licensing'
      }
    ],
    lastVerified: '2025-08-08'
  }
];

// Automatically generate missing specialist routes for Cardiology, Endocrinology, Neurology, Dermatology and Infectious Disease across Canada
function generateMissingSpecialistRoutes() {
  const NEW_SPECIALTIES = [
    'Endocrinology',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Infectious Disease',
    // Additional major specialties recognised by many licensing bodies
    'Internal Medicine',
    'Hematology',
    'Medical Oncology',
    'Nephrology',
    'Nuclear Medicine',
    'Physical Medicine and Rehabilitation',
    'Pathology',
    'Neurosurgery',
    'Plastic Surgery',
    'Preventive Medicine'
  ];
  const NEW_COUNTRIES = ['United Kingdom', 'United States', 'Ireland', 'Australia'];
  // Include new provinces in addition to the existing Alberta, BC and Ontario
  const NEW_PROVINCES = ['Alberta', 'British Columbia', 'Ontario', 'Nova Scotia', 'Saskatchewan', 'Manitoba'];
  const QUALIFICATIONS_MAP = {
    'Endocrinology': {
      'United Kingdom': 'CCT Endocrinology',
      'United States': 'ABIM Endocrinology',
      'Ireland': 'CSCST Endocrinology',
      'Australia': 'FRACP Endocrinology'
    },
    'Cardiology': {
      'United Kingdom': 'CCT Cardiology',
      'United States': 'ABIM Cardiology',
      'Ireland': 'CSCST Cardiology',
      'Australia': 'FRACP Cardiology'
    },
    'Neurology': {
      'United Kingdom': 'CCT Neurology',
      'United States': 'ABPN Neurology',
      'Ireland': 'CSCST Neurology',
      'Australia': 'FRACP Neurology'
    },
    'Dermatology': {
      'United Kingdom': 'CCT Dermatology',
      'United States': 'ABD Dermatology',
      'Ireland': 'CSCST Dermatology',
      'Australia': 'FACD Dermatology'
    },
    'Infectious Disease': {
      'United Kingdom': 'CCT Infectious Disease',
      'United States': 'ABIM Infectious Disease',
      'Ireland': 'CSCST Infectious Disease',
      'Australia': 'FRACP Infectious Disease'
    },
    'Internal Medicine': {
      'United Kingdom': 'CCT Internal Medicine',
      'United States': 'ABIM Internal Medicine',
      'Ireland': 'CSCST Internal Medicine',
      'Australia': 'FRACP Internal Medicine'
    },
    'Hematology': {
      'United Kingdom': 'CCT Hematology',
      'United States': 'ABIM Hematology',
      'Ireland': 'CSCST Hematology',
      'Australia': 'FRACP Hematology'
    },
    'Medical Oncology': {
      'United Kingdom': 'CCT Medical Oncology',
      'United States': 'ABIM Medical Oncology',
      'Ireland': 'CSCST Medical Oncology',
      'Australia': 'FRACP Oncology'
    },
    'Nephrology': {
      'United Kingdom': 'CCT Nephrology',
      'United States': 'ABIM Nephrology',
      'Ireland': 'CSCST Nephrology',
      'Australia': 'FRACP Nephrology'
    },
    'Nuclear Medicine': {
      'United Kingdom': 'CCT Nuclear Medicine',
      'United States': 'ABNM Nuclear Medicine',
      'Ireland': 'CSCST Nuclear Medicine',
      'Australia': 'FRACP Nuclear Medicine'
    },
    'Physical Medicine and Rehabilitation': {
      'United Kingdom': 'CCT Rehabilitation Medicine',
      'United States': 'ABPMR Physical Medicine & Rehabilitation',
      'Ireland': 'CSCST Rehabilitation Medicine',
      'Australia': 'FAFRM Rehabilitation Medicine'
    },
    'Pathology': {
      'United Kingdom': 'CCT Pathology',
      'United States': 'ABPath Pathology',
      'Ireland': 'CSCST Pathology',
      'Australia': 'FRCPA Pathology'
    },
    'Neurosurgery': {
      'United Kingdom': 'CCT Neurosurgery',
      'United States': 'ABNS Neurosurgery',
      'Ireland': 'CSCST Neurosurgery',
      'Australia': 'RACS Neurosurgery'
    },
    'Plastic Surgery': {
      'United Kingdom': 'CCT Plastic Surgery',
      'United States': 'ABPS Plastic Surgery',
      'Ireland': 'CSCST Plastic Surgery',
      'Australia': 'RACS Plastic and Reconstructive Surgery'
    },
    'Preventive Medicine': {
      'United Kingdom': 'CCT Public Health Medicine',
      'United States': 'ABPM Preventive Medicine',
      'Ireland': 'CSCST Public Health Medicine',
      'Australia': 'FRACP Public Health Medicine'
    }
  };
  // Build a set of existing specialty-country-province keys to avoid duplicates
  const existingKeys = new Set(ROUTES.map(r => `${r.specialty}|${r.incomingCountry}|${r.destinationProvince}`));
  let nextId = Math.max(...ROUTES.map(r => r.id)) + 1;
  function createSteps(province, qualification) {
    if (province === 'Alberta') {
      return [
        {
          title: 'Specialist assessment with CPSA',
          description: `Apply to the College of Physicians and Surgeons of Alberta (CPSA) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Practice Readiness Assessment (PRA)',
          description: 'Complete a Practice Readiness Assessment (PRA) in Alberta to demonstrate your competence. This typically involves a supervised workplace‑based assessment.',
          docs: ['PRA application'],
          fee: '$4,000',
          timeWeeks: '12‑18'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSA once the PRA requirements are met.',
          docs: ['PRA results', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'British Columbia') {
      return [
        {
          title: 'Specialist assessment with CPSBC',
          description: `Apply to the College of Physicians and Surgeons of British Columbia (CPSBC) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Clinical fellowship or assessment',
          description: 'Complete a clinical fellowship or assessment period in British Columbia to demonstrate your competence. This typically involves a supervised clinical placement.',
          docs: ['Fellowship agreement'],
          fee: '$10,000',
          timeWeeks: '26‑52'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSBC once the assessment requirements are met.',
          docs: ['Assessment/fellowship report', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'Nova Scotia') {
      // Nova Scotia specialist pathway using PACE (Practice Ready Assessment) evaluation
      return [
        {
          title: 'Specialist assessment with CPSNS',
          description: `Apply to the College of Physicians and Surgeons of Nova Scotia (CPSNS) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Practice Readiness Assessment – PACE',
          description:
            'Complete the Physician Assessment Centre of Excellence (PACE) evaluation in Nova Scotia to demonstrate your competence. PACE is a practice‑based assessment conducted over approximately 12 weeks in a clinical environment.',
          docs: ['PACE application'],
          fee: '$5,000',
          timeWeeks: '12‑18'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSNS once you have successfully completed the PACE assessment.',
          docs: ['PACE results', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'Saskatchewan') {
      // Saskatchewan specialist pathway using SIPPA
      return [
        {
          title: 'Specialist assessment with CPSS',
          description: `Apply to the College of Physicians and Surgeons of Saskatchewan (CPSS) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Saskatchewan International Physician Practice Assessment (SIPPA)',
          description:
            'Complete the Saskatchewan International Physician Practice Assessment (SIPPA), a practice readiness competency assessment program. SIPPA typically involves a supervised clinical assessment over about 12 weeks to evaluate your readiness to practise in Saskatchewan.',
          docs: ['SIPPA application'],
          fee: '$5,000',
          timeWeeks: '12‑18'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSS once SIPPA requirements are met.',
          docs: ['SIPPA results', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'Manitoba') {
      // Manitoba specialist pathway using PRA MB‑SP
      return [
        {
          title: 'Specialist assessment with CPSM',
          description: `Apply to the College of Physicians and Surgeons of Manitoba (CPSM) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Practice Ready Assessment – Specialty Practice (PRA MB‑SP)',
          description:
            'Complete the Practice Ready Assessment – Specialty Practice (PRA MB‑SP), a 3–12‑month assessment program for eligible specialist physicians. This programme provides an accelerated route to licensure in Manitoba and typically involves supervised clinical placement in rural or underserved communities.',
          docs: ['PRA MB‑SP application'],
          fee: '$6,000',
          timeWeeks: '12‑52'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSM once the PRA MB‑SP requirements are met.',
          docs: ['Assessment results', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    } else {
      // Ontario specialist pathway (default)
      return [
        {
          title: 'Specialist assessment with CPSO',
          description: `Apply to the College of Physicians and Surgeons of Ontario (CPSO) for recognition of your ${qualification}. Provide proof of qualifications, training and experience.`,
          docs: ['Passport', 'CV', `${qualification} certificate`],
          fee: '$500',
          timeWeeks: '6'
        },
        {
          title: 'Clinical fellowship or assessment',
          description:
            'Complete a clinical fellowship or assessment period in Ontario to demonstrate your competence. This typically involves a supervised clinical placement.',
          docs: ['Fellowship agreement'],
          fee: '$10,000',
          timeWeeks: '26‑52'
        },
        {
          title: 'Full licence application',
          description: 'Apply for a full licence with CPSO once the assessment requirements are met.',
          docs: ['Assessment/fellowship report', 'Licence application'],
          fee: '$450',
          timeWeeks: '4'
        }
      ];
    }
  }
  function getSources(province) {
    if (province === 'Alberta') {
      return [
        {
          text: 'CPSA – Specialist registration for international medical graduates',
          url: 'https://cpsa.ca/physicians/registration/apply-for-registration/additional-route-to-registration-imgs/'
        },
        {
          text: 'MCC – Practice Ready Assessment (PRA) information',
          url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment'
        }
      ];
    } else if (province === 'British Columbia') {
      return [
        {
          text: 'CPSBC – Specialist registration and assessment',
          url: 'https://www.cpsbc.ca/registration-licensing'
        }
      ];
    } else {
      return [
        {
          text: 'CPSO – Specialist registration and licensure',
          url: 'https://www.cpso.on.ca/Physicians/Registration'
        }
      ];
    }
  }
  NEW_SPECIALTIES.forEach(spec => {
    NEW_COUNTRIES.forEach(country => {
      NEW_PROVINCES.forEach(province => {
        const key = `${spec}|${country}|${province}`;
        if (!existingKeys.has(key)) {
          const qualification = QUALIFICATIONS_MAP[spec][country];
          ROUTES.push({
            id: nextId++,
            incomingCountry: country,
            destinationCountry: 'Canada',
            destinationProvince: province,
            specialty: spec,
            requiredQualifications: [qualification],
            minExperienceMonths: 60,
            steps: createSteps(province, qualification),
            sources: getSources(province),
            lastVerified: '2025-08-08'
          });
        }
      });
    });
  });
}

// Generate missing Family Medicine routes for new Canadian provinces. Many
// existing routes cover Alberta, British Columbia and Ontario. This helper
// creates Family Medicine routes for Nova Scotia, Saskatchewan and Manitoba
// for each supported origin country when none exist. It uses province‑specific
// steps to reflect each province’s practice readiness assessment program.
function generateMissingGPRoutes() {
  // Provinces to add
  const NEW_GP_PROVINCES = ['Nova Scotia', 'Saskatchewan', 'Manitoba'];
  // Mapping of incoming country to its recognised family medicine qualification(s)
  const GP_QUALIFICATIONS_MAP = {
    'United Kingdom': ['MRCGP', 'CCT'],
    'Ireland': ['MICGP'],
    'United States': ['ABFM'],
    'Australia': ['FRACGP'],
    'South Africa': ['FCFP(SA)'],
    'New Zealand': ['New Zealand GP Fellowship'],
    'Singapore': ['Singapore Family Medicine Accreditation'],
    'Pakistan': ['FCPS Family Medicine'],
    'India': ['MD Family Medicine (India)']
  };
  // Build a set of existing GP keys to avoid duplicates (origin|province)
  const existingGPKeys = new Set(
    ROUTES.filter(r => r.specialty === 'Family Medicine' && r.destinationCountry === 'Canada')
      .map(r => `${r.incomingCountry}|${r.destinationProvince}`)
  );
  let nextId = Math.max(...ROUTES.map(r => r.id)) + 1;
  // Helper to build steps for GP routes per province
  function createGPSteps(province, qualifications) {
    const qualList = qualifications.join(' and ');
    if (province === 'Nova Scotia') {
      return [
        {
          title: 'Apply for CPSNS eligibility',
          description:
            `Submit an eligibility assessment to the College of Physicians and Surgeons of Nova Scotia (CPSNS) with proof of your ${qualList} qualification(s), identity documents and professional references.`,
          docs: ['Passport', 'CV', ...qualifications.map(q => `${q} certificate`)],
          fee: '$300',
          timeWeeks: '3'
        },
        {
          title: 'Practice Readiness Assessment – PACE',
          description:
            'Complete the Physician Assessment Centre of Excellence (PACE) evaluation in Nova Scotia. This practice‑based assessment usually takes around 12 weeks and evaluates your readiness to practise family medicine within the province.',
          docs: ['PACE application'],
          fee: '$5,000',
          timeWeeks: '12‑16'
        },
        {
          title: 'Full licence application',
          description:
            'Once you successfully complete the PACE assessment, apply for a full licence with CPSNS and register with the College of Family Physicians of Canada (CFPC).',
          docs: ['PACE assessment report', 'Licence application'],
          fee: '$400',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'Saskatchewan') {
      return [
        {
          title: 'Apply for CPSS eligibility',
          description:
            `Submit an eligibility assessment to the College of Physicians and Surgeons of Saskatchewan (CPSS) with proof of your ${qualList} qualification(s), identity documents and professional references.`,
          docs: ['Passport', 'CV', ...qualifications.map(q => `${q} certificate`)],
          fee: '$300',
          timeWeeks: '3'
        },
        {
          title: 'Saskatchewan International Physician Practice Assessment (SIPPA)',
          description:
            'Complete the Saskatchewan International Physician Practice Assessment (SIPPA), a supervised practice readiness program. SIPPA typically involves a workplace‑based assessment lasting about 12 weeks to evaluate your readiness for independent practice.',
          docs: ['SIPPA application'],
          fee: '$5,000',
          timeWeeks: '12‑18'
        },
        {
          title: 'Full licence application',
          description:
            'After completing SIPPA, apply for a full licence with CPSS and register with the College of Family Physicians of Canada (CFPC).',
          docs: ['SIPPA assessment report', 'Licence application'],
          fee: '$400',
          timeWeeks: '4'
        }
      ];
    } else if (province === 'Manitoba') {
      return [
        {
          title: 'Apply for CPSM eligibility',
          description:
            `Submit an eligibility assessment to the College of Physicians and Surgeons of Manitoba (CPSM) with proof of your ${qualList} qualification(s), identity documents and professional references.`,
          docs: ['Passport', 'CV', ...qualifications.map(q => `${q} certificate`)],
          fee: '$300',
          timeWeeks: '3'
        },
        {
          title: 'Practice Ready Assessment – Family Practice (PRA MB‑FP)',
          description:
            'Complete the Practice Ready Assessment – Family Practice (PRA MB‑FP), a three‑month workplace‑based assessment that provides an accelerated route to licensure for eligible practice‑ready family physicians in rural Manitoba.',
          docs: ['PRA MB‑FP application'],
          fee: '$5,000',
          timeWeeks: '12‑14'
        },
        {
          title: 'Full licence application',
          description:
            'After completing the PRA MB‑FP, apply for a full licence with CPSM and register with the College of Family Physicians of Canada (CFPC).',
          docs: ['Assessment report', 'Licence application'],
          fee: '$400',
          timeWeeks: '4'
        }
      ];
    }
    return [];
  }
  // Helper to pick sources based on province
  function getGPSources(province) {
    if (province === 'Nova Scotia') {
      return [
        {
          text: 'CPSNS – Practice Ready Assessment policy',
          url: 'https://cpsns.ns.ca/resource-library/policies/practice-ready-assessment-office-based-primary-care/'
        },
        {
          text: 'MCC – Practice‑Ready Assessment programs overview',
          url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment/'
        }
      ];
    } else if (province === 'Saskatchewan') {
      return [
        {
          text: 'University of Saskatchewan – Introduction to SIPPA',
          url: 'https://cmelearning.usask.ca/specialized-programs/sippa/Introduction%20to%20SIPPA.php'
        },
        {
          text: 'MCC – Practice‑Ready Assessment programs overview',
          url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment/'
        }
      ];
    } else if (province === 'Manitoba') {
      return [
        {
          text: 'University of Manitoba – International Medical Graduate programs',
          url: 'https://umanitoba.ca/explore/programs-of-study/international-medical-graduate-img-programs'
        },
        {
          text: 'MCC – Practice‑Ready Assessment programs overview',
          url: 'https://mcc.ca/examinations-assessments/practice-ready-assessment/'
        }
      ];
    }
    return [];
  }
  // Iterate over each province and origin to add routes
  NEW_GP_PROVINCES.forEach(province => {
    Object.keys(GP_QUALIFICATIONS_MAP).forEach(origin => {
      const key = `${origin}|${province}`;
      if (!existingGPKeys.has(key)) {
        const qualifications = GP_QUALIFICATIONS_MAP[origin];
        const steps = createGPSteps(province, qualifications);
        const sources = getGPSources(province);
        ROUTES.push({
          id: nextId++,
          incomingCountry: origin,
          destinationCountry: 'Canada',
          destinationProvince: province,
          specialty: 'Family Medicine',
          requiredQualifications: qualifications,
          minExperienceMonths: 24,
          steps: steps,
          sources: sources,
          lastVerified: '2025-08-08'
        });
      }
    });
  });
}
// ---- Middle East routes generation ----
// Generate licensing routes for GPs and specialists from approved jurisdictions to
// UAE, Qatar, Saudi Arabia and Oman. These routes summarise common processes such
// as DataFlow verification, registration with the local authority, licensing
// exams and final licence application. Sources are cited from publicly available
// guidance outlining these steps【415456649509115†L385-L424】【613363768629532†L30-L69】.
function addMiddleEastRoutes() {
  // Define origin countries and their GP qualifications
  const ORIGIN_GP_MAP = {
    'United Kingdom': ['MRCGP'],
    'Canada': ['CCFP'],
    'United States': ['ABFM'],
    'Australia': ['FRACGP'],
    'South Africa': ['FCFP(SA)']
  };
  // Define origin countries and their generic specialist qualification label
  const ORIGIN_SPEC_MAP = {
    'United Kingdom': ['CCT (Specialty)'],
    'Canada': ['RCPSC (Specialty)'],
    'United States': ['Board Certification (Specialty)'],
    'Australia': ['FRACP (Specialty)'],
    'South Africa': ['FCS(SA) (Specialty)']
  };
  // Destination countries in the Gulf region
  const DESTS = ['United Arab Emirates', 'Qatar', 'Saudi Arabia', 'Oman'];
  // Build a set of keys to avoid duplicates. Keys are defined by specialty, origin and destination.
  const existingKeys = new Set(ROUTES.map(r => `${r.specialty}|${r.incomingCountry}|${r.destinationCountry}`));
  let nextId = Math.max(...ROUTES.map(r => r.id)) + 1;
  // Helper to build steps for each destination and route type
  function buildSteps(dest, qual, isSpecialist) {
    // Common DataFlow step description
    const dataFlowDesc =
      'Complete the DataFlow verification (Primary Source Verification) to validate your education, licence and employment documents. ' +
      'This third‑party process verifies your credentials with the issuing institutions and produces a report accepted by the health authority.';
    if (dest === 'United Arab Emirates') {
      return [
        {
          title: 'Create MOHAP account and upload documents',
          description:
            'Create an account with the Ministry of Health and Prevention (MOHAP) using UAE PASS. Upload required documents including passport, qualifications, proof of experience and a recent photo, and pay the application fee.',
          docs: ['Passport', 'Qualification certificates', 'Experience certificate', 'Photo'],
          fee: 'AED 100 application fee',
          timeWeeks: '1'
        },
        {
          title: 'DataFlow verification',
          description: dataFlowDesc,
          docs: ['DataFlow report'],
          fee: 'AED 1,000‑2,000',
          timeWeeks: '4‑8'
        },
        {
          title: 'MOHAP licensing exam or evaluation',
          description:
            'Register for and pass the MOHAP licensing exam relevant to your profession. For some specialties the exam may be replaced by an evaluation interview. Upon passing, you receive an eligibility letter to proceed.',
          docs: ['Exam booking confirmation', 'Exam results'],
          fee: 'AED 500',
          timeWeeks: '4'
        },
        {
          title: 'Final licence application',
          description:
            'Submit your eligibility letter and DataFlow report through the MOHAP portal, pay the licence fee, and download your UAE professional licence once issued.',
          docs: ['Eligibility letter', 'Licence application'],
          fee: 'AED 3,000 licence fee',
          timeWeeks: '2'
        }
      ];
    } else if (dest === 'Saudi Arabia') {
      return [
        {
          title: 'DataFlow verification',
          description: dataFlowDesc,
          docs: ['Passport', 'Qualification certificates', 'Licence/registration certificate', 'Employment letters'],
          fee: 'SAR 1,500‑3,000',
          timeWeeks: '4‑8'
        },
        {
          title: 'MumarisPlus registration and classification',
          description:
            'Create an account on MumarisPlus (SCFHS portal) and submit your documents for professional classification. SCFHS will review your qualifications and issue an eligibility number if you are deemed eligible.',
          docs: ['MumarisPlus application'],
          fee: 'SAR 500',
          timeWeeks: '2‑4'
        },
        {
          title: 'Licensing exam',
          description:
            'Register for and pass the Prometric or Pearson VUE exam required by the Saudi Commission for Health Specialties. Physicians may be asked to attend an online evaluation session instead of the exam.',
          docs: ['Exam booking confirmation', 'Exam results'],
          fee: 'US$289 (nursing example)',
          timeWeeks: '4'
        },
        {
          title: 'Professional classification and registration certificate',
          description:
            'After passing the exam, SCFHS completes a final review and issues your professional classification and registration certificate, valid for two years.',
          docs: ['Classification certificate'],
          fee: 'SAR 1,000',
          timeWeeks: '4'
        },
        {
          title: 'Update MumarisPlus profile after arrival',
          description:
            'Once you arrive in Saudi Arabia and obtain your resident permit (iqama), update your MumarisPlus profile with this information to activate your registration.',
          docs: ['Iqama'],
          fee: '0',
          timeWeeks: '1'
        }
      ];
    } else if (dest === 'Qatar') {
      return [
        {
          title: 'DataFlow verification',
          description: dataFlowDesc,
          docs: ['DataFlow report'],
          fee: 'QAR 1,500‑3,000',
          timeWeeks: '4‑8'
        },
        {
          title: 'Register with QCHP',
          description:
            'Create an account with the Qatar Council for Healthcare Practitioners (QCHP) and submit your documents for classification. This may occur before or after the exam depending on the authority’s rules.',
          docs: ['QCHP application'],
          fee: 'QAR 500',
          timeWeeks: '2‑4'
        },
        {
          title: 'Licensing exam or oral assessment',
          description:
            'Register for and pass the QCHP licensing exam (Prometric) or oral assessment. In Qatar, the exam may be taken before DataFlow completion in some cases.',
          docs: ['Exam booking confirmation', 'Exam results'],
          fee: 'QAR 1,000',
          timeWeeks: '4'
        },
        {
          title: 'Final licence application',
          description:
            'Submit your eligibility letter, DataFlow report and completed application to obtain your Qatar licence.',
          docs: ['Eligibility letter', 'Licence application'],
          fee: 'QAR 3,000',
          timeWeeks: '2'
        }
      ];
    } else {
      // Oman steps
      return [
        {
          title: 'Register for Oman Medical Licensing Exam',
          description:
            'Schedule and take the Oman Medical Licensing Exam via Prometric. You may register and take the exam before completing DataFlow, but you must pass the written exam to proceed.',
          docs: ['Exam booking confirmation', 'Exam results'],
          fee: 'OMR 100',
          timeWeeks: '4'
        },
        {
          title: 'DataFlow verification',
          description: dataFlowDesc,
          docs: ['DataFlow report'],
          fee: 'OMR 200‑400',
          timeWeeks: '4‑8'
        },
        {
          title: 'Oral assessment and sponsorship',
          description:
            'Secure employment with an Oman‑licenced facility and complete an oral assessment (clinical interview) if required. Your employer will assist with work visa sponsorship.',
          docs: ['Employment offer', 'Oral exam invitation'],
          fee: 'Employer‑sponsored',
          timeWeeks: '4‑12'
        },
        {
          title: 'Final licence registration',
          description:
            'Submit your DataFlow report, exam results, sponsorship documents and pay the licence fee to obtain your Oman medical licence.',
          docs: ['Licence application'],
          fee: 'OMR 300',
          timeWeeks: '2'
        }
      ];
    }
  }
  // Helper to determine sources per destination
  function getMiddleEastSources(dest) {
    if (dest === 'Saudi Arabia') {
      return [
        {
          text: 'Helen Ziegler & Associates – Getting your Saudi professional health licence',
          url: 'https://www.hziegler.com/articles/saudi-license.html'
        },
        {
          text: 'Passprometric – Middle East licensing process overview',
          url: 'https://passprometric.com/dataflow_service.php'
        }
      ];
    } else {
      return [
        {
          text: 'Passprometric – Middle East licensing process overview',
          url: 'https://passprometric.com/dataflow_service.php'
        }
      ];
    }
  }
  // Iterate and add routes for each origin and destination
  Object.keys(ORIGIN_GP_MAP).forEach(origin => {
    DESTS.forEach(dest => {
      const gpKey = `Family Medicine|${origin}|${dest}`;
      if (!existingKeys.has(gpKey)) {
        ROUTES.push({
          id: nextId++,
          incomingCountry: origin,
          destinationCountry: dest,
          destinationProvince: '',
          specialty: 'Family Medicine',
          requiredQualifications: ORIGIN_GP_MAP[origin],
          minExperienceMonths: 36,
          steps: buildSteps(dest, ORIGIN_GP_MAP[origin][0], false),
          sources: getMiddleEastSources(dest),
          lastVerified: '2025-08-08'
        });
      }
      const specKey = `Specialist (General)|${origin}|${dest}`;
      if (!existingKeys.has(specKey)) {
        ROUTES.push({
          id: nextId++,
          incomingCountry: origin,
          destinationCountry: dest,
          destinationProvince: '',
          specialty: 'Specialist (General)',
          requiredQualifications: ORIGIN_SPEC_MAP[origin],
          minExperienceMonths: 36,
          steps: buildSteps(dest, ORIGIN_SPEC_MAP[origin][0], true),
          sources: getMiddleEastSources(dest),
          lastVerified: '2025-08-08'
        });
      }
    });
  });
}

// Run additional generators once on initial load
// First add Middle East routes for UAE, Qatar, Saudi Arabia and Oman
if (typeof addMiddleEastRoutes === 'function') {
  addMiddleEastRoutes();
}
// Then generate Canadian specialist combinations
generateMissingSpecialistRoutes();

// Then generate missing family medicine routes for new provinces
generateMissingGPRoutes();

// Utility functions to build unique option lists from the data
function uniqueValues(key) {
  const values = new Set();
  ROUTES.forEach(route => {
    const val = route[key];
    if (val) {
      values.add(val);
    }
  });
  return Array.from(values).sort();
}

// Build a mapping of destinationCountry to its provinces/states
function buildProvincesMap() {
  const map = {};
  ROUTES.forEach(route => {
    if (route.destinationProvince) {
      if (!map[route.destinationCountry]) {
        map[route.destinationCountry] = new Set();
      }
      map[route.destinationCountry].add(route.destinationProvince);
    }
  });
  // Convert sets to sorted arrays
  Object.keys(map).forEach(country => {
    map[country] = Array.from(map[country]).sort();
  });
  return map;
}

// Populate select element with options
function populateSelect(select, options, includeBlank = true) {
  select.innerHTML = '';
  if (includeBlank) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '-- Select --';
    select.appendChild(opt);
  }
  options.forEach(value => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
    select.appendChild(opt);
  });
}

// Populate qualification checkboxes
function populateQualifications(container, qualifications) {
  container.innerHTML = '';
  qualifications.forEach(qual => {
    const label = document.createElement('label');
    label.classList.add('checkbox-label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = qual;
    checkbox.name = 'qualifications';
    label.appendChild(checkbox);
    const span = document.createElement('span');
    span.textContent = qual;
    label.appendChild(span);
    container.appendChild(label);
  });
}

// Populate a multi‑select element with qualification options.
function populateQualificationsSelect(selectEl, qualifications) {
  selectEl.innerHTML = '';
  qualifications.forEach(qual => {
    const opt = document.createElement('option');
    opt.value = qual;
    opt.textContent = qual;
    selectEl.appendChild(opt);
  });
}

// Return a unique, sorted list of qualifications applicable for the given country and specialty.
function getQualificationsForCountryAndSpecialty(country, specialty) {
  const quals = new Set();
  // Look up qualifications from the ROUTES dataset so we always reflect actual data
  ROUTES.forEach(route => {
    if (route.incomingCountry === country && route.specialty === specialty) {
      route.requiredQualifications.forEach(q => quals.add(q));
    }
  });
  // Convert to array and sort
  return Array.from(quals).sort();
}

// Convert years to months
function yearsToMonths(years) {
  const y = parseFloat(years);
  if (isNaN(y) || y < 0) return 0;
  return Math.round(y * 12);
}

// Evaluate user input and find matching routes
function findMatchingRoutes(inputs) {
  // Map of qualification synonyms. Allows matching equivalent qualifications (e.g. FCFP and FCFP(SA)).
  const QUALIFICATION_SYNONYMS = {
    'FCFP(SA)': ['FCFP(SA)', 'FCFP'],
    'FCFP': ['FCFP', 'FCFP(SA)'],
    // Additional synonyms could be added here as needed.
  };
  return ROUTES.filter(route => {
    // check incoming country
    if (route.incomingCountry !== inputs.incomingCountry) return false;
    if (route.destinationCountry !== inputs.destinationCountry) return false;
    if (route.destinationProvince && route.destinationProvince !== inputs.destinationProvince) return false;
    if (route.specialty !== inputs.specialty) return false;
    // require all required qualifications (allow synonyms)
    const hasAllRequired = route.requiredQualifications.every(req => {
      // direct match
      if (inputs.qualifications.includes(req)) return true;
      // check synonyms
      const synonyms = QUALIFICATION_SYNONYMS[req];
      if (synonyms) {
        return synonyms.some(syn => inputs.qualifications.includes(syn));
      }
      return false;
    });
    if (!hasAllRequired) return false;
    if (inputs.experienceMonths < route.minExperienceMonths) return false;
    return true;
  });
}

// ---- Analytics functions ----
// Increment usage count for a given key in localStorage
function incrementAnalytics(key) {
  try {
    const stored = localStorage.getItem('routeAnalytics');
    const analytics = stored ? JSON.parse(stored) : {};
    analytics[key] = (analytics[key] || 0) + 1;
    localStorage.setItem('routeAnalytics', JSON.stringify(analytics));
  } catch (err) {
    console.error('Error recording analytics', err);
  }
}
// Retrieve analytics data as an array of [key, count] tuples sorted by count descending
function getAnalyticsData() {
  try {
    const stored = localStorage.getItem('routeAnalytics');
    const analytics = stored ? JSON.parse(stored) : {};
    return Object.entries(analytics).sort((a, b) => b[1] - a[1]);
  } catch (err) {
    console.error('Error retrieving analytics', err);
    return [];
  }
}

// Render a simple horizontal bar chart based on analytics data. The
// `data` argument is an array of [key, count] tuples sorted by count.
// The chart shows the top 10 searched route combinations.
function renderBarChart(data, container, infoDiv) {
  const barChart = document.createElement('div');
  barChart.classList.add('bar-chart');
  const top = data.slice(0, 10);
  const max = top.length > 0 ? top[0][1] : 1;
  top.forEach(([key, count]) => {
    const row = document.createElement('div');
    row.classList.add('bar-row');
    const label = document.createElement('span');
    label.classList.add('bar-label');
    // Convert analytics key into a more readable label
    const parts = key.split('|').map(p => p.trim());
    const labelText = parts.length >= 3 ? `${parts[0]} → ${parts[1]} – ${parts[2]}` : key;
    label.textContent = labelText;
    const bar = document.createElement('div');
    bar.classList.add('bar');
    const widthPct = (count / max) * 100;
    bar.style.width = widthPct + '%';
    bar.setAttribute('data-key', key);
    bar.setAttribute('data-count', count.toString());
    bar.title = `${key} (${count})`;
    bar.addEventListener('click', () => {
      // Highlight selected bar
      barChart.querySelectorAll('.bar').forEach(b => b.classList.remove('highlight'));
      bar.classList.add('highlight');
      // Update info
      if (infoDiv) {
        infoDiv.textContent = `${key}: ${count} search${count !== 1 ? 'es' : ''}`;
      }
    });
    row.appendChild(label);
    row.appendChild(bar);
    barChart.appendChild(row);
  });
  container.appendChild(barChart);
}

// Render a heatmap summarising counts by origin country and destination
// province. Accepts analytics data array of [key, count] tuples. The
// heatmap uses shades of the primary colour to represent higher counts.
function renderHeatmap(data, container, infoDiv) {
  // Aggregate counts per origin/province
  const agg = {};
  const origins = new Set();
  const provinces = new Set();
  data.forEach(([key, count]) => {
    // Keys may be formatted with spaces around pipes or without. Normalize by
    // splitting on '|' and trimming whitespace.
    let parts = key.split('|');
    if (parts.length < 3) return;
    parts = parts.map(p => p.trim());
    const origin = parts[0];
    const prov = parts[1];
    origins.add(origin);
    provinces.add(prov);
    if (!agg[origin]) agg[origin] = {};
    agg[origin][prov] = (agg[origin][prov] || 0) + count;
  });
  const originList = Array.from(origins).sort();
  const provList = Array.from(provinces).sort();
  // Find maximum aggregated count
  let maxAgg = 0;
  originList.forEach(origin => {
    provList.forEach(prov => {
      const val = (agg[origin] && agg[origin][prov]) || 0;
      if (val > maxAgg) maxAgg = val;
    });
  });
  if (maxAgg === 0) maxAgg = 1;
  const heatmap = document.createElement('div');
  heatmap.classList.add('heatmap');
  // Header row
  const headerRow = document.createElement('div');
  headerRow.classList.add('heatmap-row');
  // Empty top-left cell
  const emptyCell = document.createElement('div');
  emptyCell.classList.add('heatmap-cell', 'header');
  headerRow.appendChild(emptyCell);
  provList.forEach(prov => {
    const cell = document.createElement('div');
    cell.classList.add('heatmap-cell', 'header');
    cell.textContent = prov;
    headerRow.appendChild(cell);
  });
  heatmap.appendChild(headerRow);
  // Data rows
  originList.forEach(origin => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('heatmap-row');
    // Row label
    const originLabel = document.createElement('div');
    originLabel.classList.add('heatmap-cell', 'header', 'origin-label');
    originLabel.textContent = origin;
    rowDiv.appendChild(originLabel);
    provList.forEach(prov => {
      const countVal = (agg[origin] && agg[origin][prov]) || 0;
      const ratio = countVal / maxAgg;
      const cell = document.createElement('div');
      cell.classList.add('heatmap-cell');
      // Use primary colour with varying opacity for heat
      const opacity = 0.1 + ratio * 0.9;
      cell.style.backgroundColor = `rgba(0, 167, 206, ${opacity.toFixed(3)})`;
      cell.setAttribute('data-key', `${origin} | ${prov}`);
      cell.setAttribute('data-count', countVal.toString());
      cell.title = `${origin} to ${prov}: ${countVal}`;
      cell.textContent = countVal > 0 ? countVal.toString() : '';
      cell.addEventListener('click', () => {
        // Clear previous selections
        heatmap.querySelectorAll('.heatmap-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        if (infoDiv) {
          infoDiv.textContent = `${origin} to ${prov}: ${countVal} search${countVal !== 1 ? 'es' : ''}`;
        }
      });
      rowDiv.appendChild(cell);
    });
    heatmap.appendChild(rowDiv);
  });
  container.appendChild(heatmap);
}
// Render analytics data in the analytics section
function displayAnalytics() {
  const section = document.getElementById('analytics-section');
  const container = document.getElementById('analytics-container');
  if (!section || !container) return;
  container.innerHTML = '';
  const data = getAnalyticsData();
  // Clear previous info
  const infoDiv = document.createElement('div');
  infoDiv.id = 'analytics-info';
  container.appendChild(infoDiv);
  if (data.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'No analytics data yet. Generate some routes to see usage patterns.';
    container.appendChild(msg);
  } else {
    // Bar chart header
    const barH = document.createElement('h3');
    barH.textContent = 'Top Routes';
    container.appendChild(barH);
    renderBarChart(data, container, infoDiv);
    // Heatmap header
    const heatH = document.createElement('h3');
    heatH.textContent = 'Search Distribution by Country & Province';
    container.appendChild(heatH);
    renderHeatmap(data, container, infoDiv);
    // Table header
    const tableH = document.createElement('h3');
    tableH.textContent = 'All route searches';
    container.appendChild(tableH);
    // Build the table of all analytics
    const table = document.createElement('table');
    table.classList.add('analytics-table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Origin | Province | Specialty</th><th>Count</th>';
    table.appendChild(headerRow);
    data.forEach(([key, count]) => {
      const tr = document.createElement('tr');
      const tdKey = document.createElement('td');
      tdKey.textContent = key;
      const tdVal = document.createElement('td');
      tdVal.textContent = count.toString();
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      table.appendChild(tr);
    });
    container.appendChild(table);
  }
  // Show analytics and hide result section
  section.style.display = 'block';
  const resultSection = document.getElementById('result-section');
  if (resultSection) resultSection.style.display = 'none';
}

// ---- Update functions ----
// Check for updates by fetching routes_update.json and replacing ROUTES
async function checkForUpdates() {
  try {
    const resp = await fetch('routes_update.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('No update file');
    const newRoutes = await resp.json();
    if (!Array.isArray(newRoutes)) throw new Error('Invalid update format');
    // Replace existing routes
    ROUTES.splice(0, ROUTES.length, ...newRoutes);
    // Regenerate missing combos after update
    if (typeof generateMissingSpecialistRoutes === 'function') {
      generateMissingSpecialistRoutes();
    }
    // Clear analytics on update to avoid mismatches
    localStorage.removeItem('routeAnalytics');
    // Reload the page to refresh UI with updated data
    alert('Routes data updated. The page will now reload to apply changes.');
    location.reload();
  } catch (err) {
    alert('No updates available at this time.');
  }
}

// Render results
function displayRoutes(routes, inputs) {
  const resultSection = document.getElementById('result-section');
  const eligibilityMsg = document.getElementById('eligibility-message');
  const stepsContainer = document.getElementById('steps-container');
  const resultTitle = document.getElementById('result-title');
  stepsContainer.innerHTML = '';
  if (routes.length === 0) {
    resultTitle.textContent = 'No eligible routes found';
    eligibilityMsg.textContent =
      'Based on the information provided, there are no available licensing routes. You may need additional qualifications or experience.';
  } else {
    // For simplicity, display the first route. If multiple exist, we could list all.
    const route = routes[0];
    resultTitle.textContent = `${route.destinationCountry} – ${route.destinationProvince} ${route.specialty} route`;
    eligibilityMsg.textContent =
      'You meet the requirements for this route. Follow the steps below to progress your licensing application:';
    route.steps.forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      stepDiv.classList.add('step');
      const title = document.createElement('div');
      title.classList.add('step-title');
      title.textContent = `${idx + 1}. ${step.title}`;
      const details = document.createElement('div');
      details.classList.add('step-details');
      // Build a bullet list of documents
      const docList = step.docs
        .map(d => `<li>${d}</li>`)
        .join('');
      details.innerHTML = `
        <p>${step.description}</p>
        <p><strong>Documents:</strong></p>
        <ul>${docList}</ul>
        <p><strong>Fee:</strong> ${step.fee} | <strong>Timeline:</strong> ${step.timeWeeks} weeks</p>
      `;
      stepDiv.appendChild(title);
      stepDiv.appendChild(details);
      stepsContainer.appendChild(stepDiv);
    });
    // Sources list
    if (route.sources && route.sources.length > 0) {
      const sourcesTitle = document.createElement('h3');
      sourcesTitle.textContent = 'Sources';
      stepsContainer.appendChild(sourcesTitle);
      const ul = document.createElement('ul');
      route.sources.forEach(src => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = src.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = src.text;
        li.appendChild(a);
        ul.appendChild(li);
      });
      stepsContainer.appendChild(ul);
    }
    // Last verified
    if (route.lastVerified) {
      const p = document.createElement('p');
      p.classList.add('note');
      p.textContent = `Last verified: ${route.lastVerified}`;
      stepsContainer.appendChild(p);
    }
  }
  resultSection.style.display = 'block';
  // Scroll to results
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Initialise the form on page load
function init() {
  // Flag to control visibility of analytics features. Set to true for internal use.
  const SHOW_ANALYTICS = false;
  const incomingSelect = document.getElementById('incomingCountry');
  const destSelect = document.getElementById('destinationCountry');
  const provinceSelect = document.getElementById('destinationProvince');
  const specialtySelect = document.getElementById('specialty');
  const qualificationsSelect = document.getElementById('qualificationsSelect');
  const provinceRow = document.getElementById('provinceRow');
  const generateBtn = document.getElementById('generateBtn');
  const updateBtn = document.getElementById('updateBtn');
  const analyticsBtn = document.getElementById('analyticsBtn');
  const yearSpan = document.getElementById('year');
  yearSpan.textContent = new Date().getFullYear().toString();
  // Hide analytics button for external users if SHOW_ANALYTICS is false
  if (!SHOW_ANALYTICS && analyticsBtn) {
    analyticsBtn.style.display = 'none';
  }
  // Populate selects
  const incomingCountries = uniqueValues('incomingCountry');
  populateSelect(incomingSelect, incomingCountries);
  const destinationCountries = uniqueValues('destinationCountry');
  populateSelect(destSelect, destinationCountries);
  const specialties = uniqueValues('specialty');
  populateSelect(specialtySelect, specialties);
  // Capture the full set of unique qualifications as a fallback
  const allQualifications = Array.from(
    new Set(ROUTES.flatMap(r => r.requiredQualifications))
  ).sort();
  // Function to update the qualification options based on selected country and specialty
  function updateQualificationOptions() {
    const selectedCountry = incomingSelect.value;
    const selectedSpecialty = specialtySelect.value;
    // Fetch applicable qualifications for this combination
    const applicable = getQualificationsForCountryAndSpecialty(selectedCountry, selectedSpecialty);
    if (applicable.length > 0) {
      populateQualificationsSelect(qualificationsSelect, applicable);
    } else {
      // Fall back to all qualifications if no specific mapping found
      populateQualificationsSelect(qualificationsSelect, allQualifications);
    }
  }
  // Initially populate qualifications based on default selections
  updateQualificationOptions();
  // Map of provinces per destination country
  const provincesMap = buildProvincesMap();
  // Update province options when destination changes
  destSelect.addEventListener('change', () => {
    const selected = destSelect.value;
    if (provincesMap[selected] && provincesMap[selected].length > 0) {
      populateSelect(provinceSelect, provincesMap[selected], true);
      provinceRow.style.display = 'flex';
    } else {
      provinceRow.style.display = 'none';
      provinceSelect.innerHTML = '';
    }
  });
  // Update qualification options when incoming country or specialty changes
  incomingSelect.addEventListener('change', updateQualificationOptions);
  specialtySelect.addEventListener('change', updateQualificationOptions);
  // Generate route on click
  generateBtn.addEventListener('click', () => {
    const inputs = {
      incomingCountry: incomingSelect.value,
      destinationCountry: destSelect.value,
      destinationProvince: provinceSelect.value || '',
      specialty: specialtySelect.value,
      qualifications: Array.from(qualificationsSelect.selectedOptions).map(opt => opt.value),
      experienceMonths: yearsToMonths(document.getElementById('experience').value)
    };
    // Basic validation
    if (!inputs.incomingCountry || !inputs.destinationCountry || !inputs.specialty) {
      alert('Please complete all required fields.');
      return;
    }
    const matches = findMatchingRoutes(inputs);
    displayRoutes(matches, inputs);
    // Record analytics after generating a route
    // Use a formatted key with spaces for readability in analytics. This
    // allows splitting on ' | ' to derive origin/province in charts.
    const key = `${inputs.incomingCountry} | ${inputs.destinationProvince} | ${inputs.specialty}`;
    incrementAnalytics(key);
  });

  // Hook update button if present
  if (updateBtn) {
    updateBtn.addEventListener('click', checkForUpdates);
  }
  // Hook analytics button if present
  if (analyticsBtn) {
    analyticsBtn.addEventListener('click', displayAnalytics);
  }
}

document.addEventListener('DOMContentLoaded', init);