const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('js/mesa-dona-rosa-v4-1-3.js', 'utf8');
const sandbox = {
  window: {
    FORNO_PORTIONS: {
      recommend: ({ adults }) => ({
        plan: adults <= 3 ? [{ size: 'grande', qty: 1 }] : [{ size: 'familia', qty: Math.ceil(adults / 4) }],
        range: { min: adults, max: adults + 2 },
      }),
    },
  },
  document: { readyState: 'loading', addEventListener() {} },
  Object,
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const build = sandbox.window.FORNO_MESA.build;
const checks = [
  ['4 people has pizzas', build({ people: 4 }).items.filter((x) => x.size).length >= 1],
  ['drink for 4', build({ people: 4, drink: 'coca' }).items.some((x) => !x.size)],
  ['no drink respected', !build({ people: 4, drink: 'nenhuma' }).items.some((x) => !x.size)],
  ['vegetarian pool', build({ people: 6, style: 'vegetariana' }).items.filter((x) => x.size).every((x) => ['orto','mediterranea','funghi-vegana','margherita-vegana'].includes(x.productId))],
  ['people lower bound', build({ people: 0 }).people === 2],
  ['people upper bound', build({ people: 99 }).people === 12],
];
for (const [name, ok] of checks) console.log(ok ? 'PASS ' : 'FAIL ', name);
if (checks.some((x) => !x[1])) process.exit(1);
console.log(`${checks.length}/${checks.length} Mesa behavior checks passed`);
