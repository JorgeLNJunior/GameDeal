/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";

window.scrollTo = vi.fn<any>();
HTMLCanvasElement.prototype.getContext = vi.fn<any>();
