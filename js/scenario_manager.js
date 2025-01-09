

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

    console.log(scenario)
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

    // Update createTimeline function
    window.createTimeline = scenario.createTimeline;

    // Initialize new scenario
    if (scenario.initialize) {
      scenario.initialize();
    }


    // Reset UI
    SceneHelpers.updateNarrativeText("Click 'Start the Narrative' to begin...");
    drawAllFigures();
  }
};


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