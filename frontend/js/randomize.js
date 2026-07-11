// randomize.js — "Random" button on /create.
// Fills the two text fields from two distinct 50-phrase lists and picks a
// random option in each dropdown, skipping the "sans" (empty-value) option.

(function () {
  // Field 1: the logo subject ("Describe your logo…").
  const SUBJECTS = [
    "a soaring mountain peak", "a curled sleeping fox", "a lighthouse on a cliff",
    "a paper airplane mid-flight", "a blooming lotus flower", "a running greyhound",
    "an owl perched at dusk", "a sailboat on open water", "a honeybee in flight",
    "a crescent moon over hills", "a leaping salmon", "a coffee bean sprouting",
    "a compass rose", "a stag with tall antlers", "a hummingbird and a flower",
    "a pine tree silhouette", "a koi fish circling", "a rising phoenix",
    "a vintage typewriter", "a hot air balloon", "a wolf howling at the moon",
    "a stack of open books", "a folding origami crane", "a desert cactus in bloom",
    "a hawk with spread wings", "a curling ocean wave", "a bicycle wheel in motion",
    "a mountain goat on a ridge", "a glowing campfire", "a swallow in mid-turn",
    "a rocket lifting off", "a snail with a spiral shell", "a barn owl in silhouette",
    "a maple leaf falling", "a whale breaching", "a chess knight piece",
    "a dragonfly over a pond", "a coiled rope knot", "a soaring eagle",
    "a tulip field at sunrise", "a fox curled by a den", "a jellyfish drifting",
    "a mushroom under ferns", "a galloping horse", "a peacock fanning its tail",
    "a bonsai tree", "a paper boat on a stream", "a butterfly on a thistle",
    "a mountain range at dawn", "a raven mid-flight"
  ];

  // Field 2: the background / setting.
  const BACKGROUNDS = [
    "a soft gradient sky", "rolling misty hills", "a deep starry night",
    "a calm ocean horizon", "a dense pine forest", "a warm sunset glow",
    "a snowy alpine valley", "a field of tall grass", "a golden wheat field",
    "a minimal circular emblem", "a geometric hexagon frame", "a pale morning fog",
    "rippling desert dunes", "a moonlit lake", "a bank of drifting clouds",
    "a coral reef underwater", "a city skyline at dusk", "a bamboo grove",
    "a lavender field in bloom", "a rocky coastal shore", "a canopy of autumn leaves",
    "a clear turquoise lagoon", "a starlit mountain ridge", "a soft pastel horizon",
    "a rippling water surface", "a windswept prairie", "a cavern of glowing crystals",
    "a quiet birch forest", "a sunlit meadow", "a swirling galaxy",
    "a terraced rice paddy", "a frozen tundra plain", "a blossoming cherry orchard",
    "a smooth marble texture", "a dark slate backdrop", "a rising aurora",
    "a foggy harbor at dawn", "a sun-baked canyon", "a tranquil zen garden",
    "a rolling green hillside", "a stormy grey sky", "a tropical palm beach",
    "a moss-covered stone wall", "a radiant sunburst", "a still mountain lake",
    "a dune-lined coastline", "a soft linen texture", "a night sky full of stars",
    "a bright open horizon", "a shadowed forest floor"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Set a native input's value and fire input/change so any listeners react.
  function setValue(el, value) {
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Choose a random <option> for a <select>, skipping the empty-value "sans".
  function randomizeSelect(sel) {
    const opts = Array.from(sel.options).filter((o) => o.value !== "");
    if (!opts.length) return;
    const choice = pick(opts);
    sel.value = choice.value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function randomize() {
    setValue(document.querySelector('input[name="Image Of"]'), pick(SUBJECTS));
    setValue(document.querySelector('input[name="Background"]'), pick(BACKGROUNDS));
    document
      .querySelectorAll("select.input-logo-design-2")
      .forEach(randomizeSelect);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("random-button");
    if (btn) btn.addEventListener("click", randomize);
  });
})();
