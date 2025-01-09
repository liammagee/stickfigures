function adornoTimeline() {
  // Scene 1: The Jargon of Authenticity
  const scene1 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 1: Adorno identifies the mystifying language of authenticity...",
    backgroundColor: "#f5f5f5",
    actions: [
      // Figure[0] represents Adorno's critique, Figure[1] represents Heideggerian concepts
      { fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL) },
      { 
        fn: () => SpeechHelper.say(figures[1], "Authentic Being reveals itself...") 
      },
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: Math.PI / 4,
          rightShoulderAngle: -Math.PI / 4,
          leftElbowAngle: Math.PI / 3,
          rightElbowAngle: -Math.PI / 3
        })
      },
      { 
        fn: () => SpeechHelper.say(figures[0], "This language conceals social reality!"),
        position: "+=1"
      },
      { fn: () => SpeechHelper.clearAllSpeech(), position: "+=2" }
    ]
  });

  // Scene 2: Reification of History
  const scene2 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 2: The ahistorical nature of Heidegger's concepts...",
    backgroundColor: "#fff0f0",
    actions: [
      { 
        fn: () => SpeechHelper.say(figures[1], "Dasein transcends history...") 
      },
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: -Math.PI / 3,
          rightShoulderAngle: Math.PI / 3,
          leftElbowAngle: -Math.PI / 4,
          rightElbowAngle: Math.PI / 4
        })
      },
      { 
        fn: () => SpeechHelper.say(figures[0], "You abstract from real historical conditions!"),
        position: "+=1"
      }
    ]
  });

  // Scene 3: The Cult of Being
  const scene3 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 3: Being elevated to mythical status...",
    backgroundColor: "#f0f0ff",
    actions: [
      {
        fn: AnimationHelpers.setPose(figures[1], {
          leftShoulderAngle: 0,
          rightShoulderAngle: 0,
          leftElbowAngle: -Math.PI / 2,
          rightElbowAngle: Math.PI / 2
        })
      },
      {
        fn: () => SpeechHelper.say(figures[1], "Being speaks through us...")
      },
      {
        fn: AnimationHelpers.walk(figures[0], 20),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[0], "You mystify social domination!"),
        position: "+=1"
      }
    ]
  });

  // Scene 4: The Subject-Object Problem
  const scene4 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 4: The false reconciliation of subject and object...",
    backgroundColor: "#fff0ff",
    actions: [
      {
        fn: () => SpeechHelper.say(figures[1], "Subject and Being are one...")
      },
      {
        fn: AnimationHelpers.setPose(figures[0], POSES.ARMS_RAISED),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[0], "You ignore real contradictions!"),
        position: "+=1"
      }
    ]
  });

  // Scene 5: Ideological Function
  const scene5 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 5: The ideological role of authenticity...",
    backgroundColor: "#f0fff0",
    actions: [
      {
        fn: () => SpeechHelper.say(figures[1], "Find your authentic self...")
      },
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: Math.PI / 3,
          rightShoulderAngle: -Math.PI / 3,
          leftElbowAngle: Math.PI / 4,
          rightElbowAngle: -Math.PI / 4
        }),
        position: "<"
      },
      {
        fn: () => SpeechHelper.say(figures[0], "You make alienation seem natural!"),
        position: "+=1"
      }
    ]
  });

  // Scene 6: The Political Implications
  const scene6 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 6: The political consequences of Heidegger's thought...",
    backgroundColor: "#fffff0",
    actions: [
      {
        fn: () => SpeechHelper.say(figures[1], "The destiny of the Volk...")
      },
      {
        fn: AnimationHelpers.setPose(figures[0], {
          leftShoulderAngle: -Math.PI / 2,
          rightShoulderAngle: Math.PI / 2,
          leftElbowAngle: -Math.PI / 3,
          rightElbowAngle: Math.PI / 3
        })
      },
      {
        fn: () => SpeechHelper.say(figures[0], "Your philosophy enables authoritarianism!"),
        position: "+=1"
      }
    ]
  });

  totalSteps = 6;

  return TimelineManager.createSteppedTimeline(
    [scene1, scene2, scene3, scene4, scene5, scene6],
    {
      onAllComplete: () => {
        narrativeText.textContent = "Adorno reveals how Heidegger's philosophy mystifies social conditions and serves ideological functions.";
        updateStepButtons();
      },
      onTimelineUpdate: () => updateStepButtons()
    }
  );
}

function adornoInitialize() {
  SceneHelpers.initialize();
  
  SceneHelpers.updateNarrativeText("Adorno's Critique of Heidegger's Philosophy");
  
  masterTimeline = createTimeline();
  
  initializeStepButtons();
  
  // Position figures
  figures[0].x = canvas.width * 0.3; // Adorno's critique
  figures[1].x = canvas.width * 0.7; // Heideggerian concepts
  
  // Apply breathing animation
  figures.forEach(AnimationHelpers.breathe);
  
  drawAllFigures();
  updateStepButtons();
}

// Make functions available to scenario manager
window.adornoTimeline = adornoTimeline;
window.adornoInitialize = adornoInitialize;