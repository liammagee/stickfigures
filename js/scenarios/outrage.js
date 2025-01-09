function outrageTimeline() {
  // Define scenes using SceneHelpers
  const scene1 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 1: Our two stick figures meet politely...",
    backgroundColor: "#fafafa",
    actions: [
      { fn: AnimationHelpers.wave(figures[0]) },
      { fn: () => SpeechHelper.say(figures[0], "Hey, nice day!") },
      { fn: AnimationHelpers.wave(figures[1]), position: "-=1" },
      { fn: () => SpeechHelper.say(figures[1], "Indeed, lovely weather!") },
      { fn: () => SpeechHelper.clearAllSpeech(), position: "+=1.5" }
    ]
  });

  // Scene 2: Rising Tension
  const scene2 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 2: A minor disagreement starts. Tensions rise...",
    backgroundColor: "#ffe8e8",
    actions: [
      { 
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: -Math.PI / 3,
          rightShoulderAngle: Math.PI / 3,
          leftElbowAngle: -Math.PI / 4,
          rightElbowAngle: Math.PI / 4,
          leftHipAngle: Math.PI / 12,
          rightHipAngle: -Math.PI / 12
        })
      },
      { 
        fn: AnimationHelpers.walk(figures[1], 30), 
        position: "<" 
      },
      { 
        fn: AnimationHelpers.setPose(figures[1], POSES.DEFENSIVE), 
        position: "<" 
      }
    ]
  });

  // Scene 3: Peak Confrontation
  const scene3 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 3: Figure1 becomes agitated, expressing strong emotions!",
    backgroundColor: "#ffd9d9",
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], POSES.ARMS_RAISED, 1.5, "elastic.out(1, 0.5)")
      },
      {
        fn: () => SpeechHelper.say(figures[0], "I'm outraged!!", 2, -120),
        position: "<"
      },
      {
        fn: AnimationHelpers.walk(figures[1], 40),
        position: "<"
      },
      {
        fn: AnimationHelpers.setPose(figures[1], {
          leftShoulderAngle: -Math.PI / 4,
          rightShoulderAngle: Math.PI / 4,
          leftElbowAngle: -Math.PI / 6,
          rightElbowAngle: Math.PI / 6,
          leftHipAngle: Math.PI / 6,
          rightHipAngle: -Math.PI / 6
        }),
        position: "<"
      },
      {
        fn: AnimationHelpers.shake(figures[0])
      }
    ]
  });

  // Scene 4: De-escalation
  const scene4 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 4: The situation begins to calm down...",
    backgroundColor: "#e8ffe8",
    duration: 1,  // Note: Added duration parameter for the background transition
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL, 2)
      },
      {
        fn: AnimationHelpers.setPose(figures[1], POSES.NEUTRAL, 2),
        position: "<"
      }
    ]
  });

  totalSteps = 4;

  return TimelineManager.createSteppedTimeline(
    [scene1, scene2, scene3, scene4],
    {
      onAllComplete: () => {
        narrativeText.textContent = "End of the story! Both figures have completed their arcs.";
        updateStepButtons();
      },
      onTimelineUpdate: () => updateStepButtons()
    }
  );
}



// Initialize animation
function outrageInitialize() {
  // Make sure SceneHelpers is initialized first
  SceneHelpers.initialize();
  
  // Create the master timeline
  masterTimeline = outrageTimeline();
  
  // Initialize UI elements
  initializeStepButtons();
  
  // Draw figures and start breathing animation
  drawAllFigures();
  figures.forEach(AnimationHelpers.breathe);
  
  // Initialize button states
  updateStepButtons();
}

// Make functions available to scenario manager
window.outrageTimeline = outrageTimeline;
window.outrageInitialize = outrageInitialize;