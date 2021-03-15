import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import axios, {AxiosResponse} from 'axios';


@injectable({scope: BindingScope.TRANSIENT})
export class RandomWordService {
  API_URL: string;
  constructor() {
    this.API_URL = 'https://san-random-words.vercel.app/';
  }
  /*
   * Add service methods here
   */
  async getRandomWord(): Promise<AxiosResponse<any>> {
    try {
      const data = await axios.get(this.API_URL);
      return data;
    } catch (error) {
      throw new Error('Some error occured fetching random word!');
    }
  }

  replaceMostLettersWithDashes(word: string): string {
    let guessWord = '';
    const randomWordLength: number = parseInt(String(parseInt(String(word.length / 2), 10) * Math.random()));
    const randomIndexes: number[] = []; // letters except in randomIndexes will be replaced by _
    for (let index = 0; index < randomWordLength; index += 1) {
      let randomIndex = parseInt(String(Math.random() * word.length));
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }
    for (let index = 0; index < word.length; index += 1) {
      if (!randomIndexes.includes(index)) {
        guessWord += '_';
      } else {
        guessWord += word[index];
      }
    }
    return guessWord;
  }

}
