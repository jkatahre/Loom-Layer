/**
 * Generates every WebP image referenced by the demo catalogue and config.
 *
 *   npm run images            (requires ImageMagick 7 — the `magick` command)
 *
 * The images are stylised renders (fabric textures, folded curtain panels,
 * simple room scenes) used as placeholders. Replace any file with real
 * photography of the same name — see README › Images.
 */
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fabricVariants } from '../src/data/fabricVariants';
import { productById } from '../src/data/products';
import type { FabricVariant, HeadingStyle, RoomSlug, Texture } from '../src/types/product';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
const TMP = path.join(tmpdir(), 'loom-and-layer-images');
const FORCE = process.argv.includes('--force');
const QUALITY = '74';

for (const d of ['banners', 'curtains', 'fabrics', 'rooms', 'details', 'showroom']) mkdirSync(path.join(ROOT, d), { recursive: true });
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ── process helpers ──────────────────────────────────────────────────────────
function magick(args: string[]): Promise<void> {
  return new Promise((resolve, reject) =>
    execFile('magick', args, { maxBuffer: 1 << 24, windowsHide: true }, (err, _out, stderr) =>
      err ? reject(new Error(`${stderr || err.message}\nargs: ${args.join(' ')}`)) : resolve(),
    ),
  );
}

async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0;
  let done = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const item = items[i++]!;
      await fn(item);
      done++;
      if (done % 25 === 0) console.log(`  … ${done}/${items.length}`);
    }
  });
  await Promise.all(workers);
}

const tmp = (name: string) => path.join(TMP, name);
const out = (rel: string) => path.join(ROOT, rel);
const skip = (rel: string) => !FORCE && existsSync(out(rel));

// ── colour helpers ───────────────────────────────────────────────────────────
const rgb = (hex: string) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16)) as [number, number, number];
};
const toHex = (c: number[]) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [rgb(a), rgb(b)];
  return toHex(x.map((v, i) => v + (y[i]! - v) * t));
};
const lum = (hex: string) => {
  const [r, g, b] = rgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

// ── motifs ───────────────────────────────────────────────────────────────────
type Motif =
  | 'flower' | 'buti' | 'damask' | 'palm' | 'lemon' | 'trellis' | 'check' | 'grid' | 'stripe' | 'pinstripe'
  | 'stars' | 'triangles' | 'chevron' | 'ikat' | 'brush' | 'fan' | 'vine' | 'ombre';

const PRODUCT_MOTIF: Record<string, Motif> = {
  'p-004': 'flower', 'p-007': 'stripe', 'p-008': 'fan', 'p-012': 'stars', 'p-013': 'triangles', 'p-014': 'check',
  'p-015': 'lemon', 'p-016': 'buti', 'p-017': 'ikat', 'p-018': 'vine', 'p-020': 'damask', 'p-026': 'trellis',
  'p-029': 'brush', 'p-030': 'chevron', 'p-032': 'pinstripe', 'p-034': 'palm', 'p-035': 'check', 'p-037': 'damask',
  'p-040': 'ombre', 'p-041': 'grid',
};

const petals = (cx: number, cy: number, n: number, len: number, wid: number, fill: string) =>
  Array.from({ length: n }, (_, k) =>
    `push graphic-context translate ${cx},${cy} rotate ${(360 / n) * k} fill ${fill} ellipse 0,-${len} ${wid},${len} 0,360 pop graphic-context`,
  ).join(' ');
const leaf = (cx: number, cy: number, angle: number, len: number, wid: number, fill: string) =>
  `push graphic-context translate ${cx},${cy} rotate ${angle} fill ${fill} ellipse ${len},0 ${len},${wid} 0,360 pop graphic-context`;

function motifMvg(m: Motif, a: string, b: string): { size: number; mvg: string; blur?: number } {
  switch (m) {
    case 'flower':
      return { size: 240, mvg: [leaf(60, 60, 30, 26, 9, b), leaf(60, 60, 200, 22, 8, b), petals(60, 60, 5, 16, 9, a), `fill ${b} circle 60,60 66,60`,
        leaf(180, 180, 120, 26, 9, b), petals(180, 180, 5, 16, 9, a), `fill ${b} circle 180,180 186,180`, petals(180, 50, 6, 6, 3, a), petals(55, 185, 6, 6, 3, a)].join(' ') };
    case 'buti':
      return { size: 120, mvg: [petals(30, 30, 6, 9, 5, a), `fill ${b} circle 30,30 33,30`, petals(90, 90, 6, 9, 5, a), `fill ${b} circle 90,90 93,90`].join(' ') };
    case 'damask':
      return { size: 260, mvg: [petals(130, 130, 8, 34, 12, a), `fill ${b} circle 130,130 142,130`, leaf(130, 130, -90, 60, 10, a), leaf(130, 130, 90, 60, 10, a),
        petals(0, 0, 4, 18, 8, a), petals(260, 0, 4, 18, 8, a), petals(0, 260, 4, 18, 8, a), petals(260, 260, 4, 18, 8, a)].join(' ') };
    case 'palm':
      return { size: 300, mvg: [...[-60, -30, 0, 30, 60].map((r) => leaf(80, 250, -90 + r, 70, 11, a)), ...[-50, -15, 20, 55].map((r) => leaf(230, 120, -90 + r, 60, 10, b))].join(' ') };
    case 'lemon':
      return { size: 160, mvg: [leaf(50, 50, -30, 20, 7, b), `fill ${a} ellipse 50,50 18,13 0,360`, leaf(130, 120, 150, 20, 7, b), `fill ${a} ellipse 120,125 18,13 0,360`].join(' ') };
    case 'trellis':
      return { size: 160, mvg: `fill none stroke ${a} stroke-width 7 path 'M 0,80 Q 40,20 80,80 Q 120,140 160,80' path 'M 80,0 Q 20,40 80,80 Q 140,120 80,160'` };
    case 'check':
      return { size: 80, mvg: `fill ${a} fill-opacity 0.45 rectangle 0,0 40,80 rectangle 0,0 80,40` };
    case 'grid':
      return { size: 120, mvg: `fill none stroke ${a} stroke-width 3 line 0,1 120,1 line 1,0 1,120 stroke-width 1 line 0,60 120,60 line 60,0 60,120` };
    case 'stripe':
      return { size: 160, mvg: `fill ${a} rectangle 0,0 54,160 fill ${b} rectangle 78,0 84,160` };
    case 'pinstripe':
      return { size: 60, mvg: `fill ${a} fill-opacity 0.7 rectangle 0,0 5,60` };
    case 'stars': {
      const star = (x: number, y: number, r: number) => {
        const pts = Array.from({ length: 10 }, (_, k) => {
          const rr = k % 2 === 0 ? r : r * 0.45;
          const t = (Math.PI / 5) * k - Math.PI / 2;
          return `${(x + rr * Math.cos(t)).toFixed(1)},${(y + rr * Math.sin(t)).toFixed(1)}`;
        });
        return `polygon ${pts.join(' ')}`;
      };
      return { size: 200, mvg: `fill ${a} ${star(50, 50, 16)} ${star(150, 120, 11)} ${star(70, 160, 8)} circle 130,40 133,40 circle 30,110 32,110 circle 170,180 172,180` };
    }
    case 'triangles':
      return { size: 200, mvg: `fill ${a} polygon 20,90 60,30 100,90 fill ${b} polygon 110,180 150,110 190,180 fill ${a} fill-opacity 0.6 polygon 10,190 35,150 60,190` };
    case 'chevron':
      return { size: 120, mvg: `fill none stroke ${a} stroke-width 16 path 'M -10,50 L 30,20 L 90,70 L 130,40'` };
    case 'ikat':
      return { size: 180, mvg: `fill ${a} polygon 90,10 160,90 90,170 20,90 fill ${b} polygon 90,50 125,90 90,130 55,90`, blur: 3 };
    case 'brush':
      return { size: 420, mvg: [leaf(40, 80, 15, 110, 22, a), leaf(220, 260, -20, 120, 26, b), leaf(120, 360, 5, 90, 18, a), leaf(300, 90, 40, 70, 16, b)].join(' '), blur: 2 };
    case 'fan':
      return { size: 120, mvg: `fill none stroke ${a} stroke-width 4 path 'M 0,120 A 60,60 0 0,1 120,120' path 'M 20,120 A 40,40 0 0,1 100,120' path 'M 40,120 A 20,20 0 0,1 80,120' path 'M -60,60 A 60,60 0 0,1 60,60' path 'M 60,60 A 60,60 0 0,1 180,60'` };
    case 'vine':
      return { size: 200, mvg: `fill none stroke ${a} stroke-width 3 path 'M 0,100 C 50,40 150,160 200,100' stroke none ${leaf(50, 72, -50, 14, 5, a)} ${leaf(150, 128, 130, 14, 5, a)} fill ${b} circle 100,100 104,100 circle 25,85 28,85 circle 175,115 178,115` };
    case 'ombre':
      return { size: 0, mvg: '' };
  }
}

function motifColours(v: FabricVariant, tonal: boolean): [string, string] {
  const hex = v.color_hex;
  const dark = lum(hex) < 0.5;
  if (tonal) return [dark ? mix(hex, '#FFFFFF', 0.22) : mix(hex, '#000000', 0.16), /gold/i.test(v.name) ? '#C9A55A' : dark ? mix(hex, '#FFFFFF', 0.4) : mix(hex, '#000000', 0.3)];
  const a = dark ? mix(hex, '#F3E9D8', 0.6) : mix(hex, '#2A2420', 0.5);
  const b = dark ? mix(hex, '#C9A55A', 0.5) : mix(mix(hex, '#2A2420', 0.35), '#4F6B4A', 0.45);
  return [a, b];
}

// ── texture & panel builders ────────────────────────────────────────────────
interface FabricSpec {
  key: string;
  hex: string;
  texture: Texture;
  motif: Motif | null;
  motifColours: [string, string];
  seed: number;
  sheer: boolean;
}

function specFor(v: FabricVariant, seed: number): FabricSpec {
  const motif = PRODUCT_MOTIF[v.product_id] ?? null;
  const tonal = v.texture === 'jacquard' || v.pattern === 'embroidered' || motif === 'pinstripe';
  return { key: v.id, hex: v.color_hex, texture: v.texture, motif, motifColours: motifColours(v, tonal), seed, sheer: v.opacity === 'sheer' };
}

const motifCache = new Map<string, Promise<string>>();
function motifTile(m: Motif, a: string, b: string, scale: number): Promise<string> {
  const def = motifMvg(m, a, b);
  const px = Math.max(8, Math.round(def.size * scale));
  const key = `${m}-${a}-${b}-${px}`.replace(/#/g, '');
  if (!motifCache.has(key)) {
    const file = tmp(`motif-${key}.png`);
    motifCache.set(
      key,
      magick(['-size', `${def.size}x${def.size}`, 'xc:none', '-draw', def.mvg, ...(def.blur ? ['-blur', `0x${def.blur}`] : []), '-resize', `${px}x${px}!`, file]).then(() => file),
    );
  }
  return motifCache.get(key)!;
}

const weaveCache = new Map<string, Promise<string>>();
function weaveTile(kind: 'herringbone' | 'basket', scale: number): Promise<string> {
  const key = `${kind}-${scale}`;
  if (!weaveCache.has(key)) {
    const file = tmp(`weave-${key}.png`);
    const mvg =
      kind === 'herringbone'
        ? 'stroke gray72 stroke-width 2 line 0,0 12,12 line 0,8 12,20 line 0,16 12,28 line 24,0 12,12 line 24,8 12,20 line 24,16 12,28 stroke gray30 line 0,4 12,16 line 24,4 12,16'
        : 'stroke gray70 stroke-width 2 line 0,3 16,3 line 0,8 16,8 line 0,13 16,13 line 19,16 19,32 line 24,16 24,32 line 29,16 29,32 stroke gray32 line 3,16 3,32 line 8,16 8,32 line 13,16 13,32 line 16,19 32,19 line 16,24 32,24 line 16,29 32,29';
    const size = kind === 'herringbone' ? '24x24' : '32x32';
    weaveCache.set(key, magick(['-size', size, 'xc:gray50', '-draw', mvg, '-blur', '0x0.6', '-resize', `${Math.round(scale * 100)}%`, file]).then(() => file));
  }
  return weaveCache.get(key)!;
}

/** Returns magick args that build a fabric texture of w×h onto the stack. */
async function textureArgs(f: FabricSpec, w: number, h: number, scale: number): Promise<string[]> {
  const size = `${w}x${h}`;
  const noise = (blur: string, lo: number, hi: number, att = 1.4) => [
    '(', '-size', size, 'xc:gray50', '-seed', String(f.seed), '-attenuate', String(att), '+noise', 'Gaussian', '-colorspace', 'Gray', ...blur.split(' '), '+level', `${lo}%,${hi}%`, ')',
    '-compose', 'Overlay', '-composite',
  ];
  const sheen = (blur: number, lo: number, hi: number) => [
    '(', '-size', size, 'xc:gray50', '-seed', String(f.seed + 7), '+noise', 'Random', '-colorspace', 'Gray', '-blur', `0x${blur}`, '-auto-level', '+level', `${lo}%,${hi}%`, ')',
    '-compose', 'Overlay', '-composite',
  ];
  const args = ['-size', size, `xc:${f.hex}`];
  switch (f.texture) {
    case 'slub':
      args.push(...noise('-motion-blur 0x18+0', 18, 82, 3), ...noise('-motion-blur 0x3+90', 34, 66, 2));
      break;
    case 'voile':
      args.push(...noise('-motion-blur 0x1+90', 38, 62, 2));
      break;
    case 'plush':
      args.push(...noise('-blur 0x0.5', 44, 56), ...sheen(Math.round(28 * scale) + 6, 30, 70));
      break;
    case 'crushed':
      args.push(...noise('-blur 0x0.5', 44, 56), ...sheen(Math.round(7 * scale) + 2, 10, 90));
      break;
    case 'herringbone':
    case 'basket_weave': {
      const tile = await weaveTile(f.texture === 'herringbone' ? 'herringbone' : 'basket', scale);
      args.push('(', '-size', size, `tile:${tile}`, ')', '-compose', 'Overlay', '-composite', ...noise('-motion-blur 0x4+0', 40, 60));
      break;
    }
    default:
      args.push(...noise('-motion-blur 0x2+0', 36, 64, 2));
  }
  if (f.motif === 'ombre') {
    args.push('(', '-size', size, `gradient:none-${mix(f.hex, '#000000', 0.35)}`, ')', '-compose', 'Over', '-composite');
  } else if (f.motif) {
    const tile = await motifTile(f.motif, f.motifColours[0], f.motifColours[1], scale);
    args.push('(', '-size', size, `tile:${tile}`, ')', '-compose', 'Over', '-composite');
    if (f.texture !== 'jacquard') args.push(...noise('-motion-blur 0x2+0', 44, 56));
  }
  if (f.sheer) args.push('-fill', 'white', '-colorize', '22%');
  return args;
}

const foldCache = new Map<string, Promise<string>>();
function foldMap(w: number, h: number, period: number, lo: number): Promise<string> {
  const key = `${w}x${h}-${period}-${lo}`;
  if (!foldCache.has(key)) {
    const file = tmp(`fold-${key}.png`);
    const fx = `${lo}+${(1 - lo).toFixed(3)}*pow(0.5+0.5*sin(2*pi*i/${period}+0.9*sin(i/${(period * 0.83).toFixed(2)})),0.65)`;
    foldCache.set(
      key,
      magick(['-size', `${w}x1`, 'xc:', '-fx', fx, '-resize', `${w}x${h}!`, '(', '-size', `${w}x${h}`, 'gradient:gray100-gray88', ')', '-compose', 'Multiply', '-composite', file]).then(() => file),
    );
  }
  return foldCache.get(key)!;
}

const FOLD_PERIOD: Record<HeadingStyle, number> = { eyelet: 64, pinch_pleat: 48, pencil_pleat: 26, rod_pocket: 30 };

function headingMvg(h: HeadingStyle, w: number, s: number): string {
  const step = (n: number) => Array.from({ length: Math.floor(w / n) }, (_, i) => Math.round(n / 2 + i * n));
  const y = Math.round(18 * s);
  switch (h) {
    case 'eyelet':
      return step(Math.round(FOLD_PERIOD.eyelet * s)).map((x) => `fill none stroke #5C524A stroke-width ${Math.max(2, Math.round(4 * s))} circle ${x},${y} ${x + Math.round(9 * s)},${y}`).join(' ');
    case 'pinch_pleat':
      return step(Math.round(FOLD_PERIOD.pinch_pleat * s)).map((x) => `stroke #00000055 stroke-width ${Math.max(1, Math.round(2 * s))} line ${x - 4},2 ${x - 2},${Math.round(70 * s)} line ${x},2 ${x},${Math.round(76 * s)} line ${x + 4},2 ${x + 2},${Math.round(70 * s)}`).join(' ');
    case 'pencil_pleat':
      return `fill #00000018 rectangle 0,0 ${w},${Math.round(50 * s)} ` + step(Math.max(4, Math.round(9 * s))).map((x) => `stroke #00000040 stroke-width 1 line ${x},0 ${x},${Math.round(50 * s)}`).join(' ');
    case 'rod_pocket':
      return `fill #00000020 rectangle 0,0 ${w},${Math.round(40 * s)} stroke #00000045 stroke-width ${Math.max(1, Math.round(2 * s))} line 0,${Math.round(40 * s)} ${w},${Math.round(40 * s)}`;
  }
}

/** Render one curtain panel (texture × folds + heading) to a temp PNG. */
async function panel(f: FabricSpec, heading: HeadingStyle, w: number, h: number, s: number, name: string): Promise<string> {
  const file = tmp(`${name}.png`);
  const fold = await foldMap(w, h, Math.round(FOLD_PERIOD[heading] * s * 1.4), f.sheer ? 0.78 : 0.6);
  await magick([
    ...(await textureArgs(f, w, h, s)),
    fold, '-compose', 'Multiply', '-composite', '-compose', 'Over', '-level', '0%,93%',
    '-draw', headingMvg(heading, w, s),
    ...(f.sheer ? ['-alpha', 'set', '-channel', 'A', '-evaluate', 'set', '80%', '+channel'] : []),
    file,
  ]);
  return file;
}

// ── scene builders ──────────────────────────────────────────────────────────
const r = Math.round;

interface SceneOptions {
  W: number;
  H: number;
  wall: [string, string];
  floor: string;
  room: RoomSlug | 'plain';
  fabric: FabricSpec;
  heading: HeadingStyle;
  /** Panels hang only to this fraction of the height (kitchen café curtains). */
  short?: boolean;
  festive?: boolean;
  /** Window centre as a fraction of width. */
  cx?: number;
  windowW?: number;
  /** Second, sheer layer behind the main panels. */
  sheerLayer?: FabricSpec;
}

function furniture(room: SceneOptions['room'], W: number, H: number, accent: string): string {
  const fy = r(H * 0.86);
  const u = W / 1000;
  const p = (n: number) => r(n * u);
  const plant = (x: number) =>
    `fill #8A6F55 roundrectangle ${x - p(34)},${fy - p(110)} ${x + p(34)},${fy} ${p(8)},${p(8)} ` +
    [-70, -35, 0, 35, 70].map((a, i) => leaf(x, fy - p(110), -90 + a, p(70 + (i % 2) * 20), p(16), i % 2 ? '#5E7350' : '#4C6342')).join(' ');
  switch (room) {
    case 'living-room':
      return `fill #00000022 ellipse ${p(500)},${fy + p(40)} ${p(420)},${p(40)} 0,360 fill #CDBDA8 roundrectangle ${p(170)},${fy - p(190)} ${p(830)},${fy - p(30)} ${p(36)},${p(36)} fill #BCAA93 roundrectangle ${p(150)},${fy - p(120)} ${p(850)},${fy} ${p(28)},${p(28)} fill ${accent} roundrectangle ${p(230)},${fy - p(215)} ${p(360)},${fy - p(110)} ${p(20)},${p(20)} fill #EDE3D3 roundrectangle ${p(640)},${fy - p(210)} ${p(770)},${fy - p(110)} ${p(20)},${p(20)} ${plant(p(915))}`;
    case 'bedroom':
    case 'hospitality':
      return `fill ${room === 'hospitality' ? '#5A4636' : '#B79F86'} roundrectangle ${p(220)},${fy - p(330)} ${p(780)},${fy - p(120)} ${p(24)},${p(24)} fill #F3EEE6 roundrectangle ${p(190)},${fy - p(170)} ${p(810)},${fy - p(10)} ${p(18)},${p(18)} fill #FFFFFF roundrectangle ${p(260)},${fy - p(225)} ${p(470)},${fy - p(150)} ${p(24)},${p(24)} roundrectangle ${p(530)},${fy - p(225)} ${p(740)},${fy - p(150)} ${p(24)},${p(24)} fill ${accent} rectangle ${p(190)},${fy - p(110)} ${p(810)},${fy - p(60)} fill #6B5544 rectangle ${p(830)},${fy - p(150)} ${p(930)},${fy} fill #F2D9A6 ellipse ${p(880)},${fy - p(210)} ${p(32)},${p(40)} 0,360`;
    case 'dining-room':
      return `stroke #3B2F27 stroke-width ${p(3)} line ${p(500)},0 ${p(500)},${fy - p(430)} stroke none fill #3B2F27 ellipse ${p(500)},${fy - p(420)} ${p(70)},${p(40)} 180,360 fill #7A5C44 rectangle ${p(230)},${fy - p(180)} ${p(770)},${fy - p(150)} rectangle ${p(260)},${fy - p(150)} ${p(280)},${fy} rectangle ${p(720)},${fy - p(150)} ${p(740)},${fy} fill ${accent} roundrectangle ${p(150)},${fy - p(260)} ${p(220)},${fy - p(90)} ${p(14)},${p(14)} roundrectangle ${p(780)},${fy - p(260)} ${p(850)},${fy - p(90)} ${p(14)},${p(14)} fill #EFE6D8 ellipse ${p(420)},${fy - p(190)} ${p(30)},${p(10)} 0,360 ellipse ${p(580)},${fy - p(190)} ${p(30)},${p(10)} 0,360`;
    case 'home-office':
      return `fill #8A6A4E rectangle ${p(250)},${fy - p(260)} ${p(750)},${fy - p(235)} rectangle ${p(270)},${fy - p(235)} ${p(290)},${fy} rectangle ${p(710)},${fy - p(235)} ${p(730)},${fy} fill #2E2A27 roundrectangle ${p(400)},${fy - p(420)} ${p(600)},${fy - p(290)} ${p(8)},${p(8)} rectangle ${p(490)},${fy - p(290)} ${p(510)},${fy - p(260)} fill ${accent} roundrectangle ${p(430)},${fy - p(200)} ${p(570)},${fy - p(60)} ${p(20)},${p(20)} ${plant(p(120))}`;
    case 'kids-room':
      return `${[0, 1, 2, 3, 4, 5, 6].map((i) => `fill ${['#E3B448', '#8BB0CF', '#D9A5A0', '#9AA88A'][i % 4]} polygon ${p(170 + i * 100)},${p(80)} ${p(230 + i * 100)},${p(80)} ${p(200 + i * 100)},${p(130)}`).join(' ')} fill #F4ECE0 roundrectangle ${p(260)},${fy - p(170)} ${p(740)},${fy - p(20)} ${p(30)},${p(30)} fill ${accent} rectangle ${p(260)},${fy - p(110)} ${p(740)},${fy - p(60)} fill #E3B448 circle ${p(840)},${fy - p(40)} ${p(880)},${fy - p(40)} fill #8BB0CF roundrectangle ${p(100)},${fy - p(80)} ${p(180)},${fy} ${p(10)},${p(10)}`;
    case 'kitchen':
      return `fill #EFE9E0 rectangle 0,${fy - p(300)} ${W},${fy} fill #D6CCBE rectangle 0,${fy - p(320)} ${W},${fy - p(295)} stroke #C9BEB0 stroke-width ${p(3)} line ${p(250)},${fy - p(280)} ${p(250)},${fy} line ${p(500)},${fy - p(280)} ${p(500)},${fy} line ${p(750)},${fy - p(280)} ${p(750)},${fy} stroke none fill ${accent} ellipse ${p(320)},${fy - p(345)} ${p(50)},${p(25)} 180,360 fill #FFFFFF roundrectangle ${p(620)},${fy - p(400)} ${p(690)},${fy - p(320)} ${p(10)},${p(10)}`;
    default:
      return '';
  }
}

async function scene(o: SceneOptions, file: string) {
  const { W, H } = o;
  const s = W / 1000;
  const cx = r(W * (o.cx ?? 0.5));
  const ww = r(W * (o.windowW ?? 0.5));
  const top = r(H * 0.11);
  const rodY = r(H * 0.09);
  const floorY = r(H * 0.86);
  const winTop = r(H * 0.13);
  const winBottom = o.short ? r(H * 0.52) : r(H * 0.8);
  const panelW = r(ww * 0.5);
  const panelH = (o.short ? r(H * 0.5) : floorY + r(H * 0.02)) - top;
  const leftX = cx - r(ww / 2) - r(panelW * 0.55);
  const rightX = cx + r(ww / 2) - r(panelW * 0.45);

  const main = await panel(o.fabric, o.heading, panelW, panelH, s * 0.9, `${path.basename(file)}-p`);
  const layer = o.sheerLayer ? await panel(o.sheerLayer, 'rod_pocket', r(ww * 0.55), panelH, s * 0.9, `${path.basename(file)}-s`) : null;

  const accent = mix(o.fabric.hex, '#B07A4E', 0.35);
  const lights = o.festive
    ? [
        '(', '-size', `${W}x${H}`, 'xc:none', '-fill', '#FFD27A',
        '-draw', Array.from({ length: 28 }, (_, i) => {
          const x = r((W / 27) * i);
          const y = r(H * 0.035 + Math.sin(i * 0.55) * H * 0.018);
          return `circle ${x},${y} ${x + r(5 * s)},${y}`;
        }).join(' ') + ' ' + [0.18, 0.3, 0.7, 0.82].map((fx) => `fill #FF9A2E ellipse ${r(W * fx)},${floorY - r(10 * s)} ${r(18 * s)},${r(8 * s)} 0,360 fill #FFE08A ellipse ${r(W * fx)},${floorY - r(26 * s)} ${r(6 * s)},${r(12 * s)} 0,360`).join(' '),
        '(', '+clone', '-blur', `0x${r(14 * s)}`, ')', '-compose', 'Screen', '-composite', ')',
        '-compose', 'Over', '-composite',
      ]
    : [];

  await magick([
    '-size', `${W}x${H}`, `gradient:${o.wall[0]}-${o.wall[1]}`,
    '(', '-size', `${ww}x${winBottom - winTop}`, o.festive ? 'gradient:#2C3550-#7A5A6A' : 'gradient:#FFFDF8-#D6E2E9', ')', '-geometry', `+${cx - r(ww / 2)}+${winTop}`, '-compose', 'Over', '-composite',
    '-fill', 'none', '-stroke', '#FBF8F3', '-strokewidth', String(r(12 * s)), '-draw', `rectangle ${cx - r(ww / 2)},${winTop} ${cx + r(ww / 2)},${winBottom}`,
    '-strokewidth', String(r(7 * s)), '-draw', `line ${cx},${winTop} ${cx},${winBottom} line ${cx - r(ww / 2)},${r((winTop + winBottom) * 0.45)} ${cx + r(ww / 2)},${r((winTop + winBottom) * 0.45)}`,
    '-stroke', 'none', '(', '-size', `${W}x${H - floorY}`, `gradient:${o.floor}-${mix(o.floor, '#000000', 0.25)}`, '-attenuate', '0.6', '+noise', 'Gaussian', '-motion-blur', '0x30+0', ')', '-geometry', `+0+${floorY}`, '-composite',
    // soft light pool from the window
    '(', '-size', `${W}x${H}`, 'xc:none', '-fill', o.festive ? '#FFB45A30' : '#FFFFFF38', '-draw', `polygon ${cx - r(ww / 2)},${winBottom} ${cx + r(ww / 2)},${winBottom} ${cx + r(ww * 0.9)},${H} ${cx - r(ww * 0.9)},${H}`, '-blur', `0x${r(30 * s)}`, ')', '-composite',
    ...(layer ? [layer, '-geometry', `+${cx - r(ww * 0.275)}+${top}`, '-composite'] : []),
    // panel shadows
    '(', '-size', `${W}x${H}`, 'xc:none', '-fill', '#00000038', '-draw', `rectangle ${leftX + r(14 * s)},${top + r(10 * s)} ${leftX + panelW + r(14 * s)},${top + panelH} rectangle ${rightX + r(14 * s)},${top + r(10 * s)} ${rightX + panelW + r(14 * s)},${top + panelH}`, '-blur', `0x${r(16 * s)}`, ')', '-composite',
    main, '-geometry', `+${leftX}+${top}`, '-composite',
    main, '-geometry', `+${rightX}+${top}`, '-composite',
    '-fill', '#3B2F27', '-draw', `rectangle ${leftX - r(30 * s)},${rodY} ${rightX + panelW + r(30 * s)},${rodY + r(9 * s)} circle ${leftX - r(30 * s)},${rodY + r(4 * s)} ${leftX - r(18 * s)},${rodY + r(4 * s)} circle ${rightX + panelW + r(30 * s)},${rodY + r(4 * s)} ${rightX + panelW + r(42 * s)},${rodY + r(4 * s)}`,
    '-draw', furniture(o.room, W, H, accent),
    ...lights,
    ...(o.festive ? ['-fill', '#FF9A3C', '-colorize', '7%'] : ['-fill', '#FFF4E2', '-colorize', '4%']),
    '-quality', QUALITY, file,
  ]);
}

async function swatch(f: FabricSpec, file: string, size = 800) {
  await magick([
    ...(await textureArgs(f, size, size, 1.3)),
    ...(f.sheer ? ['(', '-size', `${size}x${size}`, 'xc:#F4F1EC', ')', '+swap', '-compose', 'Over', '-composite'] : []),
    '(', '-size', `${size}x${size}`, 'radial-gradient:white-gray78', ')', '-compose', 'Multiply', '-composite',
    '-quality', QUALITY, file,
  ]);
}

// ── room & wall palettes ────────────────────────────────────────────────────
const WALLS: Record<RoomSlug, { wall: [string, string]; floor: string }> = {
  'living-room': { wall: ['#F4EEE6', '#E4D9CB'], floor: '#B39674' },
  bedroom: { wall: ['#EFE9E2', '#DCD2C6'], floor: '#A88C70' },
  'dining-room': { wall: ['#EDE6DB', '#D8CBB9'], floor: '#8F6F52' },
  'home-office': { wall: ['#F1EFEA', '#DEDAD2'], floor: '#B7A086' },
  'kids-room': { wall: ['#F5F0E6', '#E7DECD'], floor: '#C2A584' },
  kitchen: { wall: ['#F6F3EE', '#E6E0D6'], floor: '#BFB2A1' },
  hospitality: { wall: ['#E7DED3', '#CDBFAE'], floor: '#7D604A' },
};

const fakeVariant = (id: string, hex: string, texture: Texture, opacity: FabricVariant['opacity'] = 'light_filtering', product = 'x', name = ''): FabricVariant => ({
  id, product_id: product, variant_sku: id, name, material: 'linen', color: 'beige', color_hex: hex, pattern: 'solid', texture, opacity,
  fabric_roll_width_cm: 140, pattern_repeat_cm: null, railroadable: false, price_per_meter: null, price_adjustment_pct: 0,
  stock_status: 'in_stock', images: [], status: 'active',
});

// ── jobs ─────────────────────────────────────────────────────────────────────
type Job = { rel: string; run: () => Promise<void> };
const jobs: Job[] = [];
const add = (rel: string, run: (file: string) => Promise<void>) => jobs.push({ rel, run: () => run(out(rel)) });

fabricVariants.forEach((v, i) => {
  const product = productById.get(v.product_id)!;
  const sku = v.variant_sku.toLowerCase();
  const f = specFor(v, 100 + i);
  const heading = product.heading_options[0] ?? 'eyelet';
  const room = product.rooms[0] ?? 'living-room';
  const kitchen = room === 'kitchen';
  add(`curtains/${sku}.webp`, (file) => scene({ W: 1000, H: 1250, wall: ['#F5F0E9', '#E9E0D4'], floor: '#BFA586', room: 'plain', fabric: f, heading, short: kitchen, windowW: 0.48 }, file));
  add(`curtains/${sku}-room.webp`, (file) => scene({ W: 1000, H: 1250, ...WALLS[room], room, fabric: f, heading, short: kitchen, windowW: 0.56 }, file));
  add(`fabrics/${sku}.webp`, (file) => swatch(f, file));
});

const linen = specFor(fakeVariant('linen', '#D8C3A5', 'slub', 'sheer'), 1);
const velvet = specFor(fakeVariant('velvet', '#5E6B45', 'plush'), 2);
const navyBlackout = specFor(fakeVariant('navy', '#1F2A44', 'smooth', 'blackout'), 3);
const sheerWhite = specFor(fakeVariant('sheer', '#F7F5F0', 'voile', 'sheer'), 4);

add('banners/hero-static.webp', (file) => scene({ W: 1920, H: 1080, ...WALLS['living-room'], room: 'living-room', fabric: linen, heading: 'eyelet', cx: 0.62, windowW: 0.36, sheerLayer: sheerWhite }, file));
add('banners/diwali-1.webp', (file) => scene({ W: 1920, H: 1080, wall: ['#E9DCCB', '#C9B49C'], floor: '#7D604A', room: 'living-room', fabric: velvet, heading: 'pinch_pleat', cx: 0.64, windowW: 0.34, festive: true }, file));
add('banners/diwali-2.webp', (file) => scene({ W: 1920, H: 1080, ...WALLS['living-room'], room: 'living-room', fabric: { ...linen, sheer: true }, heading: 'rod_pocket', cx: 0.36, windowW: 0.36, festive: true }, file));
add('banners/diwali-3.webp', (file) => scene({ W: 1920, H: 1080, ...WALLS.bedroom, room: 'bedroom', fabric: navyBlackout, heading: 'pinch_pleat', cx: 0.5, windowW: 0.36, festive: true }, file));

const roomFabric: Record<RoomSlug, [string, Texture, HeadingStyle, FabricVariant['opacity']]> = {
  'living-room': ['#D8C3A5', 'slub', 'eyelet', 'light_filtering'],
  bedroom: ['#3A3734', 'smooth', 'pinch_pleat', 'blackout'],
  'dining-room': ['#5E6B45', 'plush', 'pinch_pleat', 'room_darkening'],
  'home-office': ['#D9CBB3', 'basket_weave', 'eyelet', 'light_filtering'],
  'kids-room': ['#8BB0CF', 'smooth', 'eyelet', 'room_darkening'],
  kitchen: ['#6E7B4F', 'smooth', 'rod_pocket', 'light_filtering'],
  hospitality: ['#8C7B6B', 'smooth', 'pinch_pleat', 'blackout'],
};
(Object.keys(roomFabric) as RoomSlug[]).forEach((room, i) => {
  const [hex, tex, heading, op] = roomFabric[room];
  const fv = fakeVariant(`room-${room}`, hex, tex, op, room === 'kids-room' ? 'p-012' : room === 'kitchen' ? 'p-014' : 'x');
  add(`rooms/${room}.webp`, (file) => scene({ W: 1000, H: 1250, ...WALLS[room], room, fabric: specFor(fv, 20 + i), heading, short: room === 'kitchen', windowW: 0.56 }, file));
});

const projects: [RoomSlug, string, Texture, HeadingStyle, FabricVariant['opacity'], string][] = [
  ['living-room', '#D8C3A5', 'slub', 'eyelet', 'sheer', 'x'],
  ['bedroom', '#1F2A44', 'smooth', 'pinch_pleat', 'blackout', 'x'],
  ['dining-room', '#5E6B45', 'plush', 'pinch_pleat', 'room_darkening', 'x'],
  ['kids-room', '#D9A5A0', 'smooth', 'eyelet', 'room_darkening', 'p-012'],
  ['home-office', '#D9CBB3', 'basket_weave', 'pencil_pleat', 'light_filtering', 'x'],
  ['hospitality', '#4A4846', 'slub', 'pinch_pleat', 'blackout', 'x'],
];
projects.forEach(([room, hex, tex, heading, op, pid], i) =>
  add(`rooms/project-${i + 1}.webp`, (file) =>
    scene({ W: 1200, H: 900, ...WALLS[room], room, fabric: specFor(fakeVariant(`proj-${i}`, hex, tex, op, pid), 40 + i), heading, windowW: 0.5 }, file)),
);

// Fabric families
const families: [string, string, Texture, string, FabricVariant['opacity']][] = [
  ['linen', '#D8C3A5', 'slub', 'x', 'light_filtering'],
  ['cotton', '#E9DCC6', 'smooth', 'p-004', 'light_filtering'],
  ['velvet', '#5E6B45', 'plush', 'x', 'room_darkening'],
  ['sheer', '#F7F5F0', 'voile', 'x', 'sheer'],
  ['jacquard', '#B8A27C', 'jacquard', 'p-008', 'room_darkening'],
  ['polyester', '#3A3734', 'smooth', 'x', 'blackout'],
];
families.forEach(([id, hex, tex, pid, op], i) =>
  add(`fabrics/family-${id}.webp`, (file) => swatch(specFor(fakeVariant(`fam-${id}`, hex, tex, op, pid, id === 'jacquard' ? 'Antique Gold' : ''), 60 + i), file)),
);

// Heading & lining details
const detailFabric = specFor(fakeVariant('detail', '#CDBFA8', 'slub'), 70);
(['eyelet', 'pinch_pleat', 'rod_pocket', 'pencil_pleat'] as HeadingStyle[]).forEach((h) =>
  add(`details/heading-${h.replace('_', '-')}.webp`, async (file) => {
    const p = await panel(detailFabric, h, 800, 760, 3, `detail-${h}`);
    await magick(['-size', '800x800', 'gradient:#F3EDE5-#E2D8CB', ...(h === 'eyelet' || h === 'rod_pocket' ? ['-fill', '#3B2F27', '-draw', 'rectangle 0,38 800,64'] : ['-fill', '#B5ADA2', '-draw', 'rectangle 0,20 800,34']), p, '-geometry', '+0+40', '-compose', 'Over', '-composite', ...(h === 'eyelet' ? ['-fill', '#3B2F27', '-draw', 'rectangle 0,38 800,64'] : []), '-quality', QUALITY, file]);
  }),
);
add('details/lining.webp', async (file) => {
  const front = await panel(specFor(fakeVariant('lin-front', '#5E6B45', 'plush'), 80), 'pinch_pleat', 800, 800, 3, 'lining-front');
  await magick([front, '-fill', '#EFE7DA', '-draw', 'polygon 380,800 800,380 800,800', '-fill', '#00000030', '-draw', 'polygon 370,800 800,370 800,384 384,800', '-stroke', '#9C8E80', '-strokewidth', '3', '-draw', "stroke-dasharray 14 10 line 470,800 800,470", '-quality', QUALITY, file]);
});

// Showroom
add('showroom/showroom-1.webp', async (file) => {
  const colours = ['#D8C3A5', '#5E6B45', '#1F2A44', '#EFE6D2', '#9A4A2A', '#B8A27C', '#3A3734', '#C99A93', '#2B5B5E', '#D9CBB3', '#7A1F2B', '#A5A29C', '#6E7B4F', '#E3B448', '#8C7B6B', '#F7F5F0', '#C8B79A', '#5A4033'];
  const rows = [80, 330, 580];
  const rolls = rows.flatMap((y, ri) => colours.map((_, i) => `fill ${colours[(i + ri * 5) % colours.length]} roundrectangle ${30 + i * 64},${y} ${84 + i * 64},${y + 210} 10,10`)).join(' ');
  const shade = tmp('roll-shade.png');
  await magick(['-size', '64x1', 'xc:', '-fx', 'i<54 ? 0.62+0.38*sin(pi*i/54) : 1', '-resize', '64x900!', shade]);
  await magick(['-size', '1200x900', 'gradient:#EFE7DB-#D9CDBC', '-draw', rolls, '(', '-size', '1200x900', `tile:${shade}`, '-roll', '+30+0', ')', '-compose', 'Multiply', '-composite', '-compose', 'Over', '-fill', '#8A6F55', '-draw', 'rectangle 0,292 1200,306 rectangle 0,542 1200,556 rectangle 0,792 1200,806', '-fill', '#FFF4E2', '-colorize', '5%', '-quality', QUALITY, file]);
});
add('showroom/showroom-2.webp', async (file) => {
  const hang: [string, Texture, HeadingStyle, FabricVariant['opacity']][] = [
    ['#EFE6D2', 'voile', 'rod_pocket', 'sheer'], ['#D8C3A5', 'slub', 'eyelet', 'light_filtering'], ['#5E6B45', 'plush', 'pinch_pleat', 'room_darkening'],
    ['#1F2A44', 'smooth', 'pinch_pleat', 'blackout'], ['#B8A27C', 'jacquard', 'pencil_pleat', 'room_darkening'], ['#9A4A2A', 'slub', 'eyelet', 'light_filtering'],
  ];
  const panels = await Promise.all(hang.map(([hex, tex, h, op], i) => panel(specFor(fakeVariant(`sr-${i}`, hex, tex, op, i === 4 ? 'p-008' : 'x'), 90 + i), h, 170, 700, 1, `sr-${i}`)));
  await magick(['-size', '1200x900', 'gradient:#F2ECE3-#DCD0C0', '-fill', '#A88C70', '-draw', 'rectangle 0,800 1200,900', '-fill', '#3B2F27', '-draw', 'rectangle 20,70 1180,80', ...panels.flatMap((p, i) => [p, '-geometry', `+${40 + i * 190}+80`, '-composite']), '-fill', '#FFF4E2', '-colorize', '4%', '-quality', QUALITY, file]);
});
add('showroom/showroom-3.webp', async (file) => {
  const sw = ['#D8C3A5', '#5E6B45', '#C99A93', '#1F2A44', '#EFE6D2', '#B8A27C', '#9A4A2A', '#A9BFBF'];
  const squares = sw.map((c, i) => `push graphic-context translate ${200 + (i % 4) * 220},${260 + Math.floor(i / 4) * 300} rotate ${(i % 3) * 4 - 4} fill #00000030 rectangle -82,-72 98,108 fill ${c} rectangle -90,-90 90,90 pop graphic-context`).join(' ');
  await magick(['-size', '1200x900', 'xc:#9C7B5C', '-attenuate', '0.8', '+noise', 'Gaussian', '-motion-blur', '0x40+0', '-draw', squares, '-fill', '#E8C547', '-draw', 'roundrectangle 60,760 1140,820 8,8', '-stroke', '#3B2F27', '-strokewidth', '2', '-draw', Array.from({ length: 54 }, (_, i) => `line ${80 + i * 20},760 ${80 + i * 20},${i % 5 === 0 ? 790 : 776}`).join(' '), '-quality', QUALITY, file]);
});
add('showroom/showroom-4.webp', (file) => scene({ W: 1200, H: 900, wall: ['#EFE8DE', '#D8CCBD'], floor: '#8F6F52', room: 'plain', fabric: velvet, heading: 'pinch_pleat', windowW: 0.42, sheerLayer: sheerWhite }, file));

// ── run ──────────────────────────────────────────────────────────────────────
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const todo = jobs.filter((j) => (only ? j.rel.includes(only) : !skip(j.rel)));
console.log(`Rendering ${todo.length} of ${jobs.length} images into ${ROOT}${FORCE ? ' (forced)' : ''}`);
const started = Date.now();
const failures: string[] = [];
await pool(todo, 8, async (job) => {
  try {
    await job.run();
  } catch (e) {
    failures.push(`${job.rel}: ${(e as Error).message.split('\n')[0]}`);
  }
});
rmSync(TMP, { recursive: true, force: true });
console.log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.error(`${failures.length} failed:\n${failures.slice(0, 20).join('\n')}`);
  process.exit(1);
}
