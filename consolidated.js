
// Animation helper functions
const AnimationHelpers = {
    // Basic breathing animation
    breathe: (figure) => {
      return gsap.to(figure, {
        torsoLength: figure.torsoLength + 2,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });
    },
  
    // Move to a specific pose
    setPose: (figure, pose, duration = 1.5, ease = "power2.inOut") => {
      return gsap.to(figure, {
        ...pose,
        duration,
        ease,
        onUpdate: drawAllFigures
      });
    },
  
    // Walk animation
    walk: (figure, distance, duration = 1.5) => {
      const timeline = gsap.timeline();
      
      // Leg movement cycle
      const walkCycle = {
        leftHipAngle: Math.PI / 8,
        rightHipAngle: -Math.PI / 8,
        leftKneeAngle: -Math.PI / 6,
        rightKneeAngle: Math.PI / 6
      };
  
      timeline
        .to(figure, {
          x: figure.x + distance,
          duration,
          ease: "none"
        })
        .to(figure, {
          ...walkCycle,
          duration: duration / 4,
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut",
          onUpdate: drawAllFigures
        }, 0);
  
      return timeline;
    },
  
    // Wave animation
    wave: (figure, duration = 1.5) => {
      const timeline = gsap.timeline();
      
      timeline
        .to(figure, {
          rightShoulderAngle: Math.PI / 2,
          rightElbowAngle: Math.PI / 4,
          duration: duration * 0.3,
          ease: "power2.out",
          onUpdate: drawAllFigures
        })
        .to(figure, {
          rightElbowAngle: -Math.PI / 4,
          duration: duration * 0.2,
          repeat: 2,
          yoyo: true,
          ease: "power1.inOut",
          onUpdate: drawAllFigures
        });
  
      return timeline;
    },
  
    // Shake animation
    shake: (figure, intensity = 2, duration = 0.5) => {
      return gsap.to(figure, {
        x: `+=${intensity}`,
        duration: 0.1,
        yoyo: true,
        repeat: Math.floor(duration / 0.1),
        ease: "none",
        onUpdate: drawAllFigures
      });
    }
  };
  
  
  
  // ---------------------------------------------------
  // 4. SPEECH BUBBLE FUNCTIONS
  // ---------------------------------------------------
  function createSpeechBubble(text, x, y) {
    const bubble = document.createElement('div');
    bubble.classList.add('speech-bubble');
    bubble.textContent = text;
  
    // Add CSS for better positioning
    bubble.style.cssText = `
      position: absolute;
      transform: translate(-50%, -100%); /* Center horizontally and position above */
      background: white;
      border: 2px solid black;
      border-radius: 10px;
      padding: 10px;
      max-width: 150px;
      z-index: 1000; /* Ensure it's above the canvas */
    `;
  
    const canvasRect = canvas.getBoundingClientRect();
    // Position relative to canvas, centered above the figure
    const pageX = canvasRect.left + window.scrollX + x;
    const pageY = canvasRect.top + window.scrollY + y - 30; // Add extra offset to move up
  
    bubble.style.left = `${pageX}px`;
    bubble.style.top = `${pageY}px`;
  
    speechBubbleContainer.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add('visible'));
    return bubble;
  }
  
  
  function removeSpeechBubble(bubble) {
  bubble.classList.remove('visible');
  setTimeout(() => bubble.remove(), 300);
  }
  
  // Speech bubble helper
  const SpeechHelper = {
    say: (figure, text, duration = 2, offsetY = -100) => { // Increased default offsetY
      const bubble = createSpeechBubble(text, figure.x, figure.y + offsetY);
      gsap.delayedCall(duration, () => removeSpeechBubble(bubble));
      return bubble;
    }
  };
  
  // Background mood helper
  const BackgroundHelper = {
    setMood: (color, duration = 0.5) => {
      return gsap.to(canvas, { backgroundColor: color, duration });
    }
  };
  
  // ---------------------------------------------------
  // 2. REFACTORED NARRATIVE TIMELINE
  // ---------------------------------------------------
  function startNarrative() {
    // Reset figures to neutral pose
    figures.forEach(fig => Object.assign(fig, POSES.NEUTRAL));
    
    // Start breathing animation
    figures.forEach(AnimationHelpers.breathe);
  
    const tl = gsap.timeline({
      onComplete: () => {
        narrativeText.textContent = "End of the story! Both figures have completed their arcs.";
      }
    });
  
    // Scene 1: Friendly Introduction
    tl.add(() => {
      narrativeText.textContent = "Scene 1: Our two stick figures meet politely...";
      BackgroundHelper.setMood("#fafafa");
    });
  
    tl.add(AnimationHelpers.wave(figures[0]));
    tl.add(() => SpeechHelper.say(figures[0], "Hey, nice day!"), ">");
    
    tl.add(AnimationHelpers.wave(figures[1]), "-=1");
    tl.add(() => SpeechHelper.say(figures[1], "Indeed, lovely weather!"), ">");
  
    // Scene 2: Rising Tension
    tl.add(() => {
      narrativeText.textContent = "Scene 2: A minor disagreement starts. Tensions rise...";
      BackgroundHelper.setMood("#ffe8e8");
    }, "+=1");
  
    tl.add(AnimationHelpers.setPose(figures[0], {
      ...POSES.DEFENSIVE,
      leftShoulderAngle: -Math.PI / 3,
      rightShoulderAngle: Math.PI / 3
    }));
  
    tl.add(AnimationHelpers.walk(figures[1], 30), "<");
  
    // Scene 3: Peak Confrontation
    tl.add(() => {
      narrativeText.textContent = "Scene 3: Figure1 becomes agitated, expressing strong emotions!";
      BackgroundHelper.setMood("#ffd9d9");
    }, "+=1");
  
    tl.add(AnimationHelpers.setPose(figures[0], POSES.ARMS_RAISED, 1.5, "elastic.out(1, 0.5)"))
      .add(() => SpeechHelper.say(figures[0], "I'm outraged!!", 2, -120), "<");
  
    tl.add(AnimationHelpers.walk(figures[1], 40), "<");
    tl.add(AnimationHelpers.shake(figures[0]));
  
    // Scene 4: De-escalation
    tl.add(() => {
      narrativeText.textContent = "Scene 4: The situation begins to calm down...";
      BackgroundHelper.setMood("#e8ffe8", 1);
    }, "+=1");
  
    tl.add(AnimationHelpers.setPose(figures[0], POSES.NEUTRAL, 2));
  }
  
  
  // ---------------------------------------------------
  // 3. DRAWING FUNCTIONS (Keep original drawJointedFigure and drawAllFigures)
  // ---------------------------------------------------
  function drawJointedFigure(fig) {
    const {
      x, y,
      neckLength, torsoLength,
      upperArmLength, lowerArmLength,
      upperLegLength, lowerLegLength,
      leftShoulderAngle, leftElbowAngle,
      rightShoulderAngle, rightElbowAngle,
      leftHipAngle, leftKneeAngle,
      rightHipAngle, rightKneeAngle
    } = fig;
  
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  
    // TORSO points
    const topOfTorsoY = y - (torsoLength / 2);
    const topOfTorso = { x, y: topOfTorsoY };
    const bottomOfTorsoY = y + (torsoLength / 2);
    const bottomOfTorso = { x, y: bottomOfTorsoY };
  
    // NECK & HEAD
    const neckEnd = { x, y: topOfTorsoY - neckLength };
    const headRadius = 12;
    const headCenter = { x: neckEnd.x, y: neckEnd.y - headRadius };
  
    // Neck
    ctx.beginPath();
    ctx.moveTo(topOfTorso.x, topOfTorso.y);
    ctx.lineTo(neckEnd.x, neckEnd.y);
    ctx.stroke();
  
    // Head
    ctx.beginPath();
    ctx.arc(headCenter.x, headCenter.y, headRadius, 0, 2 * Math.PI);
    ctx.stroke();
  
    // Torso
    ctx.beginPath();
    ctx.moveTo(topOfTorso.x, topOfTorso.y);
    ctx.lineTo(bottomOfTorso.x, bottomOfTorso.y);
    ctx.stroke();
  
    // ARMS
    const leftElbow = {
      x: topOfTorso.x + (upperArmLength * Math.cos(leftShoulderAngle + Math.PI / 2)),
      y: topOfTorso.y + (upperArmLength * Math.sin(leftShoulderAngle + Math.PI / 2))
    };
    const leftHand = {
      x: leftElbow.x + (lowerArmLength * Math.cos(leftShoulderAngle + leftElbowAngle + Math.PI / 2)),
      y: leftElbow.y + (lowerArmLength * Math.sin(leftShoulderAngle + leftElbowAngle + Math.PI / 2))
    };
  
    const rightElbow = {
      x: topOfTorso.x + (upperArmLength * Math.cos(rightShoulderAngle + Math.PI / 2)),
      y: topOfTorso.y + (upperArmLength * Math.sin(rightShoulderAngle + Math.PI / 2))
    };
    const rightHand = {
      x: rightElbow.x + (lowerArmLength * Math.cos(rightShoulderAngle + rightElbowAngle + Math.PI / 2)),
      y: rightElbow.y + (lowerArmLength * Math.sin(rightShoulderAngle + rightElbowAngle + Math.PI / 2))
    };
  
    ctx.beginPath();
    ctx.moveTo(topOfTorso.x, topOfTorso.y);
    ctx.lineTo(leftElbow.x, leftElbow.y);
    ctx.lineTo(leftHand.x, leftHand.y);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(topOfTorso.x, topOfTorso.y);
    ctx.lineTo(rightElbow.x, rightElbow.y);
    ctx.lineTo(rightHand.x, rightHand.y);
    ctx.stroke();
  
    // LEGS
    const leftKnee = {
      x: bottomOfTorso.x + (upperLegLength * Math.cos(leftHipAngle + Math.PI / 2)),
      y: bottomOfTorso.y + (upperLegLength * Math.sin(leftHipAngle + Math.PI / 2))
    };
    const leftFoot = {
      x: leftKnee.x + (lowerLegLength * Math.cos(leftHipAngle + leftKneeAngle + Math.PI / 2)),
      y: leftKnee.y + (lowerLegLength * Math.sin(leftHipAngle + leftKneeAngle + Math.PI / 2))
    };
  
    const rightKnee = {
      x: bottomOfTorso.x + (upperLegLength * Math.cos(rightHipAngle + Math.PI / 2)),
      y: bottomOfTorso.y + (upperLegLength * Math.sin(rightHipAngle + Math.PI / 2))
    };
    const rightFoot = {
      x: rightKnee.x + (lowerLegLength * Math.cos(rightHipAngle + rightKneeAngle + Math.PI / 2)),
      y: rightKnee.y + (lowerLegLength * Math.sin(rightHipAngle + rightKneeAngle + Math.PI / 2))
    };
  
    ctx.beginPath();
    ctx.moveTo(bottomOfTorso.x, bottomOfTorso.y);
    ctx.lineTo(leftKnee.x, leftKnee.y);
    ctx.lineTo(leftFoot.x, leftFoot.y);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(bottomOfTorso.x, bottomOfTorso.y);
    ctx.lineTo(rightKnee.x, rightKnee.y);
    ctx.lineTo(rightFoot.x, rightFoot.y);
    ctx.stroke();
  }
  
  
  function drawAllFigures() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    figures.forEach(drawJointedFigure);
  }
  
  
  
  
  // ---------------------------------------------------
  // 1. CANVAS SETUP
  // ---------------------------------------------------
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d');
  const narrativeText = document.getElementById('narrativeText');
  const speechBubbleContainer = document.getElementById('speechBubbleContainer');
  
  // ---------------------------------------------------
  // 2. ANIMATION PRESETS & UTILITIES
  // ---------------------------------------------------
  const POSES = {
    NEUTRAL: {
      leftShoulderAngle: -Math.PI / 12,
      leftElbowAngle: -Math.PI / 24,
      rightShoulderAngle: Math.PI / 12,
      rightElbowAngle: Math.PI / 24,
      leftHipAngle: Math.PI / 16,
      leftKneeAngle: -Math.PI / 32,
      rightHipAngle: -Math.PI / 16,
      rightKneeAngle: Math.PI / 32
    },
    ARMS_RAISED: {
      leftShoulderAngle: -Math.PI * 0.8,
      rightShoulderAngle: Math.PI * 0.8,
      leftElbowAngle: -Math.PI / 3,
      rightElbowAngle: Math.PI / 3
    },
    DEFENSIVE: {
      leftShoulderAngle: -Math.PI / 4,
      rightShoulderAngle: Math.PI / 6,
      leftElbowAngle: -Math.PI / 6,
      rightElbowAngle: Math.PI / 6,
      leftHipAngle: Math.PI / 8,
      rightHipAngle: -Math.PI / 8
    }
  };
  
  // Initial figure setup
  const figures = [
    {
      x: 250,
      y: 300,
      neckLength: 8,
      torsoLength: 45,
      upperArmLength: 25,
      lowerArmLength: 25,
      upperLegLength: 35,
      lowerLegLength: 35,
      ...POSES.NEUTRAL
    },
    {
      x: 550,
      y: 300,
      neckLength: 8,
      torsoLength: 45,
      upperArmLength: 25,
      lowerArmLength: 25,
      upperLegLength: 35,
      lowerLegLength: 35,
      ...POSES.NEUTRAL
    }
  ];
  
  // ---------------------------------------------------
  // 3. ANIMATION TIMELINE SEGMENTS
  // ---------------------------------------------------
  function createTimelineSegments() {
    const segments = [];
  
    // Scene 1: Friendly Introduction
    segments.push(gsap.timeline({
      paused: true,
      onComplete: onTimelineComplete
    }).add(() => {
      narrativeText.textContent = "Scene 1: Our two stick figures meet politely...";
      BackgroundHelper.setMood("#fafafa");
    })
    .add(AnimationHelpers.wave(figures[0]))
    .add(() => SpeechHelper.say(figures[0], "Hey, nice day!"), ">")
    .add(AnimationHelpers.wave(figures[1]), "-=1")
    .add(() => SpeechHelper.say(figures[1], "Indeed, lovely weather!"), ">"));
  
    // Scene 2: Rising Tension
    segments.push(gsap.timeline({
      paused: true,
      onComplete: onTimelineComplete
    }).add(() => {
      narrativeText.textContent = "Scene 2: A minor disagreement starts. Tensions rise...";
      BackgroundHelper.setMood("#ffe8e8");
    })
    .add(AnimationHelpers.setPose(figures[0], {
      ...POSES.DEFENSIVE,
      leftShoulderAngle: -Math.PI / 3,
      rightShoulderAngle: Math.PI / 3
    }))
    .add(AnimationHelpers.walk(figures[1], 30), "<"));
  
    // Scene 3: Peak Confrontation
    segments.push(gsap.timeline({
      paused: true,
      onComplete: onTimelineComplete
    }).add(() => {
      narrativeText.textContent = "Scene 3: Figure1 becomes agitated!";
      BackgroundHelper.setMood("#ffd9d9");
    })
    .add(AnimationHelpers.setPose(figures[0], POSES.ARMS_RAISED, 1.5, "elastic.out(1, 0.5)"))
    .add(() => SpeechHelper.say(figures[0], "I'm outraged!!", 2, -120), "<")
    .add(AnimationHelpers.walk(figures[1], 40), "<")
    .add(AnimationHelpers.shake(figures[0])));
  
    // Scene 4: De-escalation
    segments.push(gsap.timeline({
      paused: true,
      onComplete: onTimelineComplete
    }).add(() => {
      narrativeText.textContent = "Scene 4: The situation begins to calm down...";
      BackgroundHelper.setMood("#e8ffe8", 1);
    })
    .add(AnimationHelpers.setPose(figures[0], POSES.NEUTRAL, 2)));
  
    return segments;
  }
  
  // ---------------------------------------------------
  // 4. STATE MANAGEMENT
  // ---------------------------------------------------
  let currentStep = -1;
  let isPlaying = false;
  let isPaused = false;
  let timelineSegments = createTimelineSegments();
  const totalSteps = timelineSegments.length;
  
  // Button references
  const startButton = document.getElementById('startAnimationBtn');
  const prevButton = document.getElementById('prevBtn');
  const pauseButton = document.getElementById('pauseBtn');
  const nextButton = document.getElementById('nextBtn');
  const resetButton = document.getElementById('resetBtn');
  const stepControls = document.querySelector('.step-controls');
  
  // ---------------------------------------------------
  // 5. CONTROL FUNCTIONS & EVENT LISTENERS
  // ---------------------------------------------------
  // Update the updateStepButtons function
  function updateStepButtons() {
    document.querySelectorAll('.step-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === currentStep);
        btn.disabled = isPlaying && !isPaused;
    });
    
    prevButton.disabled = currentStep <= 0 || (isPlaying && !isPaused);
    nextButton.disabled = currentStep >= totalSteps - 1 || (isPlaying && !isPaused);
    resetButton.disabled = isPlaying && !isPaused;
    startButton.disabled = isPlaying && !isPaused;
    
    // Update pause button text
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
    pauseButton.disabled = currentStep === -1 || (!isPlaying && !isPaused);
  }
  
  function togglePause() {
    if (currentStep === -1) return;
    
    isPaused = !isPaused;
    isPlaying = !isPaused; // Update playing state when toggling pause
    
    if (isPaused) {
        // Pause the current timeline
        timelineSegments[currentStep].pause();
        // Also pause any active speech bubbles
        gsap.globalTimeline.pause();
    } else {
        // Resume the current timeline
        timelineSegments[currentStep].resume();
        // Resume any active speech bubbles
        gsap.globalTimeline.resume();
    }
    
    updateStepButtons();
  }
  
  
  function initializeStepButtons() {
      const stepsContainer = document.getElementById('stepsContainer');
      stepsContainer.innerHTML = '';
      
      for (let i = 0; i < totalSteps; i++) {
          const button = document.createElement('button');
          button.className = 'step-btn';
          button.textContent = `Step ${i + 1}`;
          button.dataset.step = i;
          button.addEventListener('click', () => goToStep(i));
          stepsContainer.appendChild(button);
      }
  }
  
  // Update the goToStep function
  function goToStep(stepIndex) {
    if ((isPlaying && !isPaused) || stepIndex === currentStep) return;
    
    // If we were paused, unpause when changing steps
    isPaused = false;
    isPlaying = true;
    currentStep = stepIndex;
    updateStepButtons();
    
    timelineSegments[stepIndex].restart();
  }
  
  function nextStep() {
      if (currentStep < totalSteps - 1) {
          goToStep(currentStep + 1);
      }
  }
  
  function previousStep() {
      if (currentStep > 0) {
          goToStep(currentStep - 1);
      }
  }
  
  // Update the resetAnimation function
  function resetAnimation() {
    currentStep = -1;
    isPlaying = false;
    isPaused = false;
    
    // Reset all timelines
    timelineSegments.forEach(tl => tl.pause(0));
    gsap.globalTimeline.pause(0);
    
    stepControls.classList.remove('visible');
    updateStepButtons();
    
    figures.forEach(fig => Object.assign(fig, POSES.NEUTRAL));
    drawAllFigures();
    
    narrativeText.textContent = "Click 'Start the Narrative' to begin...";
  }
  
  
  function onTimelineComplete() {
    isPlaying = false;
    isPaused = false;
    updateStepButtons();
  }
  
  // Event Listeners
  startButton.addEventListener('click', () => {
      if (currentStep === -1) {
          stepControls.classList.add('visible');
          goToStep(0);
      }
  });
  
  prevButton.addEventListener('click', previousStep);
  pauseButton.addEventListener('click', togglePause);
  nextButton.addEventListener('click', nextStep);
  resetButton.addEventListener('click', resetAnimation);
  
  // ---------------------------------------------------
  // 6. INITIALIZATION
  // ---------------------------------------------------
  drawAllFigures();
  figures.forEach(AnimationHelpers.breathe);
  initializeStepButtons();
  updateStepButtons();
  
  
  
  
  