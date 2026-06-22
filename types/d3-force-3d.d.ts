declare module 'd3-force-3d' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function forceSimulation<T = any>(nodes?: T[], numDimensions?: number): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function forceLink<T = any>(links?: T[]): any
  export function forceManyBody(): any
  export function forceCenter(x?: number, y?: number, z?: number): any
  export function forceCollide(radius?: number): any
}
