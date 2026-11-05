# CalcSphere Deployment Checklist

## Build Verification
- [x] Run `npm run build` - must complete successfully
- [x] Verify `dist/index.html` exists
- [x] Verify all `dist/assets/*.js` and `dist/assets/*.css` files generated
- [x] Check for any `(!) Some chunks are larger than 500 kB after minification` warnings (acceptable for this app)

## Production Checklist
- [ ] Set up hosting (Vercel, Netlify, or GitHub Pages recommended)
- [ ] Configure custom domain if needed
- [ ] Test HTTPS is enforced
- [ ] Test mobile responsiveness on real devices
- [ ] Test all calculator categories function correctly
- [ ] Verify history persistence works after browser restart
- [ ] Verify unit converter works across all unit types
- [ ] Verify finance calculations with reference values
- [ ] Verify physics equations with reference values

## Post-Deployment Testing
- [ ] Open deployed URL and verify homepage loads
- [ ] Navigate to all calculator sections
- [ ] Perform sample calculations in each category
- [ ] Test keyboard accessibility (Enter to calculate, Esc to clear)
- [ ] Test touch/click interactions
- [ ] Verify no console errors in browser DevTools

## Rollback Plan
- [ ] Keep original `dist/` folder backup
- [ ] Note the `npm run build` command for quick rebuild
- [ ] Have previous deployment URL ready

## Environment Notes
- [ ] No API keys or secrets required - fully client-side application
- [ ] All calculations run in browser (mathjs, nerdamer)
- [ ] Unit converter and finance formulas use local constants only
- [ ] No backend server needed
