import { describe, expect, it } from "vitest";
import { borrowProfile } from "./builders/subtraction";
import { countCarries } from "./builders/addition";
import { gcd, lcm, primeFactors } from "./numbers";
import { LIST_KINDS, makeSession, stepMatches } from "./index";
import type { Activity, Question } from "./types";

const LEVELS: Record<Activity, number> = {
  addition: 4,
  subtraction: 4,
  multiplication: 4,
  division: 4,
  "factor-tree": 4,
  prime: 3,
  gcd: 3,
  lcm: 3,
};
const ACTIVITIES = Object.keys(LEVELS) as Activity[];

/** Kumpulkan banyak soal acak untuk satu topik dan level. */
const questions = (activity: Activity, level: number, sessions = 40) =>
  Array.from({ length: sessions }, () =>
    makeSession(activity, level, 10)
  ).flat();

const stepsOf = (q: Question, kind: string) =>
  q.steps.filter(s => s.kind === kind);
const num = (value: string) => Number(value);
const forEachLevel = (
  activity: Activity,
  check: (level: number, list: Question[]) => void
) => {
  for (let level = 1; level <= LEVELS[activity]; level += 1)
    check(level, questions(activity, level));
};

describe("semua soal", () => {
  for (const activity of ACTIVITIES) {
    it(`${activity}: teks lengkap, jawaban cocok dirinya sendiri, id unik per sesi`, () => {
      for (let level = 1; level <= LEVELS[activity]; level += 1) {
        for (let i = 0; i < 40; i += 1) {
          const session = makeSession(activity, level, 10);
          expect(new Set(session.map(q => q.id)).size).toBe(session.length);
          for (const q of session) {
            expect(q.steps.length).toBeGreaterThan(0);
            for (const step of q.steps) {
              expect(`${step.prompt}${step.hint}${step.coach}`).not.toMatch(
                /undefined|NaN|\[object/
              );
              expect(step.prompt.length).toBeGreaterThan(0);
              expect(stepMatches(step, step.expected)).toBe(true);
              if (step.choices)
                expect(step.choices.some(c => c.value === step.expected)).toBe(
                  true
                );
            }
          }
        }
      }
    });
  }
});

describe("penjumlahan", () => {
  it("angka yang ditulis tiap kolom membentuk hasil yang benar", () => {
    forEachLevel("addition", (_, list) => {
      for (const q of list) {
        // angka tiap kolom: langkah tulis (jumlah >= 10) atau langsung dari jumlah kolom (0-9)
        const writes = stepsOf(q, "add-column")
          .map(col => {
            const write = q.steps.find(
              s => s.kind === "add-write" && s.meta!.position === col.meta!.position
            );
            return write ? write.expected : col.expected;
          })
          .reverse()
          .join("");
        const leftCarry = stepsOf(q, "add-carry").find(
          s => s.meta!.position === 0
        );
        expect(num(`${leftCarry?.expected ?? ""}${writes}`)).toBe(q.a! + q.b!);
      }
    });
  });
  it("kurva kesulitan: L1 tanpa simpanan, L2 satu, L3 satu-dua, L4 dua atau lebih", () => {
    const range: Record<number, [number, number]> = {
      1: [0, 0],
      2: [1, 1],
      3: [1, 2],
      4: [2, 9],
    };
    forEachLevel("addition", (level, list) => {
      for (const q of list) {
        const c = countCarries(q.a!, q.b!);
        expect(c).toBeGreaterThanOrEqual(range[level][0]);
        expect(c).toBeLessThanOrEqual(range[level][1]);
        expect(q.a).not.toBe(q.b);
      }
    });
  });
});

describe("pengurangan", () => {
  it("hasil tiap kolom 0-9 dan membentuk selisih yang benar", () => {
    forEachLevel("subtraction", (_, list) => {
      for (const q of list) {
        const cols = stepsOf(q, "subtract-column").map(s => num(s.expected));
        cols.forEach(c => {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(9);
        });
        // langkah berurutan dari satuan ke kiri, jadi dibalik untuk dibaca
        expect(num([...cols].reverse().join(""))).toBe(q.a! - q.b!);
      }
    });
  });
  it("kurva kesulitan: pinjam 0 / 1 / 1+ / 2+ dan ada soal rantai nol di L3-L4", () => {
    forEachLevel("subtraction", (level, list) => {
      let chains = 0;
      for (const q of list) {
        const { count, chain } = borrowProfile(q.a!, q.b!);
        if (level === 1) expect(count).toBe(0);
        if (level === 2) expect(count).toBe(1);
        if (level === 3) expect(count).toBeGreaterThanOrEqual(1);
        if (level === 4) expect(count).toBeGreaterThanOrEqual(2);
        if (chain) chains += 1;
      }
      if (level >= 3) expect(chains).toBeGreaterThan(list.length * 0.1);
      else expect(chains).toBe(0);
    });
  });
});

describe("perkalian", () => {
  it('jumlah baris parsial = hasil kali, tanpa langkah "hasil akhir" ganda', () => {
    forEachLevel("multiplication", (_, list) => {
      for (const q of list) {
        const partials = stepsOf(q, "partial").map(s => num(s.expected));
        expect(partials.reduce((x, y) => x + y, 0)).toBe(q.a! * q.b!);
        expect(stepsOf(q, "final").length).toBe(0);
        expect(num(q.steps.at(-1)!.expected)).toBe(q.a! * q.b!);
        // tidak ada dua langkah berurutan yang menanyakan angka yang sama
        q.steps.slice(1).forEach((s, i) => {
          if (["partial", "partial-sum"].includes(s.kind))
            expect(
              s.expected === q.steps[i].expected &&
                q.steps[i].kind !== "multiply-carry-final"
            ).toBe(false);
        });
      }
    });
  });
  it("baris ke-2 dimulai dengan menulis 0, dan hasil barisnya berakhir 0", () => {
    forEachLevel("multiplication", (_, list) => {
      for (const q of list.filter(x => x.b! >= 10)) {
        const zero = stepsOf(q, "place-zero");
        expect(zero.length).toBe(1);
        expect(zero[0].expected).toBe("0");
        expect(stepsOf(q, "place-value").length).toBe(0);
        const second = stepsOf(q, "partial")[1];
        expect(second.expected.endsWith("0")).toBe(true);
        expect(num(second.expected)).toBe(q.a! * Math.floor(q.b! / 10) * 10);
        // 0 ditulis tepat sebelum kolom pertama baris itu
        expect(q.steps[q.steps.indexOf(zero[0]) + 1].kind).toBe(
          "multiply-column"
        );
      }
    });
  });
  it("pengali tidak memuat 0; angka 0 pada soal hanya di L2 dan L4", () => {
    forEachLevel("multiplication", (level, list) => {
      let withZero = 0;
      for (const q of list) {
        expect(String(q.b)).not.toMatch(/0/);
        if (String(q.a).includes("0")) withZero += 1;
      }
      if (level === 2 || level === 4) expect(withZero).toBeGreaterThan(0);
      else expect(withZero).toBe(0);
    });
  });
});

describe("pohon faktor: prima apa pun yang valid diterima", () => {
  it("semua prima pembagi diterima, yang bukan pembagi ditolak, dan pohon tetap konsisten", () => {
    forEachLevel("factor-tree", (_, list) => {
      for (const q of list) {
        q.steps
          .filter(s => s.kind === "tree-factor")
          .forEach((s, idx) => {
            const current = s.meta!.current as number;
            const dividing = [2, 3, 5, 7, 11, 13].filter(p => current % p === 0);
            for (const p of [2, 3, 5, 7, 11, 13])
              expect(stepMatches(s, String(p))).toBe(dividing.includes(p));
            for (const p of dividing.filter(x => x !== Number(s.expected))) {
              const at = q.steps.indexOf(s);
              const steps = [
                ...q.steps.slice(0, at),
                ...q.branch!(s, String(p))!,
              ];
              const picked = steps
                .filter(x => x.kind === "tree-factor")
                .map(x => num(x.expected));
              const lastQuotient = num(
                steps.filter(x => x.kind === "tree-quotient").at(-1)!.expected
              );
              expect(picked.reduce((x, y) => x * y, 1) * lastQuotient).toBe(
                q.number
              );
              expect(steps.at(-1)!.kind).toBe("tree-final");
              expect(stepMatches(steps.at(-1)!, steps.at(-1)!.expected)).toBe(
                true
              );
            }
            expect(idx).toBeGreaterThanOrEqual(0);
          });
      }
    });
  });
});

describe("pohon faktor: prima 11 dan 13", () => {
  it("L1-L2 hanya prima <= 7; L3-L4 kadang memuat 11/13 dan semua faktor <= 13", () => {
    let big = 0;
    forEachLevel("factor-tree", (level, list) => {
      for (const q of list) {
        const f = primeFactors(q.number!);
        expect(f.every(x => x <= (level >= 3 ? 13 : 7))).toBe(true);
        if (f.some(x => x === 11 || x === 13)) big += 1;
        expect(q.steps.at(-1)!.kind).toBe("tree-final");
      }
    });
    expect(big).toBeGreaterThan(0);
  });
});

describe("pembagian", () => {
  it("angka hasil bagi dan sisa benar", () => {
    forEachLevel("division", (_, list) => {
      for (const q of list) {
        const digits = stepsOf(q, "divide")
          .map(s => s.expected)
          .join("");
        expect(num(digits)).toBe(Math.floor(q.a! / q.b!));
        const remainder = stepsOf(q, "remainder-final");
        if (q.a! % q.b! === 0) expect(remainder.length).toBe(0);
        else expect(num(remainder[0].expected)).toBe(q.a! % q.b!);
      }
    });
  });
  it("L1-L2 selalu habis dibagi; L3-L4 campuran", () => {
    forEachLevel("division", (level, list) => {
      const exact = list.filter(q => q.a! % q.b! === 0).length;
      if (level <= 2) expect(exact).toBe(list.length);
      else {
        expect(exact).toBeGreaterThan(0);
        expect(exact).toBeLessThan(list.length * 0.6);
      }
    });
  });
});

describe("pohon faktor, prima, FPB, KPK", () => {
  it("daun pohon faktor dikalikan = bilangan awal", () => {
    forEachLevel("factor-tree", (_, list) => {
      for (const q of list) {
        const leaves = q.steps.at(-1)!.expected.split(", ").map(Number);
        expect(leaves.reduce((x, y) => x * y, 1)).toBe(q.number);
        expect(leaves).toEqual(primeFactors(q.number!));
      }
    });
  });
  it("FPB benar dan variasi kasus khusus muncul", () => {
    let coprime = 0;
    let multiple = 0;
    forEachLevel("gcd", (_, list) => {
      for (const q of list) {
        expect(num(q.steps.at(-1)!.expected)).toBe(gcd(q.number!, q.other!));
        if (gcd(q.number!, q.other!) === 1) coprime += 1;
        if (q.other! % q.number! === 0) multiple += 1;
      }
    });
    expect(coprime).toBeGreaterThan(0);
    expect(multiple).toBeGreaterThan(0);
  });
  it("KPK benar dan muncul di kedua daftar kelipatan", () => {
    forEachLevel("lcm", (_, list) => {
      for (const q of list) {
        const answer = num(q.steps.at(-1)!.expected);
        expect(answer).toBe(lcm(q.number!, q.other!));
        for (const s of q.steps.slice(0, 2))
          expect(s.expected.split(", ").map(Number)).toContain(answer);
        expect(q.steps[0].expected.split(", ").length).toBeLessThanOrEqual(9);
      }
    });
  });
  it("ruang soal cukup untuk 10 soal berbeda per sesi", () => {
    for (const activity of ACTIVITIES) {
      for (let level = 1; level <= LEVELS[activity]; level += 1) {
        const ids = new Set<string>();
        for (let i = 0; i < 200; i += 1)
          questions(activity, level, 1).forEach(q => ids.add(q.id));
        expect(ids.size).toBeGreaterThanOrEqual(10);
      }
    }
  });
});

describe("pemeriksaan jawaban", () => {
  const make = (kind: string, expected: string) => ({
    id: "x",
    kind,
    prompt: "",
    expected,
    hint: "",
    coach: "",
  });
  it("angka: nol di depan boleh, spasi di tengah tidak", () => {
    expect(stepMatches(make("divide", "7"), "07")).toBe(true);
    expect(stepMatches(make("divide", "12"), " 12 ")).toBe(true);
    expect(stepMatches(make("divide", "12"), "1 2")).toBe(false);
  });
  it("daftar: urutan bebas, pemisah koma/spasi/×, jumlah harus pas", () => {
    expect(LIST_KINDS).toContain("tree-final");
    expect(stepMatches(make("tree-final", "2, 2, 3"), "3 x 2 × 2")).toBe(true);
    expect(stepMatches(make("set-a", "1, 2, 4"), "1,2,2,4")).toBe(false);
    expect(stepMatches(make("set-a", "1, 2, 4"), "1, 2, a")).toBe(false);
  });
  it("ya/tidak tidak peduli huruf besar", () => {
    expect(stepMatches(make("prime-check", "ya"), " YA ")).toBe(true);
  });
});
