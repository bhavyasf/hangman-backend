'use strict';

import {service} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {
  post,
  response,
  ResponseObject,
  patch,
  HttpErrors,
  param,
  get,
} from '@loopback/rest';
import {Games} from '../models';
import {GamesRepository} from '../repositories';

import {RandomWordService} from '../services';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */


function checkIfTheWordIsComplete(wordProgress: string, completeWord: string): boolean {
  wordProgress = wordProgress.split('').map(letter => letter.toLowerCase()).join('');
  completeWord = completeWord.split('').map(letter => letter.toLowerCase()).join('');
  return wordProgress === completeWord;
}


export class GameController {
  constructor(
    @service(RandomWordService) public randomWordService: RandomWordService,
    @repository(GamesRepository) public gamesRepository: GamesRepository,
  ) { }

  // Map to `GET /ping`
  @post('/games')
  @response(200, PING_RESPONSE)
  async startGame(): Promise<any> {
    try {
      const {data} = await this.randomWordService.getRandomWord();
      const [{word}] = data;
      const wordProgress = this.randomWordService.replaceMostLettersWithDashes(word);
      const {id, guesses} = await this.gamesRepository.create({
        completeWord: word,
        wordProgress,
        guesses: 5,
      })
      return {
        wordProgress,
        id,
        guesses,
        newGame: true,
      };
    } catch (error) {
      throw new Error(error.message || 'Error fetching Random Word!');
    }
  }

  @patch('/games/{id}/letters/{letter}')
  @response(200, PING_RESPONSE)
  async submitLetter(
    @param.path.string('id') id: string,
    @param.path.string('letter') letter: string,
  ): Promise<any> {
    letter = letter.toLowerCase();
    const gameData = await this.gamesRepository.findById(id);
    if (!gameData) {
      throw new HttpErrors.NotFound('Game not Found');
    }

    const {wordProgress, completeWord, hasWon} = gameData;
    let {guesses} = gameData;
    if (hasWon) {
      throw new HttpErrors.BadRequest('This game has already been won! Please start a new game!');
    }
    if (!guesses) {
      throw new HttpErrors.BadRequest(JSON.stringify({
        message: 'This game has already been completed because all incorrect attempts has been made.',
        guesses,
      }));
    }
    const remainingLetters = [];
    for (let index = 0; index < wordProgress.length; index += 1) {
      if (wordProgress[index] === '_') {
        remainingLetters.push(completeWord[index].toLowerCase());
      }
    }
    const checkIfLetterIsCorrect = remainingLetters.includes(letter);
    if (!checkIfLetterIsCorrect) {
      guesses -= 1;
      await this.gamesRepository.updateById(id, {
        guesses,
        modifiedAt: new Date().toISOString(),
      });
      throw new HttpErrors.BadRequest(JSON.stringify({
        message: guesses ? 'Incorrect letter!' : 'You have made all incorrect attempts',
        guesses,
      }));
    }
    let updatedWordProgess = '';
    for (let index = 0; index < wordProgress.length; index += 1) {
      if (wordProgress[index] === '_' && letter === completeWord[index].toLowerCase()) {
        updatedWordProgess += completeWord[index];
      } else {
        updatedWordProgess += wordProgress[index];
      }
    }

    const updateData = {
      wordProgress: updatedWordProgess,
      hasWon: false,
      modifiedAt: new Date().toISOString(),
      id,
    };
    if (checkIfTheWordIsComplete(updatedWordProgess, completeWord)) {
      updateData.hasWon = true;
    }
    await this.gamesRepository.updateById(id, updateData);
    return updateData;
  }

  @patch('/games/{id}/words/{word}')
  @response(200, PING_RESPONSE)
  async submitWord(
    @param.path.string('id') id: string,
    @param.path.string('word') word: string,
  ) {
    const gameData = await this.gamesRepository.findById(id);
    if (!gameData) {
      throw new HttpErrors.NotFound('Game Not Found!');
    }
    const {completeWord, hasWon} = gameData;
    let {guesses} = gameData;
    if (hasWon) {
      throw new HttpErrors.BadRequest('This game has already been won! Please start a new game!');
    }
    if (!guesses) {
      throw new HttpErrors.BadRequest(JSON.stringify({
        message: 'This game has already been completed because all incorrect attempts has been made.',
        guesses,
      }));
    }
    if (!checkIfTheWordIsComplete(word, completeWord)) {
      guesses -= 1;
      await this.gamesRepository.updateById(id, {
        guesses,
        modifiedAt: new Date().toISOString(),
      });
      throw new HttpErrors.BadRequest(JSON.stringify({
        message: guesses ? 'Incorrect Word!' : 'You have made all incorrect attempts',
        guesses,
      }));
    }
    const updateData = {
      wordProgress: word,
      hasWon: true,
      modifiedAt: new Date().toISOString(),
      id,
    }
    await this.gamesRepository.updateById(id, updateData);
    return updateData;
  }

  @get('/games/{id}')
  @response(200, PING_RESPONSE)
  async getGameDetailsById(
    @param.path.string('id') id: string,
    @param.query.string('hasWon') hasWon: boolean,

  ): Promise<Games> {
    const where: Where<Games> = {id};
    if (String(hasWon)) {
      where.hasWon = hasWon;
    }
    const gameDetails = await this.gamesRepository.findOne({
      fields: ['wordProgress', 'createdAt', 'guesses', 'id', 'modifiedAt', 'hasWon'],
      where,
    });
    if (!gameDetails) {
      throw new HttpErrors.NotFound('Game details not found!');
    }
    return gameDetails;
  }
}
