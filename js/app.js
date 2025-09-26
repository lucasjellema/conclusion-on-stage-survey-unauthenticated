/**
 * app.js
 * Main application module
 * 
 * This module initializes the application and connects the authentication
 * and UI modules together. It handles the application lifecycle and
 * authentication flow.
 */

import * as auth from './auth.js';
import * as ui from './ui.js';
import * as dataService from './dataService.js';
import * as surveyWizard from './surveyWizard.js';

// Constants for application state
const APP_STATE = {
  initialized: false,
  authenticated: false
};

// Constants for event timing
const TIMING = {
  retryInterval: 1000, // ms between retries for MSAL loading
  maxRetries: 10       // maximum number of retries
};

/**
 * Initialize the application
 */
async function initializeApp() {
  
  // Initialize the survey wizard
  initializeSurveyWizard();

}







/**
 * Initialize the survey wizard
 */
async function initializeSurveyWizard() {
  try {
    // Initialize the survey wizard
    const initialized = await surveyWizard.initSurveyWizard();
    
    if (!initialized) {
      console.error('Failed to initialize survey wizard');
      return;
    }
    
    console.log('Survey wizard initialized successfully');
    
    // Expose setupSurveyButton to global scope for UI.js to use
    window.setupSurveyButton = setupSurveyButton;
    
    // Set up survey button click handler
    setupSurveyButton();
    
  } catch (error) {
    console.error('Error initializing survey wizard:', error);
  }
}

/**
 * Set up the survey button and its click handler
 */
function setupSurveyButton() {
  // Get existing button or create a new one
  let surveyButton = document.getElementById('start-survey-button');
  
  if (!surveyButton) {
    // Create the survey button
    surveyButton = document.createElement('button');
    surveyButton.id = 'start-survey-button';
    surveyButton.className = 'action-button survey-button';
    surveyButton.textContent = 'Start Survey';
    
    // Add to button container instead of welcome message
    // This ensures it won't be removed when welcome message is updated
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.appendChild(surveyButton);
    }
  }
  
  // Add click event listener
  surveyButton.addEventListener('click', handleStartSurvey);
  
  // Make the button visible
  surveyButton.style.display = 'inline-block';
}

/**
 * Handle the start survey button click
 */
function handleStartSurvey() {
  
    const descriptionElement = document.getElementById('survey-description');
    const welcomeMessage = document.getElementById('welcome-message');
    const appContainer = document.getElementById('app-container');
    if (descriptionElement) {
      descriptionElement.style.display = 'none';
    }
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }
    if (appContainer) {
      appContainer.style.display = 'none';
    }
    // Show the survey wizard
    showSurvey();
  }

/**
 * Show the survey to the user
 */
function showSurvey() {
  // Hide other content sections
  const dataSection = document.getElementById('data-section');
  const adminSection = document.getElementById('admin-section');
  const buttonContainer = document.querySelector('.button-container');
  
  if (dataSection) dataSection.style.display = 'none';
  if (adminSection) adminSection.style.display = 'none';
  if (buttonContainer) buttonContainer.style.display = 'none'; // Hide the button container
  
  // Show the survey wizard
  surveyWizard.showSurveyWizard();
}

// Initialize the application when the document is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
