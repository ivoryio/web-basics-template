import { Entity } from './Entity'
import { IDomainEvent } from './events/IDomainEvent'
import { UniqueEntityID } from './UniqueEntityID'

export abstract class AggregateRoot<T> extends Entity<T> {
  public get id(): UniqueEntityID {
    return this._id
  }

  public get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length)
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  private _domainEvents: IDomainEvent[] = []
}
