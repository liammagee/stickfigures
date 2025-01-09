function historicalityTimeline() {
  // Scene 1: Introduction to Dasein's Temporal Nature
  const scene1 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 1: Dasein exists as fundamentally temporal, always already thrown into a historical world...",
    backgroundColor: "#f0f5ff",
    actions: [
      // Figure[0] represents Dasein, Figure[1] represents historical world
      { fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL) },
      { 
        fn: () => SpeechHelper.say(figures[0], "I am always already here...") 
      },
      { 
        fn: AnimationHelpers.walk(figures[1], -20),
        position: "+=0.5"
      },
      { 
        fn: () => SpeechHelper.say(figures[1], "Within a world of inherited meaning"),
        position: "<"
      },
      { fn: () => SpeechHelper.clearAllSpeech(), position: "+=2" }
    ]
  });

  // Scene 2: Thrown Projection
  const scene2 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 2: Dasein projects possibilities based on its throwness...",
    backgroundColor: "#fff0f5",
    actions: [
      { 
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: -Math.PI / 3,
          rightShoulderAngle: Math.PI / 3,
          leftElbowAngle: -Math.PI / 4,
          rightElbowAngle: Math.PI / 4
        })
      },
      { 
        fn: () => SpeechHelper.say(figures[0], "Understanding through inherited possibilities") 
      },
      {
        fn: AnimationHelpers.walk(figures[0], 30),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "The past shapes future projections"),
        position: "+=1"
      }
    ]
  });

  // Scene 3: The Moment of Vision (Augenblick)
  const scene3 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 3: The authentic moment of vision (Augenblick) unifies temporal dimensions...",
    backgroundColor: "#f5f0ff",
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: Math.PI / 4,
          rightShoulderAngle: -Math.PI / 4,
          leftElbowAngle: Math.PI / 3,
          rightElbowAngle: -Math.PI / 3
        }, 1.5)
      },
      {
        fn: () => SpeechHelper.say(figures[0], "In this moment, I grasp my situation"),
        position: "<"
      },
      {
        fn: AnimationHelpers.walk(figures[1], 20),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "Past, present, and future unite"),
        position: "+=1"
      }
    ]
  });

  // Scene 4: Heritage and Repetition
  const scene4 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 4: Authentic historicality involves taking over one's heritage...",
    backgroundColor: "#f0fff5",
    duration: 2,
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: 0,
          rightShoulderAngle: 0,
          leftElbowAngle: -Math.PI / 6,
          rightElbowAngle: Math.PI / 6
        }, 2)
      },
      {
        fn: AnimationHelpers.walk(figures[1], -10),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[0], "Choosing to repeat inherited possibilities"),
        position: "+=0.5"
      },
      {
        fn: () => SpeechHelper.say(figures[1], "The past becomes a source of authentic future"),
        position: "+=1"
      }
    ]
  });

  totalSteps = 4;

  return TimelineManager.createSteppedTimeline(
    [scene1, scene2, scene3, scene4],
    {
      onAllComplete: () => {
        narrativeText.textContent = "Historicality reveals Dasein as fundamentally temporal and historical in its being.";
        updateStepButtons();
      },
      onTimelineUpdate: () => updateStepButtons()
    }
  );
}

  
function historicalityInitialize() {
    SceneHelpers.initialize();
  
    SceneHelpers.updateNarrativeText("Heidegger's Concept of Historicality (Geschichtlichkeit)");
    
    masterTimeline = historicalityTimeline();
    
    initializeStepButtons();
    
    // Position figures
    figures[0].x = canvas.width * 0.3; // Dasein
    figures[1].x = canvas.width * 0.7; // Historical world
    
    // Add subtle movement suggesting temporal flow
    gsap.to(figures[1], {
      y: "+=3",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    drawAllFigures();
    updateStepButtons();
  }
  

// Modify the second figure to represent the historical world
function setupHistoricalWorld() {
    figures[1] = {
      ...figures[1],
      // Add additional properties to represent historical dimension
      neckLength: 10,
      torsoLength: 50,
      upperArmLength: 30,
      lowerArmLength: 30
    };
  }
  

// Make functions available to scenario manager
window.historicalityTimeline = historicalityTimeline;
window.historicalityInitialize = historicalityInitialize;