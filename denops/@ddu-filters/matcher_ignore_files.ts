import { type DduItem } from "jsr:@shougo/ddu-vim@~6.1.0/types";
import { BaseFilter } from "jsr:@shougo/ddu-vim@~6.1.0/filter";

import { type ActionData } from "jsr:@shougo/ddu-kind-file@~0.9.0";

import type { Denops } from "jsr:@denops/core@~7.0.0";

import { globToRegExp } from "jsr:@std/path@~1.0.3/glob-to-regexp";

type Params = {
  ignoreGlobs: string[];
  ignorePatterns: string[];
};

export class Filter extends BaseFilter<Params> {
  override filter(args: {
    denops: Denops;
    filterParams: Params;
    items: DduItem[];
  }): Promise<DduItem[]> {
    const ignoreGlobs = args.filterParams.ignoreGlobs.map(
      (glob) => globToRegExp("**/" + glob),
    );

    return Promise.resolve(args.items.filter(
      (item) => {
        const action = item.action as ActionData;
        if (!action.path) return false;
        for (const pattern of args.filterParams.ignorePatterns) {
          if (action.path.search(pattern) >= 0) {
            return false;
          }
        }
        for (const glob of ignoreGlobs) {
          if (glob.test(action.path)) {
            return false;
          }
        }
        return true;
      },
    ));
  }

  override params(): Params {
    return {
      ignoreGlobs: [],
      ignorePatterns: [],
    };
  }
}
