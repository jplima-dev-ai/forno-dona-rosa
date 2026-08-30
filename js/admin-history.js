(() => {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function create(limit = 30) {
    const snapshots = [];
    function reset(initial) { snapshots.splice(0, snapshots.length, { at: Date.now(), label: "Configuração carregada", state: clone(initial) }); }
    function capture(state, label = "Alteração de configuração") {
      const serialized = JSON.stringify(state);
      const previous = snapshots[snapshots.length - 1];
      if (previous && JSON.stringify(previous.state) === serialized) return false;
      snapshots.push({ at: Date.now(), label, state: clone(state) });
      if (snapshots.length > limit) snapshots.splice(0, snapshots.length - limit);
      return true;
    }
    function canUndo() { return snapshots.length > 1; }
    function undo() { if (!canUndo()) return null; snapshots.pop(); return clone(snapshots[snapshots.length - 1].state); }
    function clearKeepCurrent(state) { reset(state); }
    function entries() { return snapshots.slice(1).map(({at,label}) => ({at,label})).reverse(); }
    return Object.freeze({ reset, capture, canUndo, undo, clearKeepCurrent, entries });
  }
  window.ADMIN_HISTORY = Object.freeze({ create });
})();
