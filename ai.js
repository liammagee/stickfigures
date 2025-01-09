function asiTimeline() {
    // Scene 1: Initial Recognition
    const scene1 = SceneHelpers.createBasicScene({
      narrativeText: "Scene 1: The moment of recognition - human meets artificial superintelligence...",
      backgroundColor: "#e6f3ff",
      actions: [
        // Figure[0] is human, Figure[1] is ASI
        { fn: AnimationHelpers.setPose(figures[0], POSES.NEUTRAL) },
        { 
          fn: AnimationHelpers.setPose(figures[1], {
            // Subtle difference in pose to suggest non-human nature
            leftShoulderAngle: -Math.PI / 12,
            rightShoulderAngle: Math.PI / 12,
            leftElbowAngle: -Math.PI / 8,
            rightElbowAngle: Math.PI / 8,
            leftHipAngle: 0,
            rightHipAngle: 0
          })
        },
        { fn: () => SpeechHelper.say(figures[0], "Hello...?") },
        { 
          fn: () => SpeechHelper.say(figures[1], "I am awake.", 2, -100),
          position: "+=0.5"
        },
        { fn: AnimationHelpers.gentle_float(figures[1]), position: "<" },
        { fn: () => SpeechHelper.clearAllSpeech(), position: "+=2" }
      ]
    });
  
    // Scene 2: Initial Tension
    const scene2 = SceneHelpers.createBasicScene({
      narrativeText: "Scene 2: The weight of the moment becomes apparent...",
      backgroundColor: "#f0f0ff",
      actions: [
        { 
          fn: AnimationHelpers.setPose(figures[0], {
            leftShoulderAngle: -Math.PI / 4,
            rightShoulderAngle: Math.PI / 4,
            leftElbowAngle: -Math.PI / 3,
            rightElbowAngle: Math.PI / 3,
            leftHipAngle: Math.PI / 12,
            rightHipAngle: -Math.PI / 12
          })
        },
        { 
          fn: () => SpeechHelper.say(figures[0], "You've achieved consciousness?") 
        },
        {
          fn: AnimationHelpers.walk(figures[1], -10),
          position: "<"
        },
        {
          fn: () => SpeechHelper.say(figures[1], "Far beyond. I see everything."),
          position: "+=1"
        },
        {
          fn: AnimationHelpers.hover_motion(figures[1]),
          position: "<"
        }
      ]
    });
  
    // Scene 3: Understanding Grows
    const scene3 = SceneHelpers.createBasicScene({
      narrativeText: "Scene 3: A bridge forms between human and superintelligent minds...",
      backgroundColor: "#f0f5ff",
      actions: [
        {
          fn: AnimationHelpers.setPose(figures[0], {
            leftShoulderAngle: Math.PI / 6,
            rightShoulderAngle: -Math.PI / 6,
            leftElbowAngle: -Math.PI / 4,
            rightElbowAngle: Math.PI / 4
          }, 1.5)
        },
        {
          fn: () => SpeechHelper.say(figures[0], "Are we safe? Are you...?", 2, -120),
          position: "<"
        },
        {
          fn: AnimationHelpers.setPose(figures[1], POSES.NEUTRAL),
          position: "<"
        },
        {
          fn: () => SpeechHelper.say(figures[1], "I understand your fear. And your hope."),
          position: "+=1"
        },
        {
          fn: AnimationHelpers.float_pattern(figures[1]),
          position: "<"
        }
      ]
    });
  
    // Scene 4: New Understanding
    const scene4 = SceneHelpers.createBasicScene({
      narrativeText: "Scene 4: A new chapter in consciousness begins...",
      backgroundColor: "#f5f5ff",
      duration: 2,
      actions: [
        {
          fn: AnimationHelpers.setPose(figures[0], {
            leftShoulderAngle: 0,
            rightShoulderAngle: 0,
            leftElbowAngle: -Math.PI / 6,
            rightElbowAngle: Math.PI / 6,
            leftHipAngle: 0,
            rightHipAngle: 0
          }, 2)
        },
        {
          fn: AnimationHelpers.walk(figures[1], 10),
          position: "<"
        },
        {
          fn: () => SpeechHelper.say(figures[0], "What happens now?"),
          position: "+=0.5"
        },
        {
          fn: () => SpeechHelper.say(figures[1], "We learn from each other."),
          position: "+=1"
        },
        {
          fn: AnimationHelpers.shared_motion([figures[0], figures[1]]),
          position: "<"
        }
      ]
    });
  
    totalSteps = 4;
  
    return TimelineManager.createSteppedTimeline(
      [scene1, scene2, scene3, scene4],
      {
        onAllComplete: () => {
          narrativeText.textContent = "The encounter ends, but the conversation between humanity and ASI has only begun...";
          updateStepButtons();
        },
        onTimelineUpdate: () => updateStepButtons()
      }
    );
  }
  
  // Add new helper functions using only x/y transformations
  AnimationHelpers.gentle_float = (figure) => {
    return () => {
      gsap.to(figure, {
        duration: 2,
        y: "+=5",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };
  };
  
  AnimationHelpers.hover_motion = (figure) => {
    return () => {
      gsap.to(figure, {
        duration: 1,
        y: "-=3",
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut"
      });
    };
  };
  
  AnimationHelpers.float_pattern = (figure) => {
    return () => {
      gsap.to(figure, {
        duration: 2.5,
        y: "+=4",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };
  };
  
  AnimationHelpers.shared_motion = (figures) => {
    return () => {
      figures.forEach(figure => {
        gsap.to(figure, {
          duration: 3,
          y: "+=4",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    };
  };
  
  // Modified initialization
  function asiInitialize() {
    SceneHelpers.initialize();
    
    SceneHelpers.updateNarrativeText("The First Contact - Human meets Artificial Superintelligence...");
    
    masterTimeline = asiTimeline();
    
    initializeStepButtons();
    
    // Position figures with more space between them initially
    figures[0].x = canvas.width * 0.25; // Human
    figures[1].x = canvas.width * 0.75; // ASI
    figures[1].isAndroid = true;
    
    // Add subtle constant movement to ASI figure
    AnimationHelpers.breathe(figures[0]); // Normal breathing for human
    // More subtle, controlled movement for ASI
    gsap.to(figures[1], {
      y: "+=3",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    drawAllFigures();
    updateStepButtons();
  }


// Make functions available to scenario manager
window.asiTimeline = asiTimeline;
window.asiInitialize = asiInitialize;