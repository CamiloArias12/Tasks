import { UserRes } from "@/modules/dashboard/types";
import { atom } from "jotai";

export const clientState = atom<UserRes | null>(null);
