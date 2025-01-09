function interpretationTimeline() {
  // Scene 1: Event and Meaning
  const scene1 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 1: Speech Event - The living dialogue where meaning and event are united...",
    backgroundColor: "#f0f5ff",
    actions: [
      // Figure 1 represents speaker, Figure 2 represents listener
      { fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL) },
      { fn: () => SpeechHelper.say(figures[0], "Living speech...") },
      { 
        fn: AnimationHelpers.setPose(figures[1], POSES.NEUTRAL),
        position: "<"
      },
      { fn: () => SpeechHelper.say(figures[1], "Direct understanding..."), position: "<" },
      { 
        fn: AnimationHelpers.walk(figures[1], -20),
        position: "+=1"
      },
      { fn: () => SpeechHelper.clearAllSpeech(), position: "+=1.5" }
    ]
  });

  // Scene 2: Distanciation
  const scene2 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 2: Distanciation - The text becomes autonomous from its author...",
    backgroundColor: "#fff0f5",
    actions: [
      { 
        fn: AnimationHelpers.walk(figures[0], 40)
      },
      { 
        fn: () => SpeechHelper.say(figures[0], "The text stands alone...") 
      },
      {
        fn: AnimationHelpers.setPose(figures[1], {
          leftShoulderAngle: -Math.PI / 4,
          rightShoulderAngle: Math.PI / 4,
          leftElbowAngle: -Math.PI / 6,
          rightElbowAngle: Math.PI / 6
        }),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "Semantic autonomy..."),
        position: "<"
      }
    ]
  });

  // Scene 3: From Sense to Reference
  const scene3 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 3: The text opens up a world - From sense to reference...",
    backgroundColor: "#f5f0ff",
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: Math.PI / 4,
          rightShoulderAngle: -Math.PI / 4,
          leftElbowAngle: Math.PI / 6,
          rightElbowAngle: -Math.PI / 6
        })
      },
      {
        fn: () => SpeechHelper.say(figures[0], "Beyond the text itself...", 2, -120),
        position: "<"
      },
      {
        fn: AnimationHelpers.setPose(figures[1], POSES.ARMS_RAISED),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "A world unfolds..."),
        position: "<"
      }
    ]
  });

  // Scene 4: Appropriation
  const scene4 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 4: Appropriation - Understanding oneself in front of the text...",
    backgroundColor: "#f0fff5",
    duration: 2,
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: 0,
          rightShoulderAngle: 0,
          leftElbowAngle: -Math.PI / 4,
          rightElbowAngle: Math.PI / 4,
          leftHipAngle: 0,
          rightHipAngle: 0
        }, 2)
      },
      {
        fn: AnimationHelpers.walk(figures[1], -30),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[0], "Self-understanding..."),
        position: "+=0.5"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "Through the text's world"),
        position: "<"
      }
    ]
  });

  totalSteps = 4;

  return TimelineManager.createSteppedTimeline(
    [scene1, scene2, scene3, scene4],
    {
      onAllComplete: () => {
        narrativeText.textContent = "The arc of interpretation is complete: from speech event through distanciation to appropriation.";
        updateStepButtons();
      },
      onTimelineUpdate: () => updateStepButtons()
    }
  );
}

// Modified initialization to reflect Ricoeur's specific concepts
function interpretationInitialize() {
  SceneHelpers.initialize();
  
  // Set initial narrative text reflecting Ricoeur's theory
  SceneHelpers.updateNarrativeText("Welcome to Ricoeur's Theory of Interpretation - From discourse to understanding...");
  
  // Create timeline
  masterTimeline = interpretationTimeline();
  
  // Initialize UI
  initializeStepButtons();
  
  // Setup initial figure positions
  figures[0].x = canvas.width * 0.3; // Speaker/Text
  figures[1].x = canvas.width * 0.7; // Listener/Reader
  
  // Draw figures and start breathing animation
  drawAllFigures();
  figures.forEach(AnimationHelpers.breathe);
  
  // Initialize button states
  updateStepButtons();
}


// Make functions available to scenario manager
window.interpretationTimeline = interpretationTimeline;
window.interpretationInitialize = interpretationInitialize;