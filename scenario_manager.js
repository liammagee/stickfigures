// First, let's modify your HTML to add the scenario selector
const scenarioSelectorHTML = `
<div class="scenario-selector">
  <select id="scenarioSelect" class="scenario-dropdown">
    <option value="outrage">Emotional Outrage</option>
    <option value="interpretation">Ricoeur's Interpretation</option>
    <option value="ai">Human-ASI Encounter</option>
    <option value="historicality">Heidegger's Historicality</option>
    <option value="nietzsche">Nietzsche's Critique of Morality</option>
    <option value="adorno">Adorno's Critique of Heidegger</option>
  </select>
</div>
`;

// Scenario Manager to handle different scenarios
const ScenarioManager = {
  currentScenario: null,
  scenarios: {
    outrage: {
      name: "Emotional Outrage",
      createTimeline: outrageTimeline,
      initialize: outrageInitialize,
      figureConfig: {
        figure1: { isAndroid: false },
        figure2: { isAndroid: false }
      }
    },
    interpretation: {
      name: "Ricoeur's Interpretation",
      createTimeline: interpretationTimeline,
      initialize: interpretationInitialize,
      figureConfig: {
        figure1: { isAndroid: false },
        figure2: { isAndroid: false }
      }
    },
    ai: {
      name: "Human-ASI Encounter",
      createTimeline: asiTimeline,
      initialize: asiInitialize,
      figureConfig: {
        figure1: { isAndroid: false },
        figure2: { isAndroid: true }
      }
    },
    historicality: {
      name: "Heidegger's Historicality",
      createTimeline: historicalityTimeline,
      initialize: historicalityInitialize,
      figureConfig: {
        figure1: { isAndroid: false },
        figure2: { isAndroid: false }
      }
    },
    nietzsche: {
        name: "Nietzsche's Critique of Morality",
        createTimeline: nietzscheTimeline,
        initialize: nietzscheInitialize,
        figureConfig: {
          figure1: { isAndroid: false },
          figure2: { isAndroid: false }
        }
      },
    adorno: {
      name: "Adorno's Critique of Heidegger",
      createTimeline: adornoTimeline,
      initialize: adornoInitialize,
      figureConfig: {
        figure1: { isAndroid: false },
        figure2: { isAndroid: false }
      }
    }
  },

  initialize() {
    // Add scenario selector to DOM
    const controlsDiv = document.querySelector('.controls');
    controlsDiv.insertAdjacentHTML('afterbegin', scenarioSelectorHTML);

    // Add event listener for scenario changes
    const selector = document.getElementById('scenarioSelect');
    selector.addEventListener('change', (e) => {
      this.loadScenario(e.target.value);
    });

    // Load default scenario
    this.loadScenario(selector.value);
  },

  loadScenario(scenarioId) {
    // Reset current state
    TimelineManager.reset();
    
    // Get scenario configuration
    const scenario = this.scenarios[scenarioId];
    if (!scenario) {
      console.error('Unknown scenario:', scenarioId);
      return;
    }

    // Update current scenario
    this.currentScenario = scenario;

    // Reset and configure figures
    figures.forEach((fig, index) => {
      // Reset to neutral pose
      Object.assign(fig, POSES.NEUTRAL);
      // Apply scenario-specific figure configuration
      const figConfig = index === 0 ? scenario.figureConfig.figure1 : scenario.figureConfig.figure2;
      fig.isAndroid = figConfig.isAndroid;
    });

    // Initialize new scenario
    if (scenario.initialize) {
      scenario.initialize();
    }

    // Update createTimeline function
    window.createTimeline = scenario.createTimeline;

    // Reset UI
    SceneHelpers.updateNarrativeText("Click 'Start the Narrative' to begin...");
    drawAllFigures();
  }
};

// Add CSS for the scenario selector
const style = document.createElement('style');
style.textContent = `
  .scenario-selector {
    margin-bottom: 1rem;
  }

  .scenario-dropdown {
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    width: 200px;
  }

  .scenario-dropdown:hover {
    border-color: #888;
  }

  .scenario-dropdown:focus {
    outline: none;
    border-color: #666;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);

// Modified initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize base components
  SceneHelpers.initialize();
  
  // Initialize scenario manager
  ScenarioManager.initialize();
  
  // Add event listeners for controls
  startButton.addEventListener('click', startNarrative);
  prevButton.addEventListener('click', () => {
    TimelineManager.previousStep();
    updateStepButtons();
  });
  pauseButton.addEventListener('click', () => {
    TimelineManager.togglePause();
    updateStepButtons();
  });
  nextButton.addEventListener('click', () => {
    TimelineManager.nextStep();
    updateStepButtons();
  });
  resetButton.addEventListener('click', resetAnimation);
});