import React, { useMemo, useEffect, useState, useRef } from "react";

/**
 * TileBackground
 * A grid of square, non-rotated tiles in black/gray tones, each tile
 * assigned a random "elevation" so the grid reads as a stepped, 3D
 * height-map (like different floor panels at different levels).
 * Thin streaks of purple/orange light drift upward along a sparse,
 * random subset of the vertical ridges between tiles.
 */

const TILE = 64;   // px, square tile size
const GAP = 4;      // px, ridge width between tiles
const ANIMATION_DURATION = 6; // seconds, time for lines to travel across the screen
const lightest_shade = "#2c2b2b";
const darkest_shade = "#0e0d0d";

export default function TileBackground() {
    const tiles = useMemo(() => createTiles(), []);
    const [streakBatches, setStreakBatches] = useState(() => [
        { id: 0, streaks: createMinimalStreaks(tiles) },
    ]);
    const nextId = useRef(1);
    
    useEffect(() => {
        const interval = setInterval(() => {
        const batchId = nextId.current++;
    
        setStreakBatches((prev) => [
            ...prev,
            { id: batchId, streaks: createMinimalStreaks(tiles) },
        ]);
    
        // this batch's div instances play once (ANIMATION_DURATION long, see
        // animation-iteration-count: 1 below) - drop it from state right as
        // it finishes so the DOM doesn't accumulate finished streaks
        setTimeout(() => {
            setStreakBatches((prev) => prev.filter((b) => b.id !== batchId));
        }, ANIMATION_DURATION * 1000);
        }, (ANIMATION_DURATION / 2) * 1000);
    
        return () => clearInterval(interval);
    }, [tiles]);

  function createTiles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // +3 so the grid overflows the viewport a bit and there's no gap at the edges
    const columns = Math.ceil(width / (TILE + GAP)) + 3;
    const rows = Math.ceil(height / (TILE + GAP)) + 3;

    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        arr.push({
          id: `${r}-${c}`,
          row: r,
          col: c,
          color: randomShade(lightest_shade, darkest_shade),
        });
      }
    }
    return { arr, columns, rows };
  }

  // Used on title page. Two horizontal, two vertical streaks at one time
  function createMinimalStreaks({ columns, rows }) {
    let colors = [];
    for (let i=0; i<4; i++){
        const zeroCount = colors.filter((c) => c === 0).length;
        const oneCount = colors.filter((c) => c === 1).length;
        if (zeroCount === 2) {
            colors.push(1);
        } else if (oneCount === 2) {
            colors.push(0);
        } else {
            colors.push((Math.floor(Math.random() * 2)));
        }
    }

    // The grid extends 3 tiles beyond in each direction
    const visible_columns = columns - 3;
    const visible_rows = rows - 3;

    const column_1 = (1 + Math.floor(Math.random() * (visible_columns/2))) * (TILE + GAP) - GAP;
    const column_2 = ((visible_columns - 1) - (Math.floor(Math.random() * (visible_columns/2)))) * (TILE + GAP) - GAP;
    const row_1 = (1 + Math.floor(Math.random() * (visible_rows/2))) * (TILE + GAP) - GAP;
    const row_2 = ((visible_rows - 1) - (Math.floor(Math.random() * (visible_rows/2)))) * (TILE + GAP) - GAP;
    const off_screen_buffer = TILE*3; // So that the line fully dissapears
    const vert_streak_1 = {
        x: column_1,
        end_x: column_1,
        y: -off_screen_buffer,
        end_y: window.innerHeight + off_screen_buffer,
        color: colors[0],
        orientation: 'vertical'
    }
    const vert_streak_2 = {
        x: column_2,
        end_x: column_2,
        y: window.innerHeight + off_screen_buffer,
        end_y: 0 - off_screen_buffer,
        color: colors[1],
        orientation: 'vertical'
    }
    const horiz_streak_1 = {
        x: -off_screen_buffer,
        end_x: window.innerWidth + off_screen_buffer,
        y: row_1,
        end_y: row_1,
        color: colors[2],
        orientation: 'horizontal'
    }
    const horiz_streak_2 = {
        x: window.innerWidth + off_screen_buffer,
        end_x: 0 - off_screen_buffer,
        y: row_2,
        end_y: row_2,
        color: colors[3],
        orientation: 'horizontal'
    }
    return [vert_streak_1, vert_streak_2, horiz_streak_1, horiz_streak_2];
  }

  /* HELPER FUNCTIONS */
  function hexToRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255,
    };
  }

  function rgbToHex({ r, g, b }) {
    const toHex = (v) => Math.round(v).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function randomShade(lightest, darkest) {
    const light = hexToRgb(lightest);
    const dark = hexToRgb(darkest);
    const t = Math.random(); // 0 = darkest, 1 = lightest

    return rgbToHex({
      r: dark.r + (light.r - dark.r) * t,
      g: dark.g + (light.g - dark.g) * t,
      b: dark.b + (light.b - dark.b) * t,
    });
  }

  return (
    <div className="tbg-wrapper">
      <style>{`
        .tbg-wrapper {
          position: absolute;
          z-index: -1000;
          width: 100%;
          height: 100vh;
          background: #050505;
          overflow: hidden;
        }

        .tbg-grid {
          display: grid;
          grid-template-columns: repeat(${tiles.columns}, ${TILE}px);
          grid-template-rows: repeat(${tiles.rows}, ${TILE}px);
          gap: ${GAP}px;
        }

        .tbg-tile {
          width: ${TILE}px;
          height: ${TILE}px;
          border-radius: 2px;
        }

        .tbg-streak {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 999px;
          pointer-events: none;
          transform: translate(var(--start-x), var(--start-y));
            animation-name: tbg-move;
            animation-timing-function: linear;
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
        }

        @keyframes tbg-move {
            from { transform: translate(var(--start-x), var(--start-y)); }
            to   { transform: translate(var(--end-x), var(--end-y)); }
        }

        .tbg-streak.vertical {
            width: 3px;
            height: ${Math.round(TILE * 1.6)}px;
        }

        .tbg-streak.horizontal {
            height: 3px;
            width: ${Math.round(TILE * 1.6)}px;
        }
 
        .tbg-streak.vertical.purple {
          background: linear-gradient(to top, transparent, rgba(168,85,247,0.9), transparent);
        }
 
        .tbg-streak.vertical.orange {
          background: linear-gradient(to top, transparent, rgba(251,146,60,0.9), transparent);
        }

        .tbg-streak.horizontal.purple {
          background: linear-gradient(to right, transparent, rgba(168,85,247,0.9), transparent);
        }
 
        .tbg-streak.horizontal.orange {
          background: linear-gradient(to right, transparent, rgba(251,146,60,0.9), transparent);
        }
      `}</style>

      <div className="tbg-grid">
        {tiles.arr.map((t) => (
          <div
            key={t.id}
            className="tbg-tile"
            style={{ background: t.color }}
          />
        ))}
      </div>

      {streakBatches.flatMap((batch) =>
        batch.streaks.map((streak, i) => (
          <div
            key={`streak-${batch.id}-${i}`}
            className={`tbg-streak ${streak.color === 0 ? "orange" : "purple"} ${streak.orientation === "vertical" ? "vertical" : "horizontal"}`}
            style={{
              "--start-x": `${streak.x}px`,
              "--start-y": `${streak.y}px`,
              "--end-x": `${streak.end_x}px`,
              "--end-y": `${streak.end_y}px`,
              animationDuration: `${ANIMATION_DURATION}s`,
            }}
          />
        ))
      )}

      
    </div>
  );
}