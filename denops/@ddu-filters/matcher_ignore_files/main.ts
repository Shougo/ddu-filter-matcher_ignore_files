import type { DduItem } from "@shougo/ddu-vim/types";
import { BaseFilter } from "@shougo/ddu-vim/filter";

import type { ActionData } from "@shougo/ddu-kind-file";

import type { Denops } from "@denops/std";

import { globToRegExp } from "@std/path/glob-to-regexp";

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
