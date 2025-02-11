# Battleship ⚓️

[Live Link (Click to play!)](https://atif-pathan.github.io/battleship/)

## 📌 Overview

Battleship is a strategy game where you battle an opponent by attacking cells on a grid (representing their fleet) until all ships have been sunk. This project was built using `Test Driven Development (TDD)` to thoroughly validate each class (e.g., `GameBoard`, `Ship`, `Player`) before integrating into the UI.

## ⚡ Features

- **Turn-Based Combat:** Players alternate moves; a hit grants an extra turn.
- **Smart Computer:** The computer uses adjacent targeting after a hit to efficiently sink ships.
- **Custom Ship Placement:** Randomize your fleet and lock it in before play.
- **Fast & Responsive:** Each turn is quick and feels very responsive. The fast gratification truly feels amazing!

## 🎯 What did I learn? (Concepts and Principles I applied)

- **Test Driven Development:**  
  By writing tests for each class (e.g., `Ship`, `GameBoard`, `Player`) before finalizing the logic, I caught potential bugs early and maintained a clear design path. This approach guaranteed reliable functionality, which made the final UI layer far simpler to implement and debug.
- **Modular Design:**  
  Keeping the game logic separate from DOM manipulation facilitated maintenance and made it possible to test the core logic in isolation.
- **Turn & State Management:**  
  Implementing a clear turn-based system—especially with extra turns on hits—deepened my understanding of state transitions in JavaScript.

## 🔧 Tools and Technologies

- **JavaScript:** Core programming language used for logic, DOM manipulation, state & turn management.
- **Webpack:** Module bundler for efficient asset management.
- **HTML:** For the skeleton and setting up default layout of the battleship grids and ships.
- **Tailwind CSS:** Custom and responsive styling.
- **Jest:** Test Driven Development for reliable code.
- **EsLint/Prettier/Babel:** For code formatting and linting.

## 🔮 Future Improvements

I am quite happy with the way it is currently however, there are a few improvements I would like to add in the future:

- **Advanced AI:** Improve the computer’s targeting for a more challenging game.
- **Drag & Drop:** Enable manual ship placement with an intuitive drag‑and‑drop interface.
- **Expanded Testing:** Increase test coverage to also test the DOM manipulation and webpage UI.

##

Enjoy plotting your strategies, outsmarting the AI, and watching your enemy’s fleet sink into the abyss. And remember—**in Battleship, there’s no such thing as "just a lucky shot"… unless it’s yours.** 🚢💥😏
