import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HangmanDataSource} from '../datasources';
import {Games, GamesRelations} from '../models';

export class GamesRepository extends DefaultCrudRepository<
  Games,
  typeof Games.prototype.id,
  GamesRelations
> {
  constructor(
    @inject('datasources.hangman') dataSource: HangmanDataSource,
  ) {
    super(Games, dataSource);
  }
}
