export type Emitter<EventType> = {
    /** Subscribe to new events */
    subscribe(sub: Subscription<EventType>): void,
    /** List of all subscribers */
    subscribers: Subscription<EventType>[],
    /** Send event to all subscribers */
    publish(event: EventType): void,
}

type Subscription<EventType> = (event: EventType) => any;