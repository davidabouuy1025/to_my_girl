# Interactive 3D Birthday Scene

A visually immersive, browser-based 3D birthday scene built using **Three.js** that you can use it to **surprise your birthday friend**. The project features a layered birthday cake, candles with glowing flames, a spinning heart that reacts to clicks, floating stars, and interactive images.

## Features
- **Textminal Text**: Output formatted texts that are terminal like
- **Confetti Effect**: Trigger confetti on events (e.g., birthday message).
- **3D Cake**: Multi-layer cake with colorful layers and decorative stripes.
- **Candles & Flames**: Realistic candle flames with glowing light sources.
- **Spinning Heart**: Clickable heart mesh that spins and glows when activated.
- **Stars Background**: Thousands of stars scattered in 3D space for depth and ambiance.
- **Interactive Images**: Addable images positioned anywhere in the 3D scene.
- **Mouse Controls**: Rotate the scene by dragging and zoom with the mouse wheel.
- **Responsive Design**: Canvas automatically resizes when the window size changes.


## Installation

1. Clone the repository:
```bash
git clone https://github.com/davidabouuy1025/bday.git
```
2. Edit
- Use any IDE or word editor software
- e.g. VS Code, Notepad

3. Save & Run
- Open `text.html` in any modern browser (Chrome, Firefox, Edge) to view the scene.

## Editable Area
### 1. In 'text.js' ...
- Edit the date (line 5)
- Replace `WHO` with your friend's name (line 12)

### 2. In 'bday.js' ...
- Update friend's age in `createText("friend_age", 7, 0, 0, 'bold 200px Verdana')` (line 44)
- Upload photos into `images/` and enter the file name into `createImage('Images/your_file_name, width, height, x, y, z` (line 200 onwards)

## Credits
- Project inspired by a random reel on Instagram
- Built using [Three.js](https://threejs.org/) and [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- Special thanks to:
  - @Contributor1 for `https://chatgpt.com/`

## License

