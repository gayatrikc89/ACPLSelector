// Object to store weights for different features
const featureWeights = {
  macSupport: 2,
  dacSupport: 2,
  environmentalAttribute: 1.5,
  historySupport: 1.5,
  objectReview: 2,
  runtimeChanges: 2.5,
  guiBased: 1.5,
  sandboxProvided: 1.5,
  adminManagement: 2,
  xmlBased: 1,
  relationBased: 1.2,
  declarativeLanguage: 1.8,
  domainSpecificLanguage: 2,
  easyReadable: 2.5,
  wellReadable: 2,
  difficultReadable: -1 // Negative weight for difficult readability
};

// Object to store languages and their features
const languageMapping = {
  "XACML": {
    features: {
      macSupport: true,
      dacSupport: true,
      environmentalAttribute: true,
      historySupport: false,
      objectReview: false,
      runtimeChanges: false,
      guiBased: false,
      sandboxProvided: true,
      adminManagement: true,
      xmlBased: true,
      relationBased: false,
      declarativeLanguage: false,
      domainSpecificLanguage: false,
      easyReadable: false,
      wellReadable: false,
      difficultReadable: true
    },
    score: 0
  },
  "NGAC": {
    features: {
      macSupport: true,
      dacSupport: true,
      environmentalAttribute: false,
      historySupport: true,
      objectReview: true,
      runtimeChanges: true,
      guiBased: true,
      sandboxProvided: false,
      adminManagement: true,
      xmlBased: false,
      relationBased: true,
      declarativeLanguage: false,
      domainSpecificLanguage: false,
      easyReadable: false,
      wellReadable: true,
      difficultReadable: false
    },
    score: 0
  },
  "Polar": {
    features: {
      macSupport: true,
      dacSupport: true,
      environmentalAttribute: true,
      historySupport: false,
      objectReview: true,
      runtimeChanges: true,
      guiBased: true,
      sandboxProvided: true,
      adminManagement: true,
      xmlBased: false,
      relationBased: false,
      declarativeLanguage: true,
      domainSpecificLanguage: false,
      easyReadable: false,
      wellReadable: true,
      difficultReadable: false
    },
    score: 0
  },
  "SAPL": {
    features: {
      macSupport: true,
      dacSupport: true,
      environmentalAttribute: true,
      historySupport: true,
      objectReview: true,
      runtimeChanges: true,
      guiBased: false,
      sandboxProvided: true,
      adminManagement: true,
      xmlBased: false,
      relationBased: false,
      declarativeLanguage: false,
      domainSpecificLanguage: true,
      easyReadable: true,
      wellReadable: false,
      difficultReadable: false
    },
    score: 0
  }
  // Add other languages similarly...
};

// Function to update scores based on feature support and weightage
function updateScores(feature, scoreValue = 1) {
  const weight = featureWeights[feature] || 1; // Default weight is 1 if no weight is defined
  for (const language in languageMapping) {
    if (languageMapping[language].features[feature]) {
      languageMapping[language].score += scoreValue * weight;
    }
  }
}

// Function to recommend languages based on user selections
function recommendLanguages() {
  // Reset scores for all languages
  for (const language in languageMapping) {
    languageMapping[language].score = 0;
  }

  // Get values from form and update scores
  const macSupport = document.getElementById("Policy Support for MAC").value === "Yes";
  if (macSupport) updateScores('macSupport');

  const dacSupport = document.getElementById("Policy Support for DAC").value === "Yes";
  if (dacSupport) updateScores('dacSupport');

  const environmentalAttribute = document.getElementById("Environmental Attribute").value === "necessary";
  if (environmentalAttribute) updateScores('environmentalAttribute');

  const historySupport = document.getElementById("History-based Policy Support").value === "Yes";
  if (historySupport) updateScores('historySupport');

  const objectReview = document.getElementById("Per-Object Review and Per-User Review of Combined Policies").value === "necessary";
  if (objectReview) updateScores('objectReview');

  const runtimeChanges = document.getElementById("Run-time changes of access control policies").value === "necessary";
  if (runtimeChanges) updateScores('runtimeChanges');

  const guiBased = document.getElementById("GUI/Graph Based").value === "Necessary";
  if (guiBased) updateScores('guiBased');

  const sandboxProvided = document.getElementById("Sandbox to test policies provided").value === "Yes";
  if (sandboxProvided) updateScores('sandboxProvided');

  const adminManagement = document.getElementById("Administration and Management of Policies & Attributes").value === "Yes";
  if (adminManagement) updateScores('adminManagement');

  // Checkboxes for additional features
  // if (document.getElementById("XML based").checked) updateScores('xmlBased');
  // if (document.getElementById("Relation-based").checked) updateScores('relationBased');
  // if (document.getElementById("Declarative & Logic Programming Language").checked) updateScores('declarativeLanguage');
  // if (document.getElementById("Domain Specific Language").checked) updateScores('domainSpecificLanguage');
  // if (document.getElementById("Easy Readable and Easy Writeable").checked) updateScores('easyReadable');
  // if (document.getElementById("Well Readable and Well Writeable").checked) updateScores('wellReadable');
  // if (document.getElementById("Difficult Readable and Difficult Writeable").checked) updateScores('difficultReadable', -1); // Negative score for difficult readability
// Get the selected option for 'languageUsed'
  const languageUsed = document.querySelector('input[name="languageUsed"]:checked').value;

  // Update scores based on the selected language used to write policy
  switch(languageUsed) {
    case 'XML based':
      updateScores('xmlBased');
      break;
    case 'Relation-based':
      updateScores('relationBased');
      break;
    case 'Declarative & Logic Programming Language':
      updateScores('declarativeLanguage');
      break;
    case 'Domain Specific Language':
      updateScores('domainSpecificLanguage');
      break;
    default:
      console.log('No language selected');
  }

  // Get the selected option for 'languageUsability'
  const languageUsability = document.querySelector('input[name="languageUsability"]:checked').value;

  // Update scores based on the selected language usability
  switch(languageUsability) {
    case 'Easy Readable and Easy Writeable':
      updateScores('easyReadable');
      break;
    case 'Well Readable and Well Writeable':
      updateScores('wellReadable');
      break;
    case 'Difficult Readable and Difficult Writeable':
      updateScores('difficultReadable', -1);
      break;
    default:
      console.log('No usability selected');
  }

  // Filter languages with non-zero scores
  const recommendedLanguages = {};
  for (const [language, data] of Object.entries(languageMapping)) {
    if (data.score > 0) {
      recommendedLanguages[language] = data;
    }
  }

  // Store recommended languages in local storage for use in result page
  localStorage.setItem('recommendedLanguages', JSON.stringify(recommendedLanguages));

  // Redirect to results page
  window.location.href = 'result.html';
}
