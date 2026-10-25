// Procedural 2D Perlin/Simplex noise implementation
export function createNoise2D() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const n = Math.floor(Math.random() * (i + 1));
    const q = p[i];
    p[i] = p[n];
    p[n] = q;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function grad2d(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function (x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);

    const a = perm[X] + Y;
    const aa = perm[a];
    const ab = perm[a + 1];
    const b = perm[X + 1] + Y;
    const ba = perm[b];
    const bb = perm[b + 1];

    const x1 = THREE_lerp(grad2d(perm[aa], xf, yf), grad2d(perm[ba], xf - 1, yf), u);
    const x2 = THREE_lerp(grad2d(perm[ab], xf, yf - 1), grad2d(perm[bb], xf - 1, yf - 1), u);
    return THREE_lerp(x1, x2, v);
  };
}

function THREE_lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}
