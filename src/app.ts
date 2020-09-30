// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/dialogflow-fulfillment/index.d.ts
import { BasicCard, Button, BrowseCarousel, BrowseCarouselItem, Image, Suggestions, LinkOutSuggestion, List } from 'actions-on-google'
import { WebhookClient } from 'dialogflow-fulfillment'
import express, { Application, Request, Response, NextFunction } from 'express'

import {intentHandler} from './intents/intentHandler'

const app: Application = express()

app.get('/', (request: Request, response: Response, next: NextFunction) => {
  response.send('Online')
})

app.post('/dialogflow', express.json(), (request: Request, response: Response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  return intentHandler(agent)
})

module.exports = app