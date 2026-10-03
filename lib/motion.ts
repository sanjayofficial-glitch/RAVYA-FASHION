export const EASE_SWIFT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const REVEAL_MS = 450;
export const REVEAL_STAGGER_MS = 60;

/**
 * Momentum projection — where a flick would coast to rest.
 *
 * Exponential decay, not the textbook v²/(2·decel) form: the platform's own
 * model, and the reason a slow drag and a hard flick can land on the same
 * decision boundary. `initialVelocity` is px/s, the result is px.
 */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return (initialVelocity / 1000) * (decelerationRate / (1 - decelerationRate));
}

/**
 * Rubber-banding — progressive resistance past an edge, never a hard stop.
 * A hard stop reads as the interface freezing; the asymptote reads as mass.
 * `overshoot` in px, `dimension` the size of the travel being resisted.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (overshoot === 0 || dimension <= 0) return 0;
  return (1 - 1 / ((overshoot * constant) / dimension + 1)) * dimension;
}
