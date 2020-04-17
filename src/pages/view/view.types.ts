import { IBlock } from "../../common/common.types";

export interface IBlockAnimationState {
  opacity: number;
}

export type AnimateHandlerReturn<T> = {
  [K in keyof T]?: T[K] | Array<T[K]>;
} & {
  timing?: { duration?: number; delay?: number };
  events?: { [K in PropertyKey]: () => void };
};

export type UpdateHandler = (
  item: IBlock,
  index: number
) => AnimateHandlerReturn<IBlockAnimationState>;
