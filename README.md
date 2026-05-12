# ucb-bmw-autofocus

This research explores how software-defined vehicles collect and use personal data, proposing four trust-centered design concepts that were prototyped through Journey Archive, Data Transparency Dashboard, Route Resonance, and Auto Acquaintance.

## Route Resonance

Route Resonance is an adaptive ambient sound and visual environment simulation, designed with the aesthetic of a modern BMW iDrive interface. It automatically or manually adjusts the mood, sounds, and scenery based on driving context like weather, time of day, and location.

### Getting Started

Simply open `index.html` in your web browser to start the application.

### Anthropic API Key

When you first open the application, you will see a prompt asking for an Anthropic API Key.

#### What is it for?
The API key powers the **"Describe outside conditions"** mood inference feature. By typing a natural language description (e.g., "misty gorge at dusk, pine forest after rain"), the application uses Claude to automatically infer and set the most appropriate environmental themes.

#### Skipping the API Key
**You do NOT need an API key to use the main features of the app.** All sounds, environments, animations, and manual controls work perfectly without a key. 

To bypass the prompt, simply click **"Skip for now"** at the bottom of the API key overlay. 

#### Using an API Key
If you want to try the AI-powered mood inference feature:
1. Get an API key from your [Anthropic Console](https://console.anthropic.com/).
2. Enter your key (`sk-ant-...`) in the input box when the app loads.
3. Click **Continue**.

> *Note: Your API key is stored only in your browser's local memory for the duration of your session and is never sent anywhere except directly to `api.anthropic.com`.*
> It costed the developers about $0.01 throughout the duration of implementation and testing.



## Auto Acquaintance

Please see [this Github repository!](https://github.com/StaceyLei32/bmw-recommendations)



## Journey Archive

Journey Archive is an interactive prototype that visualizes personal driving memories. Each trip is rendered as either an animated road scene or journey memory wrapped where users can hover or drag across the canvas to explore moments from the drive, including speed, traffic signals, music playing, and location context, or history/facts.

### Getting Started

Open `journey-archive/restaurant.html`, `journey-archive/marina.html`, or `journey-archive/lawrence.html` in your browser. No dependencies or API key required.