# Dialogflow Webhook Setup

This document outlines the setup required to create an external fulfillment codebase linked to Dialogflow via webhook.
Most of the work in Steps One and Two are finished with this template, but the steps are there as a reference.

## Step One - Setup and Dependencies

- In your root folder, create two folders named `dist` and `src`.
- In the terminal, run `yarn add actions-on-google dialogflow-fulfillment express ts-node firebase-tools@latest`, then `yarn add -D ngrok nodemon typescript @types/actions-on-google @types/dialogflow-fulfillment @types/express @types/node @types/nodemon`. If there is an error saying your version of node is incompatible with `dialogflow-fulfillment`, use `--ignore-engines` for all yarn commands.
- In the terminal, run `tsc --init` and `yarn init -y` to create `tsconfig.json` and `package.json` files.
- In `tsconfig.json`, define `"outDir": "./dist"`, `"rootDir": "./src"`, and `"moduleResolution": "node"`.
- In `package.json`, define scripts like this:
  "scripts": {
  "start": "node dist/server.js",
  "dev": "nodemon src/server.ts",
  "build": "tsc -p .",
  "tunnel": "ngrok http 5000"
  }

## Step Two - Create an Express Server

- Import all required packages from actions-on-google, dialogflow-fulfillment, and express in `app.ts` file.
- Create an express server in the `app.ts` file, and use `app.listen()` in the `server.ts` file.
- Create app.post on a `/dialogflow` server endpoint.
- Remove the Firebase-specific code from your fulfillment functions and paste in to the `/dialogflow` endpoint.
  - If you're viewing a fresh DF agent, copy everything from the `agent` variable declaration to the final intent map.
- Some code in your intent functions will need to be refactored or added.
  - `agent.context.get` becomes `agent.getContext`.
  - `agent.context.set` becomes `agent.setContext`.
  - After your final intentMap, add `agent.handleRequest(intentMap)`.
  - Add the following to `cloud.ts`:
    const functions = require('firebase-functions')
    const app = require('./app')
    exports.app = functions.http.onRequest(app)
- Alternatively, you can create individual files for each intent function, and import them in to a handler. See **Step Five** for more information.

## Step Three - Commands and Local Testing

- If using VSCode, use the built in terminal to run `yarn dev`. This will point nodemon to the `app.listen()` function in that file, and will track any changes made throughout the rest of the document for easy testing.
- Use an external shell, like GitBash, point the terminal to your root directory, and run `yarn tunnel`. When the ngrok connection is established, paste the https forwarding address in the terminal, followed by our `/dialogflow` endpoint, in the Webhook URL field in Dialogflow Fulfillment, and press deploy. Example: `https://[string].ngrok.io/dialogflow`.
  - Be aware that every time you restart your ngrok server, it will generate a new address for you to use if you are on a free plan. However, that address is valid for 8 hours. So keep that ngrok terminal open and running while you are testing locally.
- In a Botcopy agent or the Dialogflow preview, trigger an intent you've set up with Fulfillment. You should see a `200 - OK` ping in the ngrok terminal, and any `console.logs` you've created in the app will appear in your VSCode terminal.
- **This method is for local testing** - this is much faster than deploying to cloud functions from Dialogflow's inline editor. It also allows full use of typescript, linters, and quality of life features in VSCode. However, once you've made changes and want to push to production, follow Step Four. Reminder - you need to change webhook URL to the ngrok address each time a new tunnel is created.

## Step Four - Deploying to Firebase

- Go to Firebase and create a new project, linking it to the Google Cloud Project for your Dialogflow Agent
- Use the Firebase CLI to prepare your project for deployment:
  - Create `firebase.json` in the root of your VSCode project, and add `{"functions":{"source": ".", "predeploy":["yarn lint"]}}`
  - Run `firebase login` in your terminal and login. If your terminal doesn't recognize the `firebase` command, try downloading it globally with `yarn global add firebase-tools@latest`
  - Run `firebase use --add` in the terminal and find the project id of your bot using arrow keys
  - Edit the `"main"` field in `package.json` to be `"main": "./dist/cloud.js"`
  - Deploy using `firebase deploy --only functions`
- If the deploy is successful, you can open the URL provided in the terminal to view the function's logs for debugging
- Change the webhook URL in Dialogflow Fulfillment to https://us-central1-[projectId].cloudfunctions.net/app/dialogflow, and save
- Test with a Botcopy agent or the Dialogflow preview.
- **This method is for production** - this deploys the function to Firebase for production. For testing purposes, use the local testing in Step Three. I would recommend having a clone of your production bot for testing, so that the production bot's webhook URL is permanently set to the firebase endpoint. Once you have made some changes on the experimental bot, you can transfer the new fulfillment over to the production bot and deploy.

## Step Five - Adding New Intents and Functions

- `src/intents/intentHandler.ts` contains the intentMap you would normally see at the bottom of a fulfillment file
- Organization is up to you, but I like to create a file for each intent function, and import it in to `intentHandler`, where it functions like it would in fulfillment
- `intentHandler` is imported in to the `/dialogflow` endpoint in `app.ts`
