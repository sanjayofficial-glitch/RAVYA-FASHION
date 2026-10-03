/**
 * Hand-rolled spring integrator (Designing Fluid Interfaces, WWDC 2018).
 *
 * The whole point of a spring over a duration-based transition is that it can
 * be interrupted: retarget mid-flight, read the velocity, hand it to a gesture.
 * Nothing here needs a dependency, and the plan's 180KB first-load budget rules
 * out a 30KB animation library for ~40 lines of maths.
 *
 * Parameters are the designer-facing pair, not mass/stiffness/damping:
 *   damping  (zeta)    1.0 = critically damped, no overshoot
 *   response (s)       time to reach the target. NOT a duration — settle time
 *                      is emergent, so a retarget never clips the tail.
 */

export type SpringHandle = {
  /** Cancel the rAF loop. Also cancels any competing `el.animate()` on `el`. */
  stop(): void;
  /** Aim at a new target from wherever the value currently is. */
  retarget: (to: number, velocity?: number) => void;
  /** px/s, for handing momentum to a gesture or the next spring. */
  currentVelocity: () => number;
  /** Current value, without subscribing. */
  currentValue: () => number;
  /**
   * Resolves on settle, and also on stop() — a caller awaiting this can never
   * be left hanging, which is what makes it safe to replace `setTimeout(250)`.
   */
  finished: Promise<void>;
};

export type SpringOptions = {
  from: number;
  to: number;
  /** px/s. Read from a cancelled animation or a gesture release. */
  velocity?: number;
  damping: number;
  response: number;
  /** Write only `transform` / `opacity` — anything else is a layout read. */
  onUpdate: (value: number, velocity: number) => void;
  /** Fires once at settle, after the final `onUpdate`. Not called by stop(). */
  onDone?: () => void;
  /** Sub-pixel asymptote guard so `finished` cannot hang. */
  restDelta?: number;
  restSpeed?: number;
  /** Optional competing Web Animation on the same element, cancelled on start. */
  el?: Element & { getAnimations?: () => Animation[] };
};

/**
 * Fixed substep. A per-frame semi-implicit Euler goes unstable below ~30fps,
 * which is the primary target device class for this site, so the rAF delta is
 * accumulated and drained in 1/240s slices instead.
 */
const SUBSTEP = 1 / 240;
/** Never integrate more than this in one frame (backgrounded tab, jank spike). */
const MAX_DELTA = 0.1;

export function startSpring(opts: SpringOptions): SpringHandle {
  const {
    from,
    to: initialTo,
    velocity = 0,
    damping,
    response,
    onUpdate,
    onDone,
    restDelta = 0.1,
    restSpeed = 1,
    el,
  } = opts;

  // response -> natural frequency -> spring constants.
  const omega = (2 * Math.PI) / Math.max(response, 1e-4);
  const stiffness = omega * omega;
  const dampingConstant = 2 * damping * omega;

  let value = from;
  let vel = velocity;
  let target = initialTo;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let running = false;
  let resolve!: () => void;
  const finished = new Promise<void>((r) => {
    resolve = r;
  });

  // One writer per property: any Web Animation still driving this element is a
  // second writer on the same transform, so it has to go before we start.
  const clearCompeting = () => {
    if (!el || typeof el.getAnimations !== 'function') return;
    for (const anim of el.getAnimations()) {
      if (anim instanceof Animation) anim.cancel();
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;
    if (!last) last = now;
    let dt = (now - last) / 1000;
    last = now;
    if (dt > MAX_DELTA) dt = MAX_DELTA;
    acc += dt;
    let stepped = false;
    while (acc >= SUBSTEP) {
      acc -= SUBSTEP;
      stepped = true;
      const a = -stiffness * (value - target) - dampingConstant * vel;
      vel += a * SUBSTEP;
      value += vel * SUBSTEP;
    }
    if (stepped) onUpdate(value, vel);
    if (Math.abs(value - target) < restDelta && Math.abs(vel) < restSpeed) {
      settle();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = 0;
    acc = 0;
    raf = requestAnimationFrame(frame);
  };

  const settle = () => {
    if (!running) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    value = target;
    vel = 0;
    onUpdate(value, 0);
    resolve();
    onDone?.();
  };

  if (Math.abs(value - target) < restDelta && Math.abs(vel) < restSpeed) {
    // Already there — settle synchronously so callers can rely on `finished`.
    onUpdate(target, 0);
    resolve();
    clearCompeting();
  } else {
    clearCompeting();
    start();
  }

  return {
    stop() {
      if (!running) return;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      // Resolve so nobody awaits a promise that can no longer complete.
      resolve();
    },
    retarget(to, nextVelocity) {
      target = to;
      if (nextVelocity !== undefined) vel = nextVelocity;
      if (!running) {
        if (Math.abs(value - target) < restDelta && Math.abs(vel) < restSpeed) {
          onUpdate(target, 0);
          resolve();
          return;
        }
        start();
      }
    },
    currentVelocity: () => vel,
    currentValue: () => value,
    finished,
  };
}
