function nietzscheTimeline() {
  // Scene 1: Natural Values
  const scene1 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 1: Natural values emerge from strength and life-affirmation...",
    backgroundColor: "#fff7e6",
    actions: [
      // Figure[0] represents natural aristocratic values, Figure[1] will later represent slave morality
      { fn: AnimationHelpers.setPose(figures[0], {
        leftShoulderAngle: Math.PI / 6,
        rightShoulderAngle: -Math.PI / 6,
        leftElbowAngle: -Math.PI / 4,
        rightElbowAngle: Math.PI / 4,
        leftHipAngle: 0,
        rightHipAngle: 0
      })},
      { fn: () => SpeechHelper.say(figures[0], "I affirm my strength!") },
      { fn: AnimationHelpers.walk(figures[0], 20), position: "+=0.5" },
      { fn: () => SpeechHelper.clearAllSpeech(), position: "+=1.5" }
    ]
  });

  // Scene 2: Ressentiment Emerges
  const scene2 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 2: The weak develop ressentiment against the strong...",
    backgroundColor: "#ffe6e6",
    actions: [
      { fn: AnimationHelpers.setPose(figures[1], {
        leftShoulderAngle: -Math.PI / 3,
        rightShoulderAngle: Math.PI / 3,
        leftElbowAngle: -Math.PI / 4,
        rightElbowAngle: Math.PI / 4
      })},
      { fn: () => SpeechHelper.say(figures[1], "Their strength oppresses us...") },
      { fn: AnimationHelpers.walk(figures[1], -15), position: "<" },
      { fn: () => SpeechHelper.say(figures[0], "Why do they retreat?"), position: "+=1" }
    ]
  });

  // Scene 3: Value Inversion
  const scene3 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 3: Slave morality inverts natural values...",
    backgroundColor: "#e6e6ff",
    actions: [
      { fn: AnimationHelpers.setPose(figures[1], {
        leftShoulderAngle: -Math.PI / 2,
        rightShoulderAngle: Math.PI / 2,
        leftElbowAngle: -Math.PI / 3,
        rightElbowAngle: Math.PI / 3
      })},
      { fn: () => SpeechHelper.say(figures[1], "Strength is evil, weakness is good!") },
      { fn: AnimationHelpers.setPose(figures[0], POSES.DEFENSIVE), position: "<" },
      { fn: () => SpeechHelper.say(figures[0], "They condemn what I am..."), position: "+=1" }
    ]
  });

  // Scene 4: Moral Framework Creation
  const scene4 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 4: Creating a moral framework from ressentiment...",
    backgroundColor: "#e6fff2",
    actions: [
      { fn: AnimationHelpers.setPose(figures[1], POSES.ARMS_RAISED) },
      { fn: () => SpeechHelper.say(figures[1], "God favors the humble!") },
      { fn: AnimationHelpers.walk(figures[0], -10), position: "<" },
      { fn: () => SpeechHelper.say(figures[0], "They make virtue of weakness..."), position: "+=1" }
    ]
  });

  // Scene 5: Guilt and Sin
  const scene5 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 5: Introducing concepts of guilt and sin...",
    backgroundColor: "#ffe6ff",
    actions: [
      { fn: AnimationHelpers.setPose(figures[1], {
        leftShoulderAngle: Math.PI / 2,
        rightShoulderAngle: -Math.PI / 2
      })},
      { fn: () => SpeechHelper.say(figures[1], "You are sinful by nature!") },
      { fn: AnimationHelpers.setPose(figures[0], {
        leftShoulderAngle: -Math.PI / 4,
        rightShoulderAngle: Math.PI / 4,
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8
      }), position: "<" },
      { fn: () => SpeechHelper.say(figures[0], "They poison self-affirmation..."), position: "+=1" }
    ]
  });

  // Scene 6: Life Denial
  const scene6 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 6: Morality becomes life-denying...",
    backgroundColor: "#f2e6ff",
    actions: [
      { fn: AnimationHelpers.setPose(figures[1], {
        leftShoulderAngle: Math.PI / 3,
        rightShoulderAngle: -Math.PI / 3
      })},
      { fn: () => SpeechHelper.say(figures[1], "True life is beyond this world!") },
      { fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL), position: "<" },
      { fn: () => SpeechHelper.say(figures[0], "They negate life itself..."), position: "+=1" }
    ]
  });

  // Scene 7: Cultural Consequences
  const scene7 = SceneHelpers.createBasicScene({
    narrativeText: "Scene 7: The triumph of slave morality in culture...",
    backgroundColor: "#fff2e6",
    actions: [
      { fn: AnimationHelpers.walk(figures[1], 30) },
      { fn: () => SpeechHelper.say(figures[1], "All are equal in sin!") },
      { fn: AnimationHelpers.setPose(figures[0], {
        leftShoulderAngle: -Math.PI / 6,
        rightShoulderAngle: Math.PI / 6
      }), position: "+=1" },
      { fn: () => SpeechHelper.say(figures[0], "Culture becomes life-negating..."), position: "<" }
    ]
  });

  totalSteps = 7;

  return TimelineManager.createSteppedTimeline(
    [scene1, scene2, scene3, scene4, scene5, scene6, scene7],
    {
      onAllComplete: () => {
        narrativeText.textContent = "Nietzsche's critique reveals how Christian morality emerges from ressentiment and becomes life-denying.";
        updateStepButtons();
      },
      onTimelineUpdate: () => updateStepButtons()
    }
  );
}

function nietzscheInitialize() {
  SceneHelpers.initialize();
  
  SceneHelpers.updateNarrativeText("Nietzsche's Critique of Christian Morality");
  
  masterTimeline = createTimeline();
  
  initializeStepButtons();
  
  // Position figures
  figures[0].x = canvas.width * 0.6; // Natural/noble values
  figures[1].x = canvas.width * 0.3; // Slave morality
  
  // Apply breathing animation
  figures.forEach(AnimationHelpers.breathe);
  
  drawAllFigures();
  updateStepButtons();
}

// Make functions available to scenario manager
window.nietzscheTimeline = nietzscheTimeline;
window.nietzscheInitialize = nietzscheInitialize;