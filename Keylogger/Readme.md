# Keylogger Project

## Overview

This project is a simple keylogger built using `Node.js`.  It listens for global keyboard events and logs all the keyboard and mouse strokes to a file. The keystrokes are formatted to distinguish between alphanumeric characters, special keys and modifier keys ( Alt , Shift , Backspace etc. )

## File Structure

Keylogger   
├── node_modules   
├── index.js  
├── package.json  
└── package-lock.json  


## Files & their Components/Functions

### index.js

- **Purpose:** This is the main file that contains the code for the keylogger.
- **Components/Functions:**
  - **Imports:** 
    - `fs` for file system operations.
    - `path` for handling file paths.
    - `GlobalKeyboardListener` from `node-global-key-listener` to listen to global keyboard events.
  - **Keyboard Listener Instance:** Creates an instance of `GlobalKeyboardListener`.
  - **Filename and Path:** Generates a filename based on the current date and time and sets the output path.
  - **Write Stream:** Creates a write stream to log keystrokes into a file.
  - **Special Keys Mapping:** Maps special keys (like Enter, Alt, Shift, etc.) to their formatted representations.
  - **isAlphanumeric Function:** Checks if a character is alphanumeric.
  - **Event Listener:** Listens for keypress events and logs them to the file.
  - **Process Exit Handling:** Ensures the output file is properly closed on process exit.

### package.json

- **Purpose:** Defines the project metadata and dependencies.
- **Contents:**
  - Project name, version, and description.
  - Scripts section with a test script.
  - Dependencies section specifying required npm packages (`node-global-key-listener`).

### package-lock.json

- **Purpose:** Locks the versions of the project's dependencies to ensure consistent installs.
- **Contents:** 
  - Detailed information about the dependencies (`node-global-key-listener` and its dependency `sudo-prompt`), including their versions and resolved URLs.

## Working Mechanism

1. The script starts by importing necessary modules and creating an instance of `GlobalKeyboardListener`.
2. It generates a filename based on the current date and time and creates a write stream to log the keystrokes.
3. It maps special keys to their formatted representations for better readability.
4. The `isAlphanumeric` function checks if a character is alphanumeric.
5. The `keyboardListener` adds an event listener that triggers on key press events.
   - It formats the keystroke based on whether it's alphanumeric, special, or a space.
   - The formatted keystroke is then written to the log file.
6. The script handles process exit to close the output file properly.

## Tools, Technologies, APIs, and Modules Used

- **Node.js:** Runtime environment for executing JavaScript code outside a browser.
- **node-global-key-listener:** NPM package used for listening to global keyboard events.
- **fs:** Node.js module for file system operations.
- **path:** Node.js module for handling and transforming file paths.

## Necessary Installations

After taking down in the codes and organising the structure, run the command 
`npm install`
This will install all the dependencies listed in package.json.


## How to use it 
1. Take down the code files and organise as per structure
2. Go to main directory and run `npm install`.
3. Run the `script.js` file. It will start the keylogging.
4. When done press `CTRL + C` to stop the keylogging. 
5. Recorded strokes will be saved in main project directory with file name stamped with date and time. You will be able to see the output file name in the terminal.


<div> 
<h2 align = 'right'> Thank You !! </h2>
</div>
