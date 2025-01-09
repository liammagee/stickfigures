
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
        rightElbowAngle: Math.PI / 2,
        duration: duration * 0.3,
        ease: "power2.out",
        onUpdate: drawAllFigures
      })
      .to(figure, {
        rightElbowAngle: Math.PI / 4,
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

  clearSpeech: (figure) => {
    // Remove any existing speech bubbles for this figure
    const existingBubbles = document.querySelectorAll(`[data-speaker="${figure.id}"]`);
    existingBubbles.forEach(bubble => bubble.remove());
  },

  clearAllSpeech: () => {
    // Remove all speech bubbles
    document.querySelectorAll('.speech-bubble').forEach(bubble => bubble.remove());
  },

  say: (figure, text, duration = 2, offsetY = -100) => { // Increased default offsetY
    // Clear any existing speech bubble for this figure first
    SpeechHelper.clearSpeech(figure);

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
// 3. DRAWING FUNCTIONS (Keep original drawJointedFigure and drawAllFigures)
// ---------------------------------------------------
function drawJointedFigure(fig) {
  let {
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

  leftShoulderAngle = leftShoulderAngle + Math.PI / 2;
  rightShoulderAngle = rightShoulderAngle + Math.PI / 2;
  
  // ARMS
  const leftElbow = {
    x: topOfTorso.x + (upperArmLength * Math.cos(leftShoulderAngle)),
    y: topOfTorso.y + (upperArmLength * Math.sin(leftShoulderAngle))
  };
  const leftHand = {
    x: leftElbow.x + (lowerArmLength * Math.cos(leftShoulderAngle + leftElbowAngle)),
    y: leftElbow.y + (lowerArmLength * Math.sin(leftShoulderAngle + leftElbowAngle))
  };

  const rightElbow = {
    x: topOfTorso.x + (upperArmLength * Math.cos(rightShoulderAngle)),
    y: topOfTorso.y + (upperArmLength * Math.sin(rightShoulderAngle))
  };
  const rightHand = {
    x: rightElbow.x + (lowerArmLength * Math.cos(rightShoulderAngle + rightElbowAngle)),
    y: rightElbow.y + (lowerArmLength * Math.sin(rightShoulderAngle + rightElbowAngle))
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


function drawAndroidFigure(fig) {
  let {
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

  // Draw mechanical torso with segments
  ctx.beginPath();
  ctx.moveTo(topOfTorso.x, topOfTorso.y);
  ctx.lineTo(bottomOfTorso.x, bottomOfTorso.y);
  ctx.stroke();

  // Add segmented lines to torso
  const segments = 5;
  const segmentHeight = torsoLength / segments;
  for (let i = 1; i < segments; i++) {
    const segY = topOfTorsoY + (i * segmentHeight);
    ctx.beginPath();
    ctx.moveTo(x - 5, segY);
    ctx.lineTo(x + 5, segY);
    ctx.stroke();
  }

  // NECK & HEAD
  const neckEnd = { x, y: topOfTorsoY - neckLength };
  const headRadius = 12;
  const headCenter = { x: neckEnd.x, y: neckEnd.y - headRadius };

  // Segmented neck
  ctx.beginPath();
  ctx.moveTo(topOfTorso.x, topOfTorso.y);
  ctx.lineTo(neckEnd.x, neckEnd.y);
  const neckSegments = 3;
  const neckSegHeight = neckLength / neckSegments;
  for (let i = 1; i < neckSegments; i++) {
    const segY = topOfTorsoY - (i * neckSegHeight);
    ctx.moveTo(x - 3, segY);
    ctx.lineTo(x + 3, segY);
  }
  ctx.stroke();

  // Angular head
  ctx.beginPath();
  ctx.moveTo(headCenter.x - headRadius, headCenter.y + headRadius);
  ctx.lineTo(headCenter.x - headRadius, headCenter.y - headRadius/2);
  ctx.lineTo(headCenter.x, headCenter.y - headRadius);
  ctx.lineTo(headCenter.x + headRadius, headCenter.y - headRadius/2);
  ctx.lineTo(headCenter.x + headRadius, headCenter.y + headRadius);
  ctx.closePath();
  ctx.stroke();

  // LED "eyes"
  const eyeSize = 2;
  ctx.beginPath();
  ctx.arc(headCenter.x - 4, headCenter.y - 2, eyeSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headCenter.x + 4, headCenter.y - 2, eyeSize, 0, 2 * Math.PI);
  ctx.fill();

  leftShoulderAngle = leftShoulderAngle + Math.PI / 2;
  rightShoulderAngle = rightShoulderAngle + Math.PI / 2;
  
  // ARMS with joint circles
  const leftElbow = {
    x: topOfTorso.x + (upperArmLength * Math.cos(leftShoulderAngle)),
    y: topOfTorso.y + (upperArmLength * Math.sin(leftShoulderAngle))
  };
  const leftHand = {
    x: leftElbow.x + (lowerArmLength * Math.cos(leftShoulderAngle + leftElbowAngle)),
    y: leftElbow.y + (lowerArmLength * Math.sin(leftShoulderAngle + leftElbowAngle))
  };

  const rightElbow = {
    x: topOfTorso.x + (upperArmLength * Math.cos(rightShoulderAngle)),
    y: topOfTorso.y + (upperArmLength * Math.sin(rightShoulderAngle))
  };
  const rightHand = {
    x: rightElbow.x + (lowerArmLength * Math.cos(rightShoulderAngle + rightElbowAngle)),
    y: rightElbow.y + (lowerArmLength * Math.sin(rightShoulderAngle + rightElbowAngle))
  };

  // Draw arms with segmented lines
  function drawSegmentedLimb(start, end, segments = 3) {
    const dx = (end.x - start.x) / segments;
    const dy = (end.y - start.y) / segments;
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    for (let i = 1; i < segments; i++) {
      const segX = start.x + (dx * i);
      const segY = start.y + (dy * i);
      ctx.beginPath();
      ctx.moveTo(segX - 3, segY);
      ctx.lineTo(segX + 3, segY);
      ctx.stroke();
    }
  }

  // Draw arms with segments
  drawSegmentedLimb(topOfTorso, leftElbow);
  drawSegmentedLimb(leftElbow, leftHand);
  drawSegmentedLimb(topOfTorso, rightElbow);
  drawSegmentedLimb(rightElbow, rightHand);

  // Draw joint circles
  function drawJoint(x, y, radius = 3) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawJoint(topOfTorso.x, topOfTorso.y);
  drawJoint(leftElbow.x, leftElbow.y);
  drawJoint(rightElbow.x, rightElbow.y);

  // LEGS with mechanical joints
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

  // Draw legs with segments
  drawSegmentedLimb(bottomOfTorso, leftKnee);
  drawSegmentedLimb(leftKnee, leftFoot);
  drawSegmentedLimb(bottomOfTorso, rightKnee);
  drawSegmentedLimb(rightKnee, rightFoot);

  // Draw leg joints
  drawJoint(bottomOfTorso.x, bottomOfTorso.y);
  drawJoint(leftKnee.x, leftKnee.y);
  drawJoint(rightKnee.x, rightKnee.y);

  // Add mechanical "feet"
  function drawMechanicalFoot(x, y, angle) {
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + 6, y);
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x - 4, y + 3);
    ctx.moveTo(x + 4, y);
    ctx.lineTo(x + 4, y + 3);
    ctx.stroke();
  }

  drawMechanicalFoot(leftFoot.x, leftFoot.y, leftHipAngle + leftKneeAngle);
  drawMechanicalFoot(rightFoot.x, rightFoot.y, rightHipAngle + rightKneeAngle);
}

// Modified drawAllFigures to support android rendering
function drawAllFigures() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  figures.forEach((fig, index) => {
    if (fig.isAndroid) {
      drawAndroidFigure(fig);
    } else {
      drawJointedFigure(fig);
    }
  });
}



const TimelineManager = {
  masterTimeline: null,
  timelineSegments: [],
  currentStep: -1,
  isPlaying: false,
  isPaused: false,
  totalSteps: 0,
  isPlayingFullAnimation: false,

  createSteppedTimeline(scenes, {
    onStepComplete = () => {},
    onAllComplete = () => {},
    onTimelineUpdate = () => {}
  } = {}) {
    // Create master timeline with common configuration
    this.timelineSegments = scenes;
    this.totalSteps = scenes.length;
    
    this.masterTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.isPlayingFullAnimation = false;
        onAllComplete();
      },
      onUpdate: () => {
        if (this.isPlayingFullAnimation) {
          this.updateCurrentStepFromTime();
          onTimelineUpdate(this.currentStep);
        }
      }
    });


    // Add all scenes to master timeline
    scenes.forEach(scene => this.masterTimeline.add(scene));
    
    return this.masterTimeline;
  },

  updateCurrentStepFromTime() {
    const currentTime = this.masterTimeline.time();
    let accumulatedTime = 0;
    
    for (let i = 0; i < this.timelineSegments.length; i++) {
      accumulatedTime += this.timelineSegments[i].duration();
      if (currentTime < accumulatedTime) {
        if (i !== this.currentStep) {
          this.currentStep = i;
        }
        break;
      }
    }
  },
  goToStep(stepIndex) {
    // Only prevent invalid step indices
    if (stepIndex < 0 || stepIndex >= this.totalSteps) return;

    // Kill any running animations
    gsap.globalTimeline.clear();
    this.masterTimeline.pause();

    // Calculate times
    let startTime = 0;
    for (let i = 0; i < stepIndex; i++) {
      startTime += this.timelineSegments[i].duration();
    }
    const endTime = startTime + this.timelineSegments[stepIndex].duration();

    // Update state
    this.currentStep = stepIndex;
    this.isPlayingFullAnimation = false;

    // Play this step
    this.masterTimeline.seek(startTime);
    this.masterTimeline.play();
    gsap.delayedCall(this.timelineSegments[stepIndex].duration(), () => {
      this.masterTimeline.pause();
      this.isPlaying = false;
      this.isPaused = false;
    });
  },

  
  playFullAnimation() {
    
    if (!this.masterTimeline) return;
    

    this.masterTimeline.pause(0);
    this.currentStep = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.isPlayingFullAnimation = true;
    
    this.masterTimeline.play();
  
    
  },

  togglePause() {
    if (this.currentStep === -1 || !this.masterTimeline) return;

    this.isPaused = !this.isPaused;
    this.isPlaying = !this.isPaused;

    if (this.isPaused) {
      if (this.isPlayingFullAnimation) {
        this.masterTimeline.pause();
      }
      gsap.globalTimeline.pause();
    } else {
      if (this.isPlayingFullAnimation) {
        this.masterTimeline.resume();
      }
      gsap.globalTimeline.resume();
    }
  },

  reset() {
    // Clear any existing timelines
    if (this.masterTimeline) {
      this.masterTimeline.pause(0);
      this.masterTimeline.kill();
      this.masterTimeline = null;
    }
    
    // Clear all GSAP animations
    gsap.globalTimeline.clear();
    gsap.killTweensOf('*');
    
    // Reset all state properties
    this.timelineSegments = [];
    this.currentStep = -1;
    this.isPlaying = false;
    this.isPaused = false;
    this.totalSteps = 0;
    this.isPlayingFullAnimation = false;
    
    // Clear any speech bubbles
    if (SpeechHelper && typeof SpeechHelper.clearAllSpeech === 'function') {
      SpeechHelper.clearAllSpeech();
    }
  },

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.goToStep(this.currentStep + 1);
    }
  },
  

  getStepEndTime(stepIndex) {
    let endTime = 0;
    for (let i = 0; i <= stepIndex; i++) {
      endTime += this.timelineSegments[i].duration();
    }
    return endTime;
  },

  previousStep() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  },

  getState() {
    return {
      currentStep: this.currentStep,
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      totalSteps: this.totalSteps,
      isPlayingFullAnimation: this.isPlayingFullAnimation
    };
  }
}

// Scene creation helpers
const SceneHelpers = {
  // Add reference to narrative text element
  narrativeTextElement: null,

  // Initialize function to set up references
  initialize() {
    this.narrativeTextElement = document.querySelector('.narrative-text');
    if (!this.narrativeTextElement) {
      console.warn('Narrative text element not found. Creating one...');
      this.narrativeTextElement = document.createElement('div');
      this.narrativeTextElement.className = 'narrative-text';
      document.body.appendChild(this.narrativeTextElement);
    }
  },
  // Update narrative text safely
  updateNarrativeText(text) {
    if (this.narrativeTextElement) {
      this.narrativeTextElement.textContent = text;
    } else {
      console.warn('Narrative text element not initialized');
      this.initialize();
      this.narrativeTextElement.textContent = text;
    }
  },

  createBasicScene({ 
    narrativeText = '', 
    backgroundColor = '#ffffff',
    duration = 1,
    actions = []
  }) {
    const timeline = gsap.timeline();
    
    timeline.add(() => {
      if (narrativeText) {
        this.updateNarrativeText(narrativeText);
      }
      if (backgroundColor) {
        BackgroundHelper.setMood(backgroundColor);
      }
    });

    actions.forEach(action => {
      timeline.add(action.fn, action.position || '>');
    });

    return timeline;
  }
};

// Initialize SceneHelpers when the script loads
SceneHelpers.initialize();



// Button references
const startButton = document.getElementById('startAnimationBtn');
const prevButton = document.getElementById('prevBtn');
const pauseButton = document.getElementById('pauseBtn');
const nextButton = document.getElementById('nextBtn');
const resetButton = document.getElementById('resetBtn');
const stepControls = document.querySelector('.step-controls');


function initializeStepButtons() {
  const stepsContainer = document.getElementById('stepsContainer');
  stepsContainer.innerHTML = '';
  for (let i = 0; i < totalSteps; i++) {
    const button = document.createElement('button');
    button.className = 'step-btn';
    button.textContent = `Step ${i + 1}`;
    button.dataset.step = i;
    button.addEventListener('click', () => TimelineManager.goToStep(i));
    stepsContainer.appendChild(button);
  }
}


function updateStepButtons() {
  const state = TimelineManager.getState();
  
  document.querySelectorAll('.step-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === state.currentStep);
    btn.disabled = state.isPlaying && !state.isPaused;
  });
  
  prevButton.disabled = state.currentStep <= 0 || (state.isPlaying && !state.isPaused);
  nextButton.disabled = state.currentStep >= state.totalSteps - 1 || (state.isPlaying && !state.isPaused);
  resetButton.disabled = state.isPlaying && !state.isPaused;
  startButton.disabled = state.isPlaying && !state.isPaused;
  
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
  pauseButton.disabled = state.currentStep === -1 || (!state.isPlaying && !state.isPaused);
}


// Event handlers
function startNarrative() {
  if (!TimelineManager.masterTimeline) {
    createTimeline();
  }
  // stepControls.classList.add('visible');
  TimelineManager.playFullAnimation();
  updateStepButtons();
}

function resetAnimation() {
  // Reset the timeline manager
  TimelineManager.reset();


  // Hide step controls
  // stepControls.classList.remove('visible');
  
  // Update UI
  updateStepButtons();
  
  // Reset figures to neutral pose
  figures.forEach(fig => {
    // Stop any ongoing animations
    gsap.killTweensOf(fig);
    // Reset to neutral pose
    Object.assign(fig, POSES.NEUTRAL);
  });
  
  // Clear any speech bubbles
  if (SpeechHelper && typeof SpeechHelper.clearAllSpeech === 'function') {
    SpeechHelper.clearAllSpeech();
  }
  
  // Redraw figures
  drawAllFigures();
  
  // Reset breathing animations
  figures.forEach(AnimationHelpers.breathe);
  
  // Reset narrative text
  SceneHelpers.updateNarrativeText("Click 'Start the Narrative' to begin...");
}

// Event Listeners
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
