# Project Specification

## 1. Login Screen [public]

- Input field for username.
- Display validation message if the username is currently taken.
- Button to "Join".

## 2. High Scores Screen [public]

- A user interface to select different high score categories (e.g., total games played, shortest time to win, fewest turns to win).
- A table or list displaying high scores for each category.

## 3. Lobby Screen [private]

- Display a list of existing, joinable games with details (theme, current players, grid size).
- Buttons to create a new game and to join games from the list.

## 4. Game Screen [private]

- Initial state indicating the game hasn't started.
- Options for grid size configuration with validation.
- Options for choosing the game theme.
- Options to modify grid size (default 8x8)
- Options to set a time limit for each turn (default 30 seconds).
- Display list of players in the game, showing current and maximum number allowed.
- Display pexeso cards in a grid layout.
- Minimalistic chat feature for player communication.

  **During the Game:**

  - Display of total elapsed game time.
  - Score (number of collected cards) per player.
  - Timers for total time per player.

  **After the Game Ends:**

  - UI displaying the winner's name.
  - "Play Again" button and indication of number interested players.
  - "Start New Game" button (only visible to host, interested players will automatically join)
  - "Go Back to Lobby" button
  - UI showcasing new high scores and sharing options, if applicable.

## 5. User Account Screen [private]

- UI for uploading custom images into a selected theme.
- List of uploaded images with deletion options and approval status. (uploaded images are not immediately available for use in games until approved)
- Toggle for privacy settings to hide game activity.

## Additional Considerations and Enhancements

- **Feedback Mechanisms:** Popup messages and inline UI elements for user actions.
- **Responsive Design:** Ensure compatibility across various devices and screen sizes.
- **Credits:** Link to the creator's GitHub profile somewhere.
- **Animations:** Implement animations for card flipping. victory celebrations, and indications for players who lost.
