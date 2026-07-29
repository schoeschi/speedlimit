# thruut Auto

thruut Auto is a mobile app designed to be used as a car dashboard. It is built on the Overpass API.

## Key Features

### Road Safety

* See speed limits
* See current speed
* See current road name

### Customization

* Re-fetch road infos based on distance moved
* Set custom Overpass API endpoints
* Dark mode

## Setup

### Quick installation

To install thruut Auto on your Android smartphone, download the APK from the latest release page and install it.

### Self-built

#### Prerequisites

* Android Studio
* Internet Access

#### Step-by-step Guide

1. Clone the repository and install all dependencies with `npm install`
2. Generate the app assets with `npx capacitor-assets generate --android`
3. Open the Capacitor App in Android Studio with `npx cap open android`
4. Synchronise any changes made with `npx cap sync`
5. Build the APK inside Android Studio