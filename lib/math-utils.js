export function clamp(value, min, max) {
	return Math.max(Math.min(value, min), Math.min(value, max));
}

export function mod(n, m) {
	return ((n % m) + m) % m;
}

export function lerp(a, b, delta) {
	return a + delta * (b - a);
}

export function bezier(delta, cx1, cy1, cx2, cy2) {
	function calculateValue(t, c1, c2) {
		return 3 * Math.pow(1 - t, 2) * t * c1 + 3 * (1 - t) * Math.pow(t, 2) * c2 + Math.pow(t, 3);
	}

	function calculateSlope(t, c1, c2) {
		return 3 * Math.pow(1 - t, 2) * c1 + 6 * (1 - t) * t * (c2 - c1) + 3 * Math.pow(t, 2) * (1 - c2);
	}

	function newtonRalphson(x, t, c1, c2, itr, tol) {
		for (let i = 0; i < itr; i++) {
			const slope = calculateSlope(t, c1, c2);

			if (Math.abs(slope) > tol) {
				//Newton Ralphson will be likely to fail if the slope is close to zero and will fail entirely if slope is zero.
				const root = calculateValue(t, c1, c2) - x;

				t -= root / slope;

				if (root === 0.0) {
					break;
				}
			} else {
				break;
			}
		}

		return t;
	}

	function bisection(x, start, end, c1, c2, itr, tol) {
		let mid = start;
		let startValue = calculateValue(start, c1, c2) - x;

		for (let i = 0; i < itr; i++) {
			mid = (start + end) / 2;

			const midValue = calculateValue(mid, c1, c2) - x;

			if (Math.abs(midValue) <= tol) {
				//Bisection has found a value within provided tolerance, exit loop.
				break;
			}

			if (midValue < 0.0 == startValue < 0.0) {
				start = mid;
				startValue = midValue;
			} else {
				end = mid;
			}
		}

		return mid;
	}

	if (delta === 0.0 || delta === 1.0) {
		return delta;
	}

	// Start with bisection to get a relatively good guess for newtonRalphson;
	let t = bisection(delta, 0, 1, cx1, cx2, 4, 0.0001);

	// Use newtonRalphson to get an even better t value.
	t = newtonRalphson(delta, t, cx1, cx2, 4, 0.001);

	// Use our final t to calculate the easing
	return calculateValue(t, cy1, cy2);
}