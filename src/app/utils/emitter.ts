export type Emitter<EventType> = {
	/** List of all subscribers. */
	subscribers: Subscription<EventType>[],
	/** Subscribe to new events if given subscription is not already present. */
	subscribe(subscription: Subscription<EventType>): void,
	/** Remove given subscription from subscribers. */
	unsubscribe(subscription: Subscription<EventType>): void,
	/** Send event to all subscribers. */
	publish(event: EventType): void,
}

type Subscription<EventType> = (event: EventType) => any;

export function createEmitter<EventType>(): Emitter<EventType> {
	return {
		subscribers: [],
		subscribe(subscription: Subscription<EventType>) {
			const index = this.subscribers.indexOf(subscription);
			if(index === -1) {
				this.subscribers.push(subscription);
			}
		},
		unsubscribe(subscription: Subscription<EventType>) {
			const index = this.subscribers.indexOf(subscription);
			if(index > -1) {
				this.subscribers.splice(index, 1);
			}
		},
		publish(event: EventType) {
			this.subscribers.forEach(sub => {
				sub(event);
			});
		}
	}
}