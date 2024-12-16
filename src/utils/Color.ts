// Color.ts
export enum Color {
    Blue,
    Orange,
    Green,
}

export const colors = { // Change interface to constant
    [Color.Blue]: {
        bg: "bg-blue-400",
        border: "border-blue-400",
    },
    [Color.Orange]: {
        bg: "bg-orange-400",
        border: "border-orange-400",
    },
    [Color.Green]: {
        bg: "bg-green-400",
        border: "border-green-400",
    },
};