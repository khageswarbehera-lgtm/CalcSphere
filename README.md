# CalcSpace

CalcSpace is a client-side React calculator application built with Vite and TypeScript.

## Current features

- **Arithmetic:** Evaluate expressions with Math.js, using a keypad or direct text input. The application stores up to six recent expressions in component state, but does not currently display them.
- **Advanced math:** Solve equations and calculate derivatives or indefinite integrals with Nerdamer.
- **Physics:** Calculate force, kinetic energy, and constant-velocity displacement.
- **Finance:** Estimate loan EMI and total payment, and calculate fixed-deposit maturity using annual compounding.
- **Interface:** Category navigation, lazy-loaded calculator sections, a responsive dark theme, and INR currency formatting.

## Development

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

## Build and verification

Run the TypeScript project check and production build with:

```sh
npm run build
```

On 2026-10-30, this command completed successfully: `tsc -b` passed and Vite generated the production build. Vite reported that the Arithmetic bundle (642.13 kB) and Advanced bundle (440.81 kB) exceed its 500 kB chunk warning threshold. No automated test script or test files are currently present.

## Notes

- Finance and physics results depend on the assumptions shown in the source; for example, the FD calculation compounds annually, and the displacement formula assumes constant velocity.
- Financial results are estimates and should be verified before making financial decisions.
- Keep credentials and environment-specific values out of source control. Local `.env*` files are ignored.
