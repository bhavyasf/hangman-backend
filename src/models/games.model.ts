import {Entity, model, property} from '@loopback/repository';

@model()
export class Games extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'complete_word',
  })
  completeWord: string;

  @property({
    type: 'string',
    required: true,
    name: 'word_progress',
  })
  wordProgress: string;

  @property({
    type: 'number',
    required: true,
    name: 'guesses',
  })
  guesses: number;

  @property({
    type: 'boolean',
    required: false,
    name: 'has_won',
  })
  hasWon: boolean;

  @property({
    type: 'date',
    required: false,
    name: 'created_at',
  })
  createdAt: string;

  @property({
    type: 'date',
    required: false,
    name: 'modified_at',
  })
  modifiedAt: string;


  constructor(data?: Partial<Games>) {
    super(data);
  }
}

export interface GamesRelations {
  // describe navigational properties here
}

export type GamesWithRelations = Games & GamesRelations;
