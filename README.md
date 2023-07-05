# robocin-ines-webui

## REQUIREMENTS ELICITATION

### General Structure of the New Interface
- Live, Draw, Debug, and Details options are displayed as floating buttons. 
- In case you don't have any protobuf, inform the situation on the screen.
- Import and Export side options, for drawings or parameters.
- Settings top option.

### Live of the Current Game (Preview)
- Display the current game with display plane shifting based on protobufs received.
- Pause the game at a given time, continuing to consume data and creating a sort of "cache" in the display bar.
- Display the coordinates of the cursor relative to the plane.
- Replay a certain moment, i.e. go back in time, in this case immediately stopping the game.
- Filtering of events by events.
- Button to display details, activating boxes associated with each robot containing the general information (Robot + Telemetry) of the same and displaying the common parameters on the side, displaying a warning icon when the information is outdated (checking through the camera FPS).

### Parameter Manipulation
- Display of fixed initial configuration parameters (IP, port, and INET).
- Pinning of parameters with fixed display on the side.
- Addition of parameters, association with a category and entities is mandatory, taking into account that a parameter can only be associated with one category, but a category can be associated with more than one entity. For the selection of the category use select.
- Editing of parameters (value, category, entity, description, name), where all parameters can be edited.
- Removing parameters.

### General Information
- Display the scoreboard associated with the side of the field, team color, game situation, and camera FPS on the side, handling the case of receiving no information.
- Expose the Robot information when there is a click on a robot.
- Expose Field information when there is a click on the field.
- Expose Ball information when the ball is clicked.
- Expose the Environment information when there is a click on the area outside the field.

### Import/Export
- Drawings: selected, all or specific clipboards can be exported or imported.
- Parameters: a diff screen should be shown with the previous and current state, with the option to select which ones will be imported/exported.

### Draw on live of the current game
- The interface must make it possible to draw on the screen from clicks for any instant of the game, as well as making it possible to export certain drawings, keeping the current state when the user exits and returns to the application.
- The side panel must have the options of: straight, arrow, circle, square, brush, eraser, selection arrow (select specific drawings). Have options for standard drawings or clipboards.
- On the live screen, have different clipboards for different draws, with rename, hide, and reorder functionality.

### Debug
- The interface should provide a tab displaying the ball speed graph, the last commands sent to the base station, the modules FPS, and the status (running or not).

### Shortcuts
- Have the possibility to customize the shortcuts.
- Shortcut to turn off/on the communication with the robots, without having to manually change the port.
- Be able to reconfigure the base station without pausing and play.
- To have an option to run the software without sending commands to the robot (to see what is the state/decision of the software in that situation without moving the robots).
